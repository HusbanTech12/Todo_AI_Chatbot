"""
Logging utilities for Todo AI Chatbot Backend
"""
import logging
import sys
from datetime import datetime
from typing import Optional
import uuid


class CorrelationIdFilter(logging.Filter):
    """
    Adds a correlation ID to each log record
    """
    def filter(self, record):
        if not hasattr(record, 'correlation_id'):
            record.correlation_id = getattr(CorrelationIdContext.current, 'correlation_id', 'N/A')
        return True


class CorrelationIdContext:
    """
    Context manager for correlation IDs
    """
    current = type('Context', (), {'correlation_id': 'N/A'})()

    @classmethod
    def set_correlation_id(cls, correlation_id: str):
        cls.current.correlation_id = correlation_id

    @classmethod
    def generate_correlation_id(cls) -> str:
        correlation_id = str(uuid.uuid4())
        cls.set_correlation_id(correlation_id)
        return correlation_id


def setup_logging():
    """
    Setup logging configuration for the application
    """
    # Create formatter with correlation ID
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - [Correlation-ID: %(correlation_id)s] - %(message)s'
    )

    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    # Add filter for correlation ID
    handler.addFilter(CorrelationIdFilter())

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(handler)

    # Prevent duplicate logs from uvicorn
    logging.getLogger("uvicorn").handlers.clear()
    logging.getLogger("uvicorn.access").handlers.clear()
    logging.getLogger("uvicorn.error").handlers.clear()


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger with the specified name
    """
    return logging.getLogger(name)


def log_request_lifecycle(
    correlation_id: str,
    user_id: int,
    endpoint: str,
    method: str,
    status_code: Optional[int] = None,
    duration_ms: Optional[float] = None
):
    """
    Log request lifecycle information
    """
    logger = get_logger("request.lifecycle")

    if status_code is None:
        logger.info(
            f"Request started - Correlation ID: {correlation_id}, "
            f"User ID: {user_id}, Endpoint: {method} {endpoint}"
        )
    else:
        duration_str = f", Duration: {duration_ms:.2f}ms" if duration_ms else ""
        logger.info(
            f"Request completed - Correlation ID: {correlation_id}, "
            f"User ID: {user_id}, Endpoint: {method} {endpoint}, "
            f"Status: {status_code}{duration_str}"
        )


def log_mcp_tool_call(
    correlation_id: str,
    user_id: int,
    tool_name: str,
    success: bool,
    duration_ms: Optional[float] = None
):
    """
    Log MCP tool call information
    """
    logger = get_logger("mcp.tools")

    status = "SUCCESS" if success else "FAILED"
    duration_str = f", Duration: {duration_ms:.2f}ms" if duration_ms else ""

    logger.info(
        f"MCP Tool Called - Correlation ID: {correlation_id}, "
        f"User ID: {user_id}, Tool: {tool_name}, Status: {status}{duration_str}"
    )


def log_error(
    correlation_id: str,
    user_id: int,
    error_type: str,
    error_message: str,
    endpoint: Optional[str] = None
):
    """
    Log error information
    """
    logger = get_logger("errors")

    endpoint_str = f", Endpoint: {endpoint}" if endpoint else ""

    logger.error(
        f"Error Occurred - Correlation ID: {correlation_id}, "
        f"User ID: {user_id}, Type: {error_type}, Message: {error_message}{endpoint_str}"
    )