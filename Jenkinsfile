pipeline {
    agent any
    
    environment {
        DOCKER_CREDS = credentials('docker-hub-creds')
        RENDER_KEY = credentials('render-api-key')
    }
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Frontend Tests') {
            steps {
                dir('src/frontend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                script {
                    // Determine tag based on branch
                    def tag = (env.BRANCH_NAME == 'main') ? 'prod' : (env.BRANCH_NAME == 'release') ? 'staging' : 'dev'
                    
                    // Login using the single credential
                    sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                    
                    // Build and push frontend
                    sh "docker build -t ${DOCKER_CREDS_USR}/frontend:${tag} ./src/frontend"
                    sh "docker push ${DOCKER_CREDS_USR}/frontend:${tag}"
                }
            }
        }
        
        stage('Deploy to Render') {
            steps {
                script {
                    def serviceId = ''
                    if (env.BRANCH_NAME == 'main') {
                        serviceId = 'srv-d86qif3tqb8s73frnr0g'    // Replace with actual prod service ID
                    } else if (env.BRANCH_NAME == 'release') {
                        serviceId = 'srv-d86qirn7f7vs73aun790' // Replace with actual staging ID
                    } else if (env.BRANCH_NAME == 'develop') {
                        serviceId = 'srv-d86qi4jtqb8s73frne1g'     
                    } else {
                        echo "Not deploying branch ${env.BRANCH_NAME} to Render"
                        return
                    }
                    sh "curl -X POST https://api.render.com/deploy/${serviceId}?key=${RENDER_KEY}"
                }
            }
        }
        
        // Optional: Kubernetes deployment (Member B will provide manifests)
        stage('Deploy to Kubernetes') {
            when { expression { fileExists('k8s/prod') } }
            steps {
                script {
                    def ns = (env.BRANCH_NAME == 'main') ? 'prod' : (env.BRANCH_NAME == 'release') ? 'staging' : 'dev'
                    sh "kubectl apply -f k8s/${ns}/ --recursive"
                }
            }
        }
    }
    
    post {
    failure {
        echo "Pipeline failed!"
        script {
            def ns = (env.BRANCH_NAME == 'main') ? 'prod' : (env.BRANCH_NAME == 'release') ? 'staging' : 'dev'
            // Check if deployment exists before trying to rollback
            sh """
                if kubectl get deployment frontend -n ecommerce-${ns} > /dev/null 2>&1; then
                    kubectl rollout undo deployment/frontend -n ecommerce-${ns}
                else
                    echo "No frontend deployment in namespace ecommerce-${ns} - skipping rollback"
                fi
            """
        }
    }
    success {
        echo "Pipeline completed successfully!"
    }
}
}