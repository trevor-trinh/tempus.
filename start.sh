#!/bin/bash

# Production mode with docker:

docker rm -f $(docker ps -a -q --filter="ancestor=trevortrinh/tempus")
docker run  --cpus=1 --memory=256m -d -p 8015:8015 --restart on-failure trevortrinh/tempus


# Dev mode without docker (using python ven named env):

# source "env/bin/activate"
# export FLASK_APP=app.py
# export FLASK_ENV=development
# flask run -p 8015 -h "0.0.0.0"
# deactivate