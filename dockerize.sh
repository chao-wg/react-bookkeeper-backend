pnpm run build &&

docker builld -t bookkeeper . &&

docker tag bookkeeper towski0804/bookkeeper:latest &&

docker push towski0804/bookkeeper:latest &&

docker rmi bookkeeper:latest &&

docker rmi towski0804/bookkeeper:latest &&

ssh gddEC2 "cd bookkeeper && docker-compose pull && docker-compose down && docker-compose up -d"

# there would be one or two unused containers after the deployment in the server side
# so we need to remove them manually