"""
Todo AI Agent for Todo AI Chatbot Backend
This agent handles natural language processing and tool selection
Following constitutional requirements - only uses MCP tools for DB operations
"""

import json
from typing import List, Dict, Any
from ..mcp.tools import (
    add_task, list_tasks, complete_task, delete_task, update_task,
    AddTaskInput, ListTasksInput, CompleteTaskInput, DeleteTaskInput, UpdateTaskInput
)


def run_todo_agent(messages: List[Dict[str, str]], user_id: int) -> Dict[str, Any]:
    """
    Run the Todo AI Agent with conversation context

    Args:
        messages: List of messages in the conversation [role, content]
        user_id: ID of the authenticated user

    Returns:
        Dictionary with response and tool calls executed
    """
    # Process the last user message to determine intent
    if not messages:
        return {
            "response": "Hello! How can I help you manage your tasks today?",
            "tool_calls": []
        }

    # Get the last user message
    last_user_message = ""
    for msg in reversed(messages):
        if msg["role"] == "user":
            last_user_message = msg["content"]
            break

    if not last_user_message:
        return {
            "response": "How can I assist you with your tasks?",
            "tool_calls": []
        }

    # Determine intent and call appropriate tools
    response, tool_calls = process_intent(last_user_message, user_id)

    return {
        "response": response,
        "tool_calls": tool_calls
    }


def process_intent(message: str, user_id: int) -> tuple[str, List[str]]:
    """
    Process user intent and execute appropriate MCP tools
    """
    message_lower = message.lower().strip()
    tool_calls = []

    try:
        # Intent mapping based on constitutional requirements
        if any(word in message_lower for word in ["add", "create", "remember", "new task"]):
            # Extract task details from message
            task_title = extract_task_title(message)
            if task_title:
                # Prepare input for add_task
                input_data = AddTaskInput(user_id=user_id, title=task_title)

                # Call the MCP tool
                result = add_task(input_data)
                tool_calls.append("add_task")

                if result.success:
                    return f"✅ Task **{result.task_id}** has been added: {task_title}", tool_calls
                else:
                    return f"❌ Failed to add task: {result.message}", tool_calls
            else:
                return "I need a clear task title to add a new task. Please specify what you'd like to do.", tool_calls

        elif any(word in message_lower for word in ["show", "list", "what", "have", "pending"]):
            # Check for status filters
            status = None
            if "pending" in message_lower:
                status = "pending"
            elif "completed" in message_lower or "done" in message_lower:
                status = "completed"

            # Prepare input for list_tasks
            input_data = ListTasksInput(user_id=user_id, status=status)

            # Call the MCP tool
            result = list_tasks(input_data)
            tool_calls.append("list_tasks")

            if result.success:
                if result.tasks:
                    task_list = "\n".join([f"- {task.id}: {task.title}" for task in result.tasks])
                    status_text = f"{status} " if status else ""
                    return f"Here are your {status_text}tasks:\n{task_list}", tool_calls
                else:
                    status_text = f"{status} " if status else ""
                    return f"You have no {status_text}tasks at the moment.", tool_calls
            else:
                return f"❌ Failed to list tasks: {result.message}", tool_calls

        elif any(word in message_lower for word in ["done", "finished", "complete", "mark"]):
            # Try to extract task ID from message
            task_id = extract_task_id(message)
            if task_id and task_id > 0:
                # Prepare input for complete_task
                input_data = CompleteTaskInput(user_id=user_id, task_id=task_id)

                # Call the MCP tool
                result = complete_task(input_data)
                tool_calls.append("complete_task")

                if result.success:
                    return f"✅ Task has been marked as complete.", tool_calls
                else:
                    return f"❌ Failed to complete task: {result.message}", tool_calls
            else:
                return "Please specify which task you'd like to mark as complete (e.g., 'Mark task 1 as complete').", tool_calls

        elif any(word in message_lower for word in ["delete", "remove"]):
            # Try to extract task ID from message
            task_id = extract_task_id(message)
            if task_id and task_id > 0:
                # Prepare input for delete_task
                input_data = DeleteTaskInput(user_id=user_id, task_id=task_id)

                # Call the MCP tool
                result = delete_task(input_data)
                tool_calls.append("delete_task")

                if result.success:
                    return f"✅ Task has been deleted.", tool_calls
                else:
                    return f"❌ Failed to delete task: {result.message}", tool_calls
            else:
                return "Please specify which task you'd like to delete (e.g., 'Delete task 1').", tool_calls

        elif any(word in message_lower for word in ["change", "update", "modify"]):
            # Extract task ID and new details
            task_id = extract_task_id(message)
            if task_id and task_id > 0:
                # For now, we'll just acknowledge the update request
                return f"I understand you want to update task {task_id}. For specific updates, please provide details like 'Change task {task_id} to [new description]'.", tool_calls
            else:
                return "Please specify which task you'd like to update (e.g., 'Update task 1 to [new details]').", tool_calls

        else:
            # Default response for unrecognized intents
            return "I understand you want to manage your tasks. You can ask me to add, list, complete, or delete tasks. For example: 'Add a task to buy groceries' or 'Show my pending tasks'.", tool_calls

    except Exception as e:
        # Protect agent runner from crashes
        return f"Sorry, I encountered an error while processing your request: {str(e)}. Please try again or rephrase your request.", tool_calls


def extract_task_title(message: str) -> str:
    """
    Extract task title from user message
    This is a simple implementation - in reality, you'd want more sophisticated NLP
    """
    message_lower = message.lower().strip()

    # Look for common patterns
    if "add" in message_lower and "to" in message_lower:
        # Pattern: "add X to Y" or "add a task to X"
        parts = message_lower.split("to")
        if len(parts) > 1:
            title = parts[1].strip()
            # Clean up common phrases
            title = title.replace("a ", "").replace("an ", "").replace("the ", "")
            return title or ""

    if "add" in message_lower:
        # Pattern: "add X" where X is the task
        parts = message_lower.split("add")
        if len(parts) > 1:
            title = parts[1].strip()
            return title or ""

    # If the message is short, consider the whole thing as the task
    if len(message.split()) <= 6 and "task" not in message_lower:
        return message.strip()

    return ""


def extract_task_id(message: str) -> int:
    """
    Extract task ID from user message
    This is a simple implementation
    """
    import re

    # Look for patterns like "task 1", "task #1", "#1", etc.
    patterns = [
        r'task #?(\d+)',  # task 1, task#1, task #1
        r'#(\d+)',        # #1
        r'id (\d+)'       # id 1
    ]

    for pattern in patterns:
        match = re.search(pattern, message.lower())
        if match:
            return int(match.group(1))

    # If no explicit task ID found, return -1
    return -1