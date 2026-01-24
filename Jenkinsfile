pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/Shrehareny/Project.git']]
                ])
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
                timeout(time: 60, unit: 'MINUTES') {
                    parallel (
                        Admin: { bat 'start /B node admin.js' },
                        Home: { bat 'start /B node home.js' },
                        User: { bat 'start /B node user.js' },
                        UserDashboard: { bat 'start /B node userdash.js' }
                    )
                }
            }
        }
    }
    post {
        always {
            echo "✅ Pipeline finished"
        }
    }
}
