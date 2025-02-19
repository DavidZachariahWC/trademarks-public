import re
from pathlib import Path

# Hardcoded file path
FILE_PATH = "apc18840407-20231231-27_cleaned.xml"

def check_registration_numbers(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except IOError as e:
        print(f"Error reading file: {e}")
        return
            
    # Pattern to match registration numbers with 13 or more chars between tags
    pattern = r'<renewal-number>[^<]{13,}</renewal-number>'
    
    # Find all matches
    matches = re.finditer(pattern, content)
    
    # Print matches with their positions
    found = False
    for match in matches:
        found = True
        matched_text = match.group(0)
        line_number = content[:match.start()].count('\n') + 1
        print(f"\nFound at line {line_number}:")
        print(f"Full match: {matched_text}")
        # Extract just the content between tags
        inner_content = re.search(r'>([^<]+)<', matched_text).group(1)
        print(f"Content length: {len(inner_content)} characters")
        print(f"Content: {inner_content}")
        
    if not found:
        print("No registration numbers with 13 or more characters found.")

if __name__ == "__main__":
    if not Path(FILE_PATH).exists():
        print(f"Error: File '{FILE_PATH}' does not exist.")
    else:
        print(f"Checking file: {FILE_PATH}")
        check_registration_numbers(FILE_PATH)
