pipeline {
    agent any

    stages {
        // Stage 1: Checkout code from Git
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Install dependencies (optional if you have package.json)
        stage('Install Dependencies') {
            steps {
                // If you have npm packages
                bat 'npm install || echo "No dependencies to install"'
            }
        }

        // Stage 3: Run app.js
        stage('Run App') {
            steps {
                bat 'node app.js'
            }
        }

        // Stage 4: Run other JS files
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
