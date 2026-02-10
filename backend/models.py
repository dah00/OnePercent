# backend/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from database import Base


class MessageType(str, PyEnum):
    TEXT = "text"
    VOICE = "voice"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)  # text message body or voice transcript
    message_type = Column(Enum(MessageType), nullable=False, default=MessageType.TEXT)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) 
    user = relationship("User", back_populates="messages")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    voice_file_path = Column(String(500), nullable=True)
    focus_area = Column(String(255), nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationship: one user has many Messages
    messages = relationship("Message", back_populates="user")