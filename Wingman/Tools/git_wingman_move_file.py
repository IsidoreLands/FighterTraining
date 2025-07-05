import argparse
import os
import subprocess

def run_git_command(args, check=True):
    result = subprocess.run(['git'] + args, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"Git command failed: {' '.join(args)}\n{result.stderr}")
    return result

def push_changes():
    current_branch = run_git_command(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.strip()
    remote = run_git_command(['config', '--get', f'branch.{current_branch}.remote']).stdout.strip()
    run_git_command(['push', remote, current_branch])

def is_file_tracked(file_path):
    result = run_git_command(['ls-files', '--error-unmatch', file_path], check=False)
    return result.returncode == 0

def move_file(old_path, new_path, message=None):
    if not os.path.exists(old_path):
        raise ValueError(f"File '{old_path}' does not exist.")
    if os.path.exists(new_path):
        raise ValueError(f"File '{new_path}' already exists.")
    
    # Observe: Check if the file is tracked
    if not is_file_tracked(old_path):
        # Orient & Decide: File is not tracked, so stage and commit it
        run_git_command(['add', old_path])
        run_git_command(['commit', '-m', f"Add {old_path} before moving to {new_path}"])
    
    # Act: Perform the move
    run_git_command(['mv', old_path, new_path])
    if message is None:
        message = f"Move file from {old_path} to {new_path}"
    run_git_command(['commit', '-m', message])
    push_changes()

def execute(args):
    parser = argparse.ArgumentParser(description="Move or rename a file")
    parser.add_argument('--old_path', required=True, help='Current path of the file')
    parser.add_argument('--new_path', required=True, help='New path for the file')
    parser.add_argument('--message', help='Commit message')
    parsed_args = parser.parse_args(args)
    move_file(parsed_args.old_path, parsed_args.new_path, parsed_args.message)
