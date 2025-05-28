docker run --name oracle-free -d -p 1521:1521 -e ORACLE_PASSWORD=api_test gvenzl/oracle-free

docker cp create_user.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/didactic_table_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/didactic_sequence_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/auth_sequence_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/auth_table_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/secretariat_sequence_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/secretariat_table_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/social_sequence_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/social_table_create.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/fiiconnect_populate.sql oracle-free:/tmp/
docker cp ../../backend/scripts/fiiconnect/initialize_database.sql oracle-free:/tmp/

echo "Waiting for Oracle to be ready..."
until docker logs oracle-free 2>&1 | grep -q "DATABASE IS READY TO USE"; do
  sleep 2
done
echo "Oracle is ready!"


docker exec -d oracle-free sqlplus sys/api_test as sysdba @/tmp/create_user.sql
sleep 1

docker exec -d oracle-free sqlplus api_test/api_test @/tmp/initialize_database.sql
sleep 1

echo "For more info about the docker image: https://hub.docker.com/r/gvenzl/oracle-free"
echo "Connect with api_test/api_test"
