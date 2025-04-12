#!/bin/bash

path=$(pwd)
sftp_dir="$path/../SFTP_remote_files"
volume_path="/Volumes/sftp-volume"

sudo mkdir -p "$volume_path"

echo "SFTP Remote Files Path: $sftp_dir"

if ! docker info > /dev/null 2>&1; then
    echo "Docker does not appear to be running. Please start Docker Desktop."
    exit 1
fi

if [[ "$(uname -m)" == "arm64" ]]; then
    sudo docker run --platform linux/amd64 -p 2222:22 -d \
    -v "$volume_path":"$sftp_dir" \
    atmoz/sftp \
    fiiconnect:fiiconnect:::faculty_files
else
    sudo docker run -p 2222:22 -d \
    -v "$volume_path":"$sftp_dir" \
    atmoz/sftp \
    fiiconnect:fiiconnect:::faculty_files
fi

echo "Run with user: fiiconnect -- password: fiiconnect"

cd "$sftp_dir"
sftp -P 2222 fiiconnect@localhost

