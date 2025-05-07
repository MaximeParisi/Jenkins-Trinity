Cmd to install plugins ( plugins list must be in plugins.txt)

java -jar jenkins-plugin-manager-*.jar \
  --war /usr/share/java/jenkins.war \
  --plugin-download-directory ~/Documents/epitest/Jenkins-Trinity/jenkins/plugins/ \
  --plugin-file ~/Documents/epitest/Jenkins-Trinity/jenkins/plugins.txt


Cmd to run Jenkins Container with docker in

docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/bin/docker:/usr/bin/docker \
  jenkins/jenkins:lts
 
 OR

 docker start jenkins