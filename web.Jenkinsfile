pipeline {
    agent any
    options {disableConcurrentBuilds()}
    environment {
        GOOGLE_CLUSTERS_REGION = "us-central1"
        GOOGLE_CLUSTERS_NAME = "autopilot-cluster-1"

        GOOGLE_PROJECT_ID = "clear-hulling-356517"
        GOOGLE_PROJECT_NAME = "My First Project"
        GOOGLE_APPLICATION_CREDENTIALS = credentials('googlecloud')
        GOOGLE_CLOUD_KEYFILE_JSON = credentials('googlecloud')

        GIT_URL = "https://gitlab.com/ami-travel/frontend/app"
        //GIT_BRANCH = "main"
        GIT_BRANCH = "dev"
        GIT_CREDENTIALS = "gitlab"
        GIT_PATH = "/var/jenkins_home/workspace/frontend-app"

        DOCKER_IMAGE = "gcr.io/${GOOGLE_PROJECT_ID}/frontend_app_amitravel_image"

        KUBERNETES_NAME = "app-frontend"
        KUBERNETES_PATH = "Kubernetesfile.yml"
    }
    
    stages{
        stage('limbiar espacio de trabajo') { 
            steps {
                cleanWs()
                sh 'env'
            }
        }

        stage('obtener codigo') { 
            steps {
                git url: GIT_URL, branch: GIT_BRANCH, credentialsId: GIT_CREDENTIALS
            }
        }

        stage('ubicar proyecto') { 
            steps {
                sh 'cd ${GIT_PATH}'
            }
        }

        stage('construir') { 
            steps {
                sh 'npm install'
                sh 'ionic build'
            }
        }

        stage("conectar google cloud"){
            steps {
                sh("gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}")
                sh 'gcloud config set project ${GOOGLE_PROJECT_ID}'
                sh 'gcloud container clusters get-credentials ${GOOGLE_CLUSTERS_NAME} --region ${GOOGLE_CLUSTERS_REGION} --project ${GOOGLE_PROJECT_ID}'
            }
        }

        stage("desplegar google cloud"){
            steps {
                sh 'mv www publicwww'
                sh 'gcloud builds submit --tag ${DOCKER_IMAGE} .'
                sh 'kubectl delete deployment ${KUBERNETES_NAME}'
                sh 'kubectl apply -f ${KUBERNETES_PATH}'
            }
        }
    }
}