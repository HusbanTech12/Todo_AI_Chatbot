from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

# For demo purposes, using a simple approach. In production, integrate with Better Auth
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET", "dev-secret-key")

security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    """
    Extract user ID from the authentication token.
    In a real implementation, this would validate the token with Better Auth.
    For now, we'll simulate validation and extract user_id from the token.
    """
    token = credentials.credentials

    # In a real implementation, this would call Better Auth to validate the token
    # For demo purposes, we'll just return a user ID based on a simple validation
    if token == BETTER_AUTH_SECRET or token.startswith("user_"):
        # In a real implementation, parse the token to extract user_id
        # For demo, if token starts with "user_", extract the ID after "user_"
        if token.startswith("user_"):
            try:
                user_id = int(token.split("_")[1])
                return user_id
            except (ValueError, IndexError):
                pass

        # Default user ID for dev environment
        return 1

    raise HTTPException(status_code=401, detail="Invalid authentication credentials")


def require_authentication(request: Request, user_id: int = Depends(get_current_user_id)):
    """
    Middleware function to require authentication for protected routes.
    """
    # Add the user_id to the request state for use in endpoints
    request.state.user_id = user_id
    return user_id


def validate_user_ownership(user_id: int, target_user_id: int):
    """
    Validate that the authenticated user can access the target resource.
    """
    if user_id != target_user_id:
        raise HTTPException(
            status_code=403,
            detail="Access forbidden: Insufficient permissions to access this resource"
        )