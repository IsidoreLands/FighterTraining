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

def edit_file(file_path, content, message=None):
    if not os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' does not exist.")
    if not is_file_tracked(file_path):
        run_git_command(['add', file_path])
        run_git_command(['commit', '-m', f"Add {file_path} before editing"])
    with open(file_path, 'w') as f:
        f.write(content)
    run_git_command(['add', file_path])
    if message is None:
        message = f"Edit file {file_path}"
    run_git_command(['commit', '-m', message])
    push_changes()

def execute(args):
    parser = argparse.ArgumentParser(description="Edit an existing file")
    parser.add_argument('--path', required=True, help='Path of the file to edit')
    parser.add_argument('--content', help='New content of the file')
    parser.add_argument('--from_file', help='Path to a file to copy content from')
    parser.add_argument('--message', help='Commit message')
    parsed_args = parser.parse_args(args)
    if parsed_args.content is not None and parsed_args.from_file is not None:
        raise ValueError("Cannot provide both --content and --from_file.")
    elif parsed_args.content is not None:
        content = parsed_args.content
    elif parsed_args.from_file is not None:
        with open(parsed_args.from_file, 'r') as f:
            content = f.read()
    else:
        raise ValueError("Either --content or --from_file must be provided.")
    edit_file(parsed_args.path, content, parsed_args.message)
