pipeline {
    agent {
        dockerContainer {
            image 'node:18.18.0-alpine3.18'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
    }
}


