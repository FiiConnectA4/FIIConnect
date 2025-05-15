docker run --name oracle-free -d -p 1521:1521 -e ORACLE_PASSWORD=api_test gvenzl/oracle-free

docker cp create_user.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/didactic_table_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/didactic_sequence_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/auth_sequence_create
docker cp ../../backend/scripts/fiiconnect/auth_table_create.sql
docker cp ../../backend/scripts/fiiconnect/secretariat_sequence_create.sql
docker cp ../../backend/scripts/fiiconnect/secretariat_table_create.sql
docker cp ../../backend/scripts/fiiconnect/social_sequence_create.sql
docker cp ../../backend/scripts/fiiconnect/social_table_create.sql
docker cp ../../backend/scripts/fiiconnect/fiiconnect_populate.sql

echo "Waiting for Oracle to be ready..."
until docker logs oracle-free 2>&1 | grep -q "DATABASE IS READY TO USE"; do
  sleep 2
done
echo "Oracle is ready!"


docker exec -it oracle-free sqlplus sys/api_test as sysdba @/tmp/create_user.sql
sleep 1
docker exec -it oracle-free sqlplus api_test/api_test @/tmp/didactic_table_create.sql
sleep 1
docker exec -it oracle-free sqlplus api_test/api_test @/tmp/didactic_sequence_create.sql
sleep 1
docker exec -it oracle-free sqlplus api_test/api_test @/tmp/didactic_table_populate.sql


echo "For more info about the docker image: https://hub.docker.com/r/gvenzl/oracle-free"
echo "Connect with api_test/api_test"
