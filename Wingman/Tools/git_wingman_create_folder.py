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

def create_folder(folder_name, message=None):
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

def execute(args):
    parser = argparse.ArgumentParser(description="Create a new folder with .gitkeep")
    parser.add_argument('--name', required=True, help='Name of the folder to create')
    parser.add_argument('--message', help='Commit message')
    parsed_args = parser.parse_args(args)
    create_folder(parsed_args.name, parsed_args.message)
