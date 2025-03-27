FROM jenkins/jenkins:lts

USER root

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    apt-get clean

# Give Jenkins access to Docker group
RUN usermod -aG docker jenkins

USER jenkins
