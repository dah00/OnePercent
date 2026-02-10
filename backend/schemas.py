# backend/schemas.py
from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field


class MessageType(str, Enum):
    TEXT = "text"
    VOICE = "voice"


class MessageBase(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    content: Optional[str]
    message_type: MessageType = MessageType.TEXT
    focus_area: Optional[str] = Field(default=None, max_length=255)


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    content: Optional[str] = None
    message_type: Optional[MessageType] = None
    focus_area: Optional[str] = None

class MessageResponse(MessageBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] 
    voice_file_path: Optional[str] = None  

    class Config:
        from_attributes = True  # allows returning SQLAlchemy objects directly

class UserBase(BaseModel):
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)  

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None