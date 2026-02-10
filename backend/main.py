from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os 
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from datetime import timedelta, datetime, timezone

from database import Base, engine, get_db
from models import Message, User
from schemas import (
    MessageCreate, MessageUpdate, MessageResponse,
    UserCreate, UserResponse, Token, TokenData, MessageType,
)
from security import (
    verify_password, get_password_hash,
    create_access_token, decode_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/voice")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

Base.metadata.create_all(bind=engine)

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

app = FastAPI(title="OnePercent", version="1.0.0")

# CORS middleware - allow requests from mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")

@app.get("/")
async def root():
    """
    Root endpoint - returns API information
    This is the homepage of your API
    """
    return {"message": "OnePercent API is running", "version": "1.0.0"}


# Get current user from token
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency that extracts and verifies JWT token.
    Used in protected routes.
    
    Steps:
    1. Extract token from Authorization header
    2. Decode token
    3. Get user from database
    4. Return user (or raise error if invalid)
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    # Extract user ID from token
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    try:
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise credentials_exception
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

############################# MESSAGES ############################

@app.post("/api/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:

        data = message.model_dump() 
        if not data.get("title"):
            title = datetime.now(timezone.utc).strftime("%B %d, %Y")
        else:
            title = data["title"]
        focus_area = data.get("focus_area") or None
        db_message = Message(
            user_id=current_user.id, 
            title=title, content=data["content"], 
            message_type=data["message_type"], 
            focus_area=focus_area
            )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message
    except Exception as e:
        db.rollback()  
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create message: {str(e)}"
        )


@app.get("/api/messages", response_model=List[MessageResponse])
def list_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    try:
        messages = db.query(Message).filter(
            Message.user_id == current_user.id  
        ).order_by(Message.created_at.desc()).all()
        return messages
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch messages: {str(e)}"
        )


# TODO: Update/Review this function to list of message
@app.get("/api/messages/stats")
def get_message_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get statistics about user's messages.
    Returns: total count, by type (text/voice), etc.
    """
    try:
        from sqlalchemy import func

        
        now = datetime.now(timezone.utc)
        
        # Total messages
        total = db.query(Message).filter(
            Message.user_id == current_user.id
        ).count()
        # Messages by type
        text_count = db.query(Message).filter(
            Message.user_id == current_user.id,
            Message.message_type == "text"
        ).count()
        
        voice_count = db.query(Message).filter(
            Message.user_id == current_user.id,
            Message.message_type == "voice"
        ).count()
        
        return {
            "total_messages": total,
            "text_messages": text_count,
            "voice_messages": voice_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch statistics: {str(e)}"
        )


@app.get("/api/messages/{message_id}", response_model=MessageResponse)
def get_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    try:
        message = db.query(Message).filter(
            Message.id == message_id,
            Message.user_id == current_user.id  
        ).first()
        if not message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
        return message
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch message: {str(e)}"
        )


@app.put("/api/messages/{message_id}", response_model=MessageResponse)
def update_message(message_id: int, update_data: MessageUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        message = db.query(Message).filter(Message.id == message_id, Message.user_id == current_user.id).first()
        if not message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

        # exclude_unset=True during updates avoids overwriting missing fields.
        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(message, field, value)

        db.commit()
        db.refresh(message)
        return message
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update message: {str(e)}"
        )


@app.delete("/api/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        message = db.query(Message).filter(Message.id == message_id, Message.user_id == current_user.id).first()
        if not message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

        db.delete(message)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete message: {str(e)}"
        )


@app.post("/api/messages/upload-voice", response_model=MessageResponse)
async def upload_voice_message(
    file: UploadFile = File(...),  # The audio file
    title: Optional[str] = Form(None),  # Title from form data
    focus_area: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a voice message (audio file).
    
    Steps:
    1. Validate file type (should be audio)
    2. Save file to disk
    3. Create message record in database
    4. Return message with file URL
    """
    try:
        # Check both content-type and file extension
        is_audio_content_type = file.content_type and file.content_type.startswith("audio/")
        is_audio_extension = False
        file_extension = "mp3"  # Default fallback

        if file.filename:
            # Get file extension (lowercase for consistency)
            file_extension = file.filename.split(".")[-1].lower() if "." in file.filename else "mp3"
            audio_extensions = {"mp3", "wav", "m4a", "aac", "ogg", "flac"}
            is_audio_extension = file_extension in audio_extensions

        if not (is_audio_content_type or is_audio_extension):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an audio file (audio/* content-type or .mp3/.wav/.m4a extension)"
            )
        
        # Reuse file_extension variable (already lowercase)
        import uuid
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
        
        with open(file_path, "wb") as buffer:
            content = await file.read()  
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File too large. Maximum size is 10MB"
                )
            buffer.write(content) 

        
        # Step 4: Create message in database
        if not title:
            title = datetime.now(timezone.utc).strftime("%B %d, %Y")
        
        if not focus_area:
            focus_area = None

        db_message = Message(
            title=title,
            focus_area = focus_area,
            message_type=MessageType.VOICE,
            voice_file_path=str(file_path),  
            user_id=current_user.id
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        return db_message
        
    except HTTPException:
        raise
    except Exception as e:
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()  
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload voice message: {str(e)}"
        )

@app.get("/api/messages/{message_id}/voice")
async def get_voice_file(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get voice file for a message.
    Returns the audio file for streaming/download.
    """
    try:
        message = db.query(Message).filter(
            Message.id == message_id,
            Message.user_id == current_user.id
        ).first()
        
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        
        if not message.voice_file_path:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="This message has no voice file"
            )
        
        file_path = Path(message.voice_file_path)
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice file not found on server"
            )
        
        from fastapi.responses import FileResponse
        return FileResponse(
            path=file_path,
            media_type="audio/mpeg",  
            filename=(message.title or str(message.id)) + ".mp3"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve voice file: {str(e)}"
        )

############################# AUTHENTICATION ############################

# Registration endpoint
@app.post("/api/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password and Create user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

         # Create token
        expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token = create_access_token(data={"sub": str(db_user.id)}, expires_delta=expires)
        
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user: {str(e)}"
        )

# Login endpoint
@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login user and return JWT token.
    
    Steps:
    1. Find user by email
    2. Verify password
    3. Create JWT token
    4. Return token
    """
    try:
        # Find user (OAuth2PasswordRequestForm uses 'username' field for email)
        user = db.query(User).filter(User.email == form_data.username).first()
        
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},  # "sub" = subject (user ID)
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to login: {str(e)}"
        )

# Who I am endpoint
@app.get("/api/auth/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    try:
        return current_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user data: {str(e)}"
        )

############################# ERROR HANDLING ############################

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for validation errors.
    Returns consistent error format.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),  
            "message": "Validation error: Please check your input"
        }
    )

# Custom exception handler for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Custom handler for HTTP exceptions.
    Returns consistent error format.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "message": exc.detail  
        }
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    import uvicorn