import os
import subprocess
import argparse
import sys

def run_git_command(args, check=True):
    """Run a Git command and handle errors."""
    result = subprocess.run(['git'] + args, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"Git command failed: {' '.join(args)}\n{result.stderr}")
    return result

def push_changes():
    """Push changes to the remote repository."""
    current_branch = run_git_command(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.strip()
    remote = run_git_command(['config', '--get', f'branch.{current_branch}.remote']).stdout.strip()
    run_git_command(['push', remote, current_branch])

def create_folder(folder_name, message=None):
    """Create a new folder with a .gitkeep file, commit, and push."""
    if os.path.exists(folder_name):
        raise ValueError(f"Folder '{folder_name}' already exists.")
    os.makedirs(folder_name)
    gitkeep_path = os.path.join(folder_name, '.gitkeep')
    with open(gitkeep_path, 'w') as f:
        pass  # Create an empty file
    run_git_command(['add', gitkeep_path])
    if message is None:
        message = f"Create folder {folder_name}"
    run_git_command(['commit', '-m', message])
    push_changes()

def create_file(file_path, content=None, from_file=None, message=None):
    """Create a new file with content, commit, and push."""
    if os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' already exists.")
    if content is not None and from_file is not None:
        raise ValueError("Cannot provide both --content and --from_file.")
    elif content is not None:
        file_content = content
    elif from_file is not None:
        with open(from_file, 'r') as f:
            file_content = f.read()
    else:
        raise ValueError("Either --content or --from_file must be provided.")
    dir_name = os.path.dirname(file_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(file_path, 'w') as f:
        f.write(file_content)
    run_git_command(['add', file_path])
    if message is None:
        message = f"Create file {file_path}"
    run_git_command(['commit', '-m', message])
    push_changes()

def edit_file(file_path, content=None, from_file=None, message=None):
    """Edit an existing file with new content, commit, and push."""
    if not os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' does not exist.")
    if content is not None and from_file is not None:
        raise ValueError("Cannot provide both --content and --from_file.")
    elif content is not None:
        file_content = content
    elif from_file is not None:
        with open(from_file, 'r') as f:
            file_content = f.read()
    else:
        raise ValueError("Either --content or --from_file must be provided.")
    with open(file_path, 'w') as f:
        f.write(file_content)
    run_git_command(['add', file_path])
    if message is None:
        message = f"Edit file {file_path}"
    run_git_command(['commit', '-m', message])
    push_changes()

def main():
    """Parse arguments and execute actions."""
    try:
        result = run_git_command(['rev-parse', '--is-inside-work-tree'], check=False)
        if result.stdout.strip() != 'true':
            raise RuntimeError("Not inside a Git repository.")
        
        parser = argparse.ArgumentParser(description="Git Wingman: Automate Git operations.")
        subparsers = parser.add_subparsers(dest='action', required=True)
        
        create_folder_parser = subparsers.add_parser('create_folder', help='Create a new folder with .gitkeep')
        create_folder_parser.add_argument('--name', required=True, help='Name of the folder to create')
        create_folder_parser.add_argument('--message', help='Commit message')
        
        create_file_parser = subparsers.add_parser('create_file', help='Create a new file')
        create_file_parser.add_argument('--path', required=True, help='Path of the file to create')
        create_file_parser.add_argument('--content', help='Content of the file')
        create_file_parser.add_argument('--from_file', help='Path to a file to copy content from')
        create_file_parser.add_argument('--message', help='Commit message')
        
        edit_file_parser = subparsers.add_parser('edit_file', help='Edit an existing file')
        edit_file_parser.add_argument('--path', required=True, help='Path of the file to edit')
        edit_file_parser.add_argument('--content', help='New content of the file')
        edit_file_parser.add_argument('--from_file', help='Path to a file to copy content from')
        edit_file_parser.add_argument('--message', help='Commit message')
        
        args = parser.parse_args()
        
        if args.action == 'create_folder':
            create_folder(args.name, args.message)
        elif args.action == 'create_file':
            create_file(args.path, args.content, args.from_file, args.message)
        elif args.action == 'edit_file':
            edit_file(args.path, args.content, args.from_file, args.message)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
