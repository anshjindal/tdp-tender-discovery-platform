pipeline { 
    agent any 
    environment { 
        DOCKERHUB_USER = 'your_dockerhub_username' 
        BACKEND_REPO = 'tdp-backend' 
        FRONTEND_REPO = 'tdp-frontend' 
        IMAGE_TAG = "${env.BRANCH_NAME}-${env.GIT_COMMIT.take(7)}" 
    } 
    stages { 
        stage('Clone Repo') { steps { git url: 'https://github.com/anshjindal/tdp-tender-discovery-platform', branch: 'feat_tdp_201' } } 
        stage('Build Docker Images') { steps { script { 
            sh "docker build -t $DOCKERHUB_USER/$BACKEND_REPO:$IMAGE_TAG apps/backend" 
            sh "docker build -t $DOCKERHUB_USER/$FRONTEND_REPO:$IMAGE_TAG apps/frontend" 
        }}} 
        stage('Push Images to DockerHub') { steps { withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) { 
            sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin' 
            sh "docker push $DOCKERHUB_USER/$BACKEND_REPO:$IMAGE_TAG" 
            sh "docker push $DOCKERHUB_USER/$FRONTEND_REPO:$IMAGE_TAG" 
        }}} 
    } 
    post { always { echo "Pipeline finished." } } 
} 
