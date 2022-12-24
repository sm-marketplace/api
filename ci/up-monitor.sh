# # clean previous containers
# sudo docker stop $PROMETHEUS_NAME
# sudo docker stop $GRAFANA_NAME

# # make prometheus config
# export APP_HOST=$APP_NAME
# export APP_PORT=$APP_PORT
# envsubst < ci/templates/prometheus.yml  > prometheus.yml

# # run prometheus
# sudo docker run --network $DOCKER_NET --name $PROMETHEUS_NAME --rm -d \
#   -p 9090:9090 \
#   -v "$(pwd)/prometheus.yml":/etc/prometheus/prometheus.yml \
#   prom/prometheus

# # run grafana
# sudo docker run --network $DOCKER_NET --name $GRAFANA_NAME --rm -d \
#   -p 4000:4000 \
#   grafana/grafana