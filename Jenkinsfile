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

        stage('Smoke Test - Node Apps') {
            steps {
                parallel(
                    App: {
                        bat 'node app.js & timeout /t 5 > nul'
                    },
                    Admin: {
                        bat 'node admin.js & timeout /t 5 > nul'
                    },
                    Home: {
                        bat 'node home.js & timeout /t 5 > nul'
                    },
                    User: {
                        bat 'node user.js & timeout /t 5 > nul'
                    },
                    UserDashboard: {
                        bat 'node userdash.js & timeout /t 5 > nul'
                    }
                )
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
