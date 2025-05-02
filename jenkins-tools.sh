#!/bin/bash

CONTAINER_NAME=jenkins

docker cp "./jenkins/plugins.txt" "$CONTAINER_NAME":/tmp/plugins.txt

docker exec -u 0 "$CONTAINER_NAME" bash -c "\
  jenkins-plugin-cli --plugin-file /tmp/plugins.txt --plugins delivery-pipeline-plugin:1.3.2 deployit-plugin && \
  cp -r -p /usr/share/jenkins/ref/plugins/. /var/jenkins_home/plugins/."

