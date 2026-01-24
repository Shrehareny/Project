pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run App') {
            steps {
                bat 'node app.js'
            }
        }

        stage('Run Other JS Files') {
            steps {
                bat 'node admin.js'
                bat 'node home.js'
                bat 'node user.js'
                bat 'node userdash.js'
            }
        }
    }
}
