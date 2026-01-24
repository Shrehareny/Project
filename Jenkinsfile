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
            options {
                timeout(time: 15, unit: 'MINUTES')   // ⏱ time limit
            }
            steps {
                parallel(
                    Admin: {
                        bat 'node admin.js'
                    },
                    Home: {
                        bat 'node home.js'
                    },
                    User: {
                        bat 'node user.js'
                    },
                    UserDashboard: {
                        bat 'node userdash.js'
                    }
                )
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed or timed out'
        }
        success {
            echo '✅ Pipeline completed successfully'
        }
    }
}
