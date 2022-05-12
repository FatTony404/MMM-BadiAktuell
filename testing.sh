#!/bin/bash

echo "Running script..." 
docker stop mm
docker rm mm
cd "/Users/andreaspfeifer/Documents/GitHub/Docker/magicmirror/mounts/modules/MMM-BadiAktuell"
git checkout dev
git pull
npm install 
cd "/Users/andreaspfeifer/Documents/GitHub/Docker/magicmirror/run"
docker-compose up -d 
docker logs -f mm