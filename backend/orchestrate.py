#!/usr/bin/env python3
import os
import sys
import subprocess
import boto3

def download_file_from_s3(bucket_name, s3_key, local_path):
    s3 = boto3.client('s3')
    print(f"Downloading s3://{bucket_name}/{s3_key} to {local_path}")
    s3.download_file(bucket_name, s3_key, local_path)

def run_cleanup(input_file, output_file):
    print(f"Cleaning file: {input_file} -> {output_file}")
    # Assumes cleanup.py now accepts input and output paths as command-line args.
    subprocess.run(["python3", "cleanup.py", input_file, output_file], check=True)

def run_insertion(cleaned_file):
    print(f"Inserting data from {cleaned_file}")
    subprocess.run(["python3", "insert_into_database.py", cleaned_file], check=True)

if __name__ == '__main__':
    # Usage: orchestrate.py <bucket_name> <s3_key> <local_directory>
    if len(sys.argv) != 4:
        print("Usage: orchestrate.py <bucket_name> <s3_key> <local_directory>")
        sys.exit(1)

    bucket_name = sys.argv[1]
    s3_key = sys.argv[2]
    local_dir = sys.argv[3]

    os.makedirs(local_dir, exist_ok=True)
    input_file = os.path.join(local_dir, "input.xml")
    cleaned_file = os.path.join(local_dir, "input_cleaned.xml")

    download_file_from_s3(bucket_name, s3_key, input_file)
    run_cleanup(input_file, cleaned_file)
    run_insertion(cleaned_file)
