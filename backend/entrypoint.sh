#!/bin/sh

: ${MONGO_HOST:="mongodb"}
: ${MONGO_PORT:="27017"}

echo "Running entrypoint.sh with NODE_ENV=$NODE_ENV"

echo "Waiting for MongoDB at $MONGO_HOST:$MONGO_PORT..."
./wait-for-it.sh $MONGO_HOST:$MONGO_PORT --timeout=30 --strict -- echo "MongoDB is up!"

if [ "$NODE_ENV" = "development" ]; then
    npx nodemon --exec npm start
else
    npm start
fi