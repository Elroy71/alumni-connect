from jose import jwt, JWTError
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-this-in-production")
ALGORITHM = "HS256"

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return user data"""
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token.replace('Bearer ', '')
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        
        user_data = {
            'userId': payload.get('userId'),
            'email': payload.get('email'),
            'role': payload.get('role')
        }
        
        print(f"✅ JWT verified successfully for user: {user_data['email']}")
        return user_data
        
    except JWTError as e:
        print(f"❌ JWT verification failed: {str(e)}")
        return None
    except Exception as e:
        print(f"❌ Token verification error: {str(e)}")
        return None

def get_user_from_token(authorization: Optional[str]) -> Optional[dict]:
    """Extract user from Authorization header"""
    if not authorization:
        print("⚠️ No authorization header provided")
        return None
    
    if not authorization.startswith("Bearer "):
        print("⚠️ Authorization header doesn't start with 'Bearer '")
        # Try to verify anyway in case it's just the token
        return verify_token(authorization)
    
    token = authorization.replace("Bearer ", "")
    return verify_token(token)