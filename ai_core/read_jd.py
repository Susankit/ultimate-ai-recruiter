import os

def load_local_job_criteria():
    file_target = "../data/job_description.md"
    
    if os.path.exists(file_target):
        with open(file_target, "r", encoding="utf-8") as file_stream:
            raw_text = file_stream.read()
            print("==============================================")
            print(" SUCCESS: Local JD Context Extracted Safely!")
            print("==============================================")
            print(raw_text)
            print("==============================================")
    else:
        print(f"CRITICAL ERROR: Could not locate file: {file_target}")

if __name__ == "__main__":
    load_local_job_criteria()