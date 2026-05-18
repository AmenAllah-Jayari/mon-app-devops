pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "amenallahjayari/mon-app-devops"
        DOCKER_CREDENTIALS = "dockerhub-credentials"
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Code recupere depuis GitHub'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        dockerImage.push()
                        dockerImage.push("latest")
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')]) {
                        bat "kubectl set image deployment/mon-app mon-conteneur=${DOCKER_IMAGE}:${BUILD_NUMBER}"
                        bat "kubectl rollout status deployment/mon-app"
                    }
                }
            }
        }
        stage('Notify n8n') {
            steps {
                bat "curl -X POST http://localhost:5678/webhook/jenkins-deploy -H \"Content-Type: application/json\" -d \"{\\\"status\\\":\\\"success\\\",\\\"image\\\":\\\"${DOCKER_IMAGE}:${BUILD_NUMBER}\\\"}\"" 
            }
        }
    }
    post {
        success {
            echo "Deploiement reussi : ${DOCKER_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            echo "Le pipeline a echoue"
        }
    }
}