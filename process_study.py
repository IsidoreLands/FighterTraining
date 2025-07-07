#!/usr/bin/env python3
import subprocess
import re
import os
import argparse

MISSION_MAP = [
    {
        "path": "Works of John Boyd/Aerial Attack Study/Part I - Fighter vs Bomber",
        "delimiters": [
            "BASIC LIMITATIONS OF THE DISTURBED SIGHT AND THE 20MM CANNON",
            "BASIC LIMITATIONS OF THE AIM-9B (GAR-8) MISSILE AGAINST A NON-MANEUVERING TARGET",
            "IR Pattern", "Range:", "G", "Lambda", "MECHANICS OF THE PURSUIT CURVE",
            "LIMITATIONS OF OUR WEAPONS SYSTEM IN A PURSUIT CURVE ATTACK", "AIM-9B Missile",
            "TYPES OF PURSUIT CURVE ATTACKS", "The High-Side Attack", "The Overhead Attack",
            "Underside Attack", "Nose Quarter Attack",
            "THE BEST TYPE ATTACK AGAINST A NON-MANEUVERING TARGET WITH AIM-9B",
            "Overhead Attack", "High side Attack", "Six-O'clock Attack", "Underside Attack",
            "BEST TYPE OF ATTACK AGAINST A NON-MANEUVERING TARGET WITH THE 20MM CANNON",
            "MANEUVERING FOR THE ATTACK", "FLIGHT TACTICS", "SUMMARY"
        ]
    },
    {
        "path": "Works of John Boyd/Aerial Attack Study/Part II - Fighter vs Fighter",
        "delimiters": [
            "INTRODUCTION", "CHAPTER I", "CHAPTER II", "FIGHTER MANEUVERS", "Defensive Turn",
            "Adverse Yaw", "The Scissors Maneuver", "Countering the Scissors Maneuver",
            "Procedures for maneuvering Against a Scissor Counter", "The Attack",
            "High-Speed Yo-Yo", "Barrel-Roll Attack", "The Low-Speed Yo-Yo",
            "Countering the Overhead Attack with a Negative Delta Mach",
            "Maneuvering from An Overhead Attack with a Negative Delta Mach",
            "The Vertical Rolling Scissors", "The High-G Barrel-Roll",
            "The High-G Barrel-Roll over the Top", "The High-G Roll Underneath",
            "Maneuvering from a Nose-Quarter Attack", "CHAPTER III", "TACTICAL FORMATION",
            "CHAPTER IV", "FLIGHT TACTICS", "Two Attacking Two",
            "Defending Two when Attacked by Two", "Attacking Four with Two",
            "Attacking a Flight of Four with Four", "Defending Four when Attacked by Two",
            "Defending Four when Attacked by Four", "SUMMARY", "BIBLIOGRAPHY"
        ]
    }
]

def sanitize_filename(title):
    s = title.strip().lower()
    s = re.sub(r'[\s/]+', '_', s)
    s = re.sub(r'[^a-z0-9_-]', '', s)
    return f"{s}.txt"

def normalize_text(text):
    return ' '.join(text.upper().split())

def run_command(command, working_dir='.'):
    print(f"Executing: {' '.join(command)}")
    result = subprocess.run(command, capture_output=True, text=True, cwd=working_dir)
    if result.returncode != 0:
        print(f"ERROR: Command failed: {result.stderr}")
        raise Exception(f"Git command failed: {result.stderr}")
    return result.stdout

def main(pdf_path):
    print(f"--- Step 1: Extracting text from {pdf_path} ---")
    full_text = run_command(['pdftotext', pdf_path, '-'])
    normalized_full_text = normalize_text(full_text)
    print("--- Text extraction successful. ---")

    print("\n--- Step 2: Slicing document and creating .txt files ---")
    all_delimiters = [d for group in MISSION_MAP for d in group['delimiters']]

    # Create a unified list of items with their correct paths
    tasks = []
    for group in MISSION_MAP:
        for title in group['delimiters']:
            tasks.append({'title': title, 'path': group['path']})

    for i, task in enumerate(tasks):
        title = task['title']
        parent_path = task['path']

        normalized_title = normalize_text(title)
        start_pos_norm = normalized_full_text.find(normalized_title)

        if start_pos_norm == -1:
            print(f"Warning: Delimiter '{title}' not found. Skipping.")
            continue

        original_start_pos = full_text.upper().find(normalized_title)

        original_end_pos = len(full_text)
        if i + 1 < len(tasks):
            next_title = tasks[i+1]['title']
            normalized_next_title = normalize_text(next_title)
            next_pos_in_normalized = normalized_full_text.find(normalized_next_title, start_pos_norm + 1)
            if next_pos_in_normalized != -1:
               original_end_pos = full_text.upper().find(normalized_next_title, original_start_pos + 1)

        content_slice = full_text[original_start_pos:original_end_pos].strip()
        filename = sanitize_filename(title)
        full_filepath = os.path.join(parent_path, filename)

        print(f"Creating file: {full_filepath}")
        os.makedirs(os.path.dirname(full_filepath), exist_ok=True)
        with open(full_filepath, 'w') as f:
            f.write(content_slice)

    print("--- File creation complete. ---")

    print("\n--- Step 3: Committing files to Git repository ---")
    run_command(['git', 'add', 'Works of John Boyd/'])
    run_command(['git', 'commit', '-m', 'FEAT: Add full text for all Aerial Attack Study subchapters'])
    run_command(['git', 'push'])
    print("--- Script finished successfully. ---")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process a PDF study into text files.")
    parser.add_argument("pdf_path", help="Path to the source PDF file.")
    args = parser.parse_args()
    main(args.pdf_path)
