#!/bin/bash

docker run --name vroom -p 5000:3000 --env-file .env vroom-back
