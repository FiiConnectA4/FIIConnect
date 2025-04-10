#!/bin/bash


path=$(pwd)

echo "$path/SFTP_remote_files"

sudo docker run -p 2222:22 -d \
  -v /host/sftp-volume:"$path/SFTP_remote_files" \
  atmoz/sftp \
  fiiconnect:fiiconnect:::faculty_files

cd SFTP_remote_files
sftp -P 2222 fiiconnect@localhost

