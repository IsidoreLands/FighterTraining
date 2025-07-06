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

def create_file(file_path, content="", message=None):
    if os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' already exists.")
    dir_name = os.path.dirname(file_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(file_path, 'w') as f:
        f.write(content)
    run_git_command(['add', file_path])
    if message is None:
        message = f"Create file {file_path}"
    run_git_command(['commit', '-m', message])
    # push_changes()

def execute(args):
    parser = argparse.ArgumentParser(description="Create a new file")
    parser.add_argument('--path', required=True, help='Path of the file to create')
    parser.add_argument('--content', default="", help='Content of the file')
    parser.add_argument('--message', help='Commit message')
    parsed_args = parser.parse_args(args)
    create_file(parsed_args.path, parsed_args.content, parsed_args.message)
