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
                        bat '''
                        start "" node app.js
                        timeout /t 5
                        '''
                    },
                    Admin: {
                        bat '''
                        start "" node admin.js
                        timeout /t 5
                        '''
                    },
                    Home: {
                        bat '''
                        start "" node home.js
                        timeout /t 5
                        '''
                    },
                    User: {
                        bat '''
                        start "" node user.js
                        timeout /t 5
                        '''
                    },
                    UserDashboard: {
                        bat '''
                        start "" node userdash.js
                        timeout /t 5
                        '''
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
