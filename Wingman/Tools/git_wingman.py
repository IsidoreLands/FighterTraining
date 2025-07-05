import sys
import importlib
import subprocess

def is_inside_git_repo():
    try:
        result = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
        return result.stdout.strip() == 'true'
    except Exception:
        return False

def main():
    if not is_inside_git_repo():
        print("Error: Not inside a Git repository.")
        sys.exit(1)
    
    if len(sys.argv) < 2:
        print("Usage: python3 git_wingman.py <command> [args]")
        sys.exit(1)
    
    command = sys.argv[1]
    try:
        module = importlib.import_module(f"git_wingman_{command}")
        module.execute(sys.argv[2:])
    except ImportError:
        print(f"Error: Command '{command}' not found.")
        sys.exit(1)

if __name__ == "__main__":
    main()
