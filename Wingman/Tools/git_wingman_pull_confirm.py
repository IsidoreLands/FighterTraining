import argparse
import subprocess
import os

def run_git_command(args, check=True):
    result = subprocess.run(['git'] + args, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"Git command failed: {' '.join(args)}\n{result.stderr}")
    return result

def pull_changes():
    current_branch = run_git_command(['rev-parse', '--abbrev-ref', 'HEAD']).stdout.strip()
    remote = run_git_command(['config', '--get', f'branch.{current_branch}.remote']).stdout.strip()
    run_git_command(['pull', remote, current_branch])

def display_file(file_path):
    if not os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' does not exist.")
    with open(file_path, 'r') as f:
        print(f.read())

def search_file(file_path, pattern):
    if not os.path.exists(file_path):
        raise ValueError(f"File '{file_path}' does not exist.")
    with open(file_path, 'r') as f:
        lines = f.readlines()
    matching_lines = [line for line in lines if pattern in line]
    if matching_lines:
        print("Matching lines:")
        for line in matching_lines:
            print(line.strip())
    else:
        print("No matches found.")

def execute(args):
    parser = argparse.ArgumentParser(description="Pull changes and confirm file contents or search for a pattern")
    parser.add_argument('--file', required=True, help='Path of the file to display or search')
    parser.add_argument('--pattern', help='Pattern to search for in the file')
    parsed_args = parser.parse_args(args)
    
    pull_changes()
    
    if parsed_args.pattern:
        search_file(parsed_args.file, parsed_args.pattern)
    else:
        display_file(parsed_args.file)
