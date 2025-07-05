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

def delete_file(file_path, message=None):
    if not os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' does not exist.")
    run_git_command(['rm', file_path])
    if message is None:
        message = f"Delete file {file_path}"
    run_git_command(['commit', '-m', message])
    push_changes()

def execute(args):
    parser = argparse.ArgumentParser(description="Delete a file")
    parser.add_argument('--path', required=True, help='Path of the file to delete')
    parser.add_argument('--message', help='Commit message')
    parsed_args = parser.parse_args(args)
    delete_file(parsed_args.path, parsed_args.message)
