# Git Wingman Tools Instructions

The `git_wingman` tools, located in `Wingman/Tools/`, are Python scripts designed to automate Git operations for managing files in a repository. Each tool follows the OODA (Observe, Orient, Decide, Act) loop for error handling, ensuring robust execution. This document provides instructions for using each tool.

## Prerequisites
- Ensure you are in a Git repository (`~/FighterTraining`).
- Python 3 is installed.
- Run commands from the repository root directory.

## Tools Overview
All tools are invoked via `python3 Wingman/Tools/git_wingman.py <command> [args]`. Available commands are:

1. **create_folder**: Creates a new folder with a `.gitkeep` file, commits, and pushes.
2. **create_file**: Creates a new file with specified content, commits, and pushes.
3. **delete_file**: Deletes a file, commits, and pushes.
4. **edit_file**: Edits an existing file with new content, commits, and pushes.
5. **find_replace**: Replaces text in a file, commits, and pushes.
6. **list_files**: Lists all files in the Git repository.
7. **move_file**: Moves or renames a file, commits, and pushes.
8. **pull_confirm**: Displays the content of a file or searches for a pattern.

## Usage Instructions

### 1. Create a Folder
**Command**:
```bash
python3 Wingman/Tools/git_wingman.py create_folder --name <folder_path> [--message "<commit_message>"]
