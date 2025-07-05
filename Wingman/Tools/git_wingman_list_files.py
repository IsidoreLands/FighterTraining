import subprocess

def run_git_command(args, check=True):
    result = subprocess.run(['git'] + args, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"Git command failed: {' '.join(args)}\n{result.stderr}")
    return result

def list_files():
    result = run_git_command(['ls-files'])
    files = result.stdout.splitlines()
    for file in files:
        print(file)

def execute(args):
    list_files()
