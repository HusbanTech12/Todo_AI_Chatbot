"""
MCP (Model Context Protocol) Tools for Todo AI Chatbot Backend
These tools provide the interface between the AI agent and the database operations
All tools must follow constitutional requirements - no direct DB access from AI agent
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.conversation import Conversation
from ..models.message import Message
from ..db.session import get_db_session
from ..auth.middleware import validate_user_ownership


# Tool Input/Output Schemas
class AddTaskInput(BaseModel):
    user_id: int = Field(..., description="The ID of the user")
    title: str = Field(..., description="Title of the task (1-255 characters)")
    description: Optional[str] = Field(None, description="Optional description of the task (max 1000 characters)")


class AddTaskOutput(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    task_id: int = Field(..., description="ID of the created task")
    message: str = Field(..., description="Confirmation message")


class ListTasksInput(BaseModel):
    user_id: int = Field(..., description="The ID of the user")
    status: Optional[str] = Field(None, description="Filter tasks by status (pending, completed, all)")


class TaskInfo(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: Any  # datetime
    updated_at: Any  # datetime


class ListTasksOutput(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    tasks: List[TaskInfo] = Field(..., description="List of tasks")
    message: str = Field(..., description="Status message")


class CompleteTaskInput(BaseModel):
    user_id: int = Field(..., description="The ID of the user")
    task_id: int = Field(..., description="ID of the task to complete")


class CompleteTaskOutput(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Confirmation message")


class DeleteTaskInput(BaseModel):
    user_id: int = Field(..., description="The ID of the user")
    task_id: int = Field(..., description="ID of the task to delete")


class DeleteTaskOutput(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Confirmation message")


class UpdateTaskInput(BaseModel):
    user_id: int = Field(..., description="The ID of the user")
    task_id: int = Field(..., description="ID of the task to update")
    title: Optional[str] = Field(None, description="New title for the task (optional)")
    description: Optional[str] = Field(None, description="New description for the task (optional)")
    completed: Optional[bool] = Field(None, description="New completion status (optional)")


class UpdateTaskOutput(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Confirmation message")


# MCP Tool Implementations
def add_task(input_data: AddTaskInput) -> AddTaskOutput:
    """
    Add a new task to the database
    MCP Tool: Creates a new task with the given parameters
    """
    try:
        # Validate input data
        if not input_data.title or len(input_data.title.strip()) == 0:
            return AddTaskOutput(
                success=False,
                task_id=-1,
                message="Task title is required and cannot be empty"
            )

        # Create task data from input
        task_create = TaskCreate(
            user_id=input_data.user_id,
            title=input_data.title,
            description=input_data.description,
            completed=False  # New tasks are not completed by default
        )

        # Create task in database
        with get_db_session() as session:
            task = Task.from_orm(task_create) if hasattr(Task, 'from_orm') else Task(**task_create.dict())
            session.add(task)
            session.commit()
            session.refresh(task)

            return AddTaskOutput(
                success=True,
                task_id=task.id,
                message=f"Task '{task.title}' has been added successfully"
            )
    except Exception as e:
        return AddTaskOutput(
            success=False,
            task_id=-1,
            message=f"Failed to add task: {str(e)}"
        )


def list_tasks(input_data: ListTasksInput) -> ListTasksOutput:
    """
    List tasks with optional filtering by status
    MCP Tool: Retrieves tasks based on user_id and status filter
    """
    try:
        with get_db_session() as session:
            # Build query based on status filter
            query = select(Task).where(Task.user_id == input_data.user_id)

            if input_data.status:
                status_lower = input_data.status.lower()
                if status_lower == "pending":
                    query = query.where(Task.completed == False)
                elif status_lower == "completed":
                    query = query.where(Task.completed == True)
                elif status_lower != "all":
                    return ListTasksOutput(
                        success=False,
                        tasks=[],
                        message=f"Invalid status filter: {input_data.status}. Use 'pending', 'completed', or 'all'."
                    )

            tasks = session.exec(query).all()

            # Convert to output format
            task_infos = []
            for task in tasks:
                task_info = TaskInfo(
                    id=task.id,
                    title=task.title,
                    description=task.description,
                    completed=task.completed,
                    created_at=task.created_at,
                    updated_at=task.updated_at
                )
                task_infos.append(task_info)

            return ListTasksOutput(
                success=True,
                tasks=task_infos,
                message=f"Retrieved {len(tasks)} tasks"
            )
    except Exception as e:
        return ListTasksOutput(
            success=False,
            tasks=[],
            message=f"Failed to list tasks: {str(e)}"
        )


def complete_task(input_data: CompleteTaskInput) -> CompleteTaskOutput:
    """
    Mark a task as complete
    MCP Tool: Updates the completion status of a specific task
    """
    try:
        with get_db_session() as session:
            # Get the task
            task = session.get(Task, input_data.task_id)

            # Validate existence and ownership
            if not task:
                return CompleteTaskOutput(
                    success=False,
                    message=f"Task with ID {input_data.task_id} not found"
                )

            if task.user_id != input_data.user_id:
                return CompleteTaskOutput(
                    success=False,
                    message="Access denied: You can only update your own tasks"
                )

            # Update task status
            task.completed = True
            session.add(task)
            session.commit()

            return CompleteTaskOutput(
                success=True,
                message=f"Task '{task.title}' has been marked as complete"
            )
    except Exception as e:
        return CompleteTaskOutput(
            success=False,
            message=f"Failed to complete task: {str(e)}"
        )


def delete_task(input_data: DeleteTaskInput) -> DeleteTaskOutput:
    """
    Delete a task from the database
    MCP Tool: Removes a specific task from the database
    """
    try:
        with get_db_session() as session:
            # Get the task
            task = session.get(Task, input_data.task_id)

            # Validate existence and ownership
            if not task:
                return DeleteTaskOutput(
                    success=False,
                    message=f"Task with ID {input_data.task_id} not found"
                )

            if task.user_id != input_data.user_id:
                return DeleteTaskOutput(
                    success=False,
                    message="Access denied: You can only delete your own tasks"
                )

            # Delete the task
            session.delete(task)
            session.commit()

            return DeleteTaskOutput(
                success=True,
                message=f"Task '{task.title}' has been deleted"
            )
    except Exception as e:
        return DeleteTaskOutput(
            success=False,
            message=f"Failed to delete task: {str(e)}"
        )


def update_task(input_data: UpdateTaskInput) -> UpdateTaskOutput:
    """
    Update a task in the database
    MCP Tool: Updates specific fields of an existing task
    """
    try:
        with get_db_session() as session:
            # Get the task
            task = session.get(Task, input_data.task_id)

            # Validate existence and ownership
            if not task:
                return UpdateTaskOutput(
                    success=False,
                    message=f"Task with ID {input_data.task_id} not found"
                )

            if task.user_id != input_data.user_id:
                return UpdateTaskOutput(
                    success=False,
                    message="Access denied: You can only update your own tasks"
                )

            # Update fields that were provided
            update_occurred = False
            if input_data.title is not None:
                task.title = input_data.title
                update_occurred = True
            if input_data.description is not None:
                task.description = input_data.description
                update_occurred = True
            if input_data.completed is not None:
                task.completed = input_data.completed
                update_occurred = True

            # Only update timestamp if an actual update occurred
            if update_occurred:
                task.updated_at = task.__class__.updated_at.default.arg()  # Update timestamp
                session.add(task)
                session.commit()
                session.refresh(task)

            return UpdateTaskOutput(
                success=True,
                message=f"Task '{task.title}' has been updated"
            )
    except Exception as e:
        return UpdateTaskOutput(
            success=False,
            message=f"Failed to update task: {str(e)}"
        )


# Dictionary mapping tool names to their functions
MCP_TOOLS = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task
}


def get_mcp_tool(tool_name: str):
    """
    Get an MCP tool function by name
    """
    return MCP_TOOLS.get(tool_name)