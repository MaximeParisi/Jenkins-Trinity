Cmd to install plugins ( plugins list must be in plugins.txt)

java -jar jenkins-plugin-manager-*.jar \
  --war /usr/share/java/jenkins.war \
  --plugin-download-directory ~/Documents/epitest/Jenkins-Trinity/jenkins/plugins/ \
  --plugin-file ~/Documents/epitest/Jenkins-Trinity/jenkins/plugins.txt
