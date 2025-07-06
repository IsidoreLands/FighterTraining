import argparse
import subprocess
import os

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

def find_replace_in_file(file_path, search, replace):
    if not os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' does not exist.")
    if not is_file_tracked(file_path):
        run_git_command(['add', file_path])
        run_git_command(['commit', '-m', f"Add {file_path} before find and replace"])
    with open(file_path, 'r') as f:
        content = f.read()
    new_content = content.replace(search, replace)
    if new_content == content:
        print("No changes made: search pattern not found.")
        return False
    with open(file_path, 'w') as f:
        f.write(new_content)
    return True

def execute(args):
    parser = argparse.ArgumentParser(description="Find and replace in a file, then commit and push")
    parser.add_argument('--file', required=True, help='Path of the file to edit')
    parser.add_argument('--search', required=True, help='String to search for')
    parser.add_argument('--replace', required=True, help='String to replace with')
    parser.add_argument('--message', help='Commit message')
    parsed_args = parser.parse_args(args)
    
    if find_replace_in_file(parsed_args.file, parsed_args.search, parsed_args.replace):
        run_git_command(['add', parsed_args.file])
        message = parsed_args.message or f"Update {parsed_args.file}: replace '{parsed_args.search}' with '{parsed_args.replace}'"
        run_git_command(['commit', '-m', message])
        push_changes()
    else:
        print("No commit made since no changes were applied.")
