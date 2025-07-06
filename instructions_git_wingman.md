# Git Wingman Tools Instructions

The git_wingman tools, located in Wingman/Tools/, are Python scripts designed to automate Git operations for managing files in a repository. Each tool follows the OODA (Observe, Orient, Decide, Act) loop for error handling, ensuring robust execution. This document provides instructions for using each tool.

## Prerequisites
- Ensure you are in a Git repository (~/FighterTraining).
- Python 3 is installed.
- Run commands from the repository root directory.

## Tools Overview
All tools are invoked via: python3 Wingman/Tools/git_wingman.py <command> [args]
Available commands are:
1. create_folder: Creates a new folder with a .gitkeep file, commits, and pushes.
2. create_file: Creates a new file with specified content, commits, and pushes.
3. delete_file: Deletes a file, commits, and pushes.
4. edit_file: Edits an existing file with new content, commits, and pushes.
5. find_replace: Replaces text in a file, commits, and pushes.
6. list_files: Lists all files in the Git repository.
7. move_file: Moves or renames a file, commits, and pushes.
8. pull_confirm: Displays the content of a file or searches for a pattern.

## Usage Instructions

### 1. Create a Folder
Command: python3 Wingman/Tools/git_wingman.py create_folder --name <folder_path> [--message "<commit_message>"]
- --name: Path of the folder to create (e.g., NewFolder/SubFolder).
- --message: Optional commit message (defaults to "Create folder <folder_path>").
- Example: python3 Wingman/Tools/git_wingman.py create_folder --name "NewFolder" --message "Add NewFolder for documentation"
- Behavior: Creates the folder, adds a .gitkeep file, commits, and pushes to the remote repository. Errors if the folder already exists.

### 2. Create a File
Command: python3 Wingman/Tools/git_wingman.py create_file --path <file_path> [--content "<content>" | --from_file <source_file>] [--message "<commit_message>"]
- --path: Path of the file to create (e.g., Docs/newfile.md).
- --content: Content to write to the file (mutually exclusive with --from_file).
- --from_file: Path to a file whose content will be copied.
- --message: Optional commit message (defaults to "Create file <file_path>").
- Example: python3 Wingman/Tools/git_wingman.py create_file --path "Docs/test.md" --content "# Test\nContent here" --message "Add test.md"
- Behavior: Creates the file with the specified content, creates parent directories if needed, commits, and pushes. Errors if the file exists or if both --content and --from_file are provided.

### 3. Delete a File
Command: python3 Wingman/Tools/git_wingman.py delete_file --path <file_path> [--message "<commit_message>"]
- --path: Path of the file to delete.
- --message: Optional commit message (defaults to "Delete file <file_path>").
- Example: python3 Wingman/Tools/git_wingman.py delete_file --path "Docs/test.md" --message "Remove test.md"
- Behavior: Deletes the file, commits, and pushes. If the file is untracked, it’s added and committed before deletion. Errors if the file doesn’t exist.

### 4. Edit a File
Command: python3 Wingman/Tools/git_wingman.py edit_file --path <file_path> [--content "<content>" | --from_file <source_file>] [--message "<commit_message>"]
- --path: Path of the file to edit.
- --content: New content for the file (mutually exclusive with --from_file).
- --from_file: Path to a file whose content will replace the target file’s content.
- --message: Optional commit message (defaults to "Edit file <file_path>").
- Example: python3 Wingman/Tools/git_wingman.py edit_file --path "Docs/test.md" --content "# Updated\nNew content" --message "Update test.md"
- Behavior: Overwrites the file with new content, commits, and pushes. If no changes are made, no commit occurs. Errors if the file doesn’t exist or if both --content and --from_file are provided.

### 5. Find and Replace in a File
Command: python3 Wingman/Tools/git_wingman.py find_replace --file <file_path> --search "<search_string>" --replace "<replace_string>" [--message "<commit_message>"]
- --file: Path of the file to edit.
- --search: String to search for.
- --replace: String to replace with.
- --message: Optional commit message (defaults to "Update <file_path>: replace '<search_string>' with '<replace_string>'").
- Example: python3 Wingman/Tools/git_wingman.py find_replace --file "Docs/test.md" --search "old text" --replace "new text" --message "Replace text in test.md"
- Behavior: Replaces all instances of search_string with replace_string, commits, and pushes. If no changes are made, no commit occurs. Errors if the file doesn’t exist.

### 6. List Files
Command: python3 Wingman/Tools/git_wingman.py list_files
- Example: python3 Wingman/Tools/git_wingman.py list_files
- Behavior: Lists all files tracked by Git in the repository.

### 7. Move or Rename a File
Command: python3 Wingman/Tools/git_wingman.py move_file --old_path <old_path> --new_path <new_path> [--message "<commit_message>"]
- --old_path: Current path of the file.
- --new_path: New path for the file.
- --message: Optional commit message (defaults to "Move file from <old_path> to <new_path>").
- Example: python3 Wingman/Tools/git_wingman.py move_file --old_path "Docs/test.md" --new_path "Docs/renamed.md" --message "Rename test.md to renamed.md"
- Behavior: Moves the file, commits, and pushes. If the file is untracked, it’s added and committed before moving. Errors if the old path doesn’t exist or the new path already exists.

### 8. Pull and Confirm File Content
Command: python3 Wingman/Tools/git_wingman.py pull_confirm --file <file_path> [--pattern "<search_pattern>"]
- --file: Path of the file to display or search.
- --pattern: Optional pattern to search for in the file.
- Example: python3 Wingman/Tools/git_wingman.py pull_confirm --file "Docs/test.md"
- Example: python3 Wingman/Tools/git_wingman.py pull_confirm --file "Docs/test.md" --pattern "search text"
- Behavior: Displays the file’s content or searches for the pattern. Errors if the file doesn’t exist.

## Error Handling
All tools implement OODA error handling:
- Observe: Check file/folder existence, Git repository status, or valid inputs.
- Orient: Validate inputs (e.g., mutually exclusive arguments).
- Decide: Determine if the operation can proceed or should error out.
- Act: Perform the operation (create, delete, edit, etc.) and handle Git commands, raising errors for failures.

## Notes
- Ensure you’re in the repository root (~/FighterTraining) before running commands.
- Use quotes for paths or arguments with spaces (e.g., "Works of John Boyd/A Proposed Plan for Fighter vs Fighter Training/fighter_vs_fighter_training.md").
- Check the GitHub repository (https://github.com/IsidoreLands/FighterTraining) to verify changes after pushing.
