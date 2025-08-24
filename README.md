# Client-AddOnnSense
 Implies intelligence, awareness, or smart decision-making — often associated with AI, machine learning, or data-driven features.

# Push docker commands
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 945942154263.dkr.ecr.eu-central-1.amazonaws.com

docker buildx build --platform linux/amd64 --load -t 945942154263.dkr.ecr.eu-central-1.amazonaws.com/client_addonnsense:latest .

docker tag client_addonnsense:latest:latest 945942154263.dkr.ecr.eu-central-1.amazonaws.com/client_addonnsense:latest

docker push 945942154263.dkr.ecr.eu-central-1.amazonaws.com/client_addonnsense:latest

docker buildx build --platform linux/amd64 --load -t sapydi/client_addonnsense:latest .
docker tag client_addonnsense:latest sapydi/client_addonnsense:latest

docker push sapydi/client_addonnsense:latest