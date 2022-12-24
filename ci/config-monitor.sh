STAGE=$1
DEV_HOST=ec2-3-216-199-173.compute-1.amazonaws.com
PROD_HOST=ec2-35-169-79-235.compute-1.amazonaws.com
APP_PORT=3002
APP_NAME=smmp-api
PROMETHEUS_NAME=smmp-prometheus
GRAFANA_NAME=smmp-grafana
DOCKER_NET=local_net
GRAFANA_PASSWORD=$GRAFANA_PASSWORD

if [[ $STAGE == 'dev' ]] 
then
  echo "[*] on: DEV"
  SERVER_HOST=$DEV_HOST
elif [[ $STAGE == 'prod' ]] 
then
  echo "[*] on: PROD"
  SERVER_HOST=$PROD_HOST
else
  echo "usage: config-monitor.sh <stage:dev|prod>"
  exit 0
fi

# change grafana password
echo "Grafana: updating password..."
curl $SERVER_HOST:3000/api/user/password -u "admin:admin" \
  -X 'PUT' \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/plain, */*' \
  --data-raw '{"oldPassword":"admin","newPassword":"$GRAFANA_PASSWORD","confirmNew":"$GRAFANA_PASSWORD"}' \
  --compressed

# add prometheus data source to grafana
echo "Grafana: set prometheus data source..."
curl $SERVER_HOST:3000/api/datasources -u "admin:$GRAFANA_PASSWORD" \
  -H "Content-Type: application/json;charset=UTF-8" \
  -H "accept: application/json, text/plain, */*" \
  --data-raw "{"name":"DS_PROMETHEUS","type":"prometheus","url":"http://$PROMETHEUS_NAME:$PROMETHEUS_PORT","access":"proxy","jsonData":{"keepCookies":[]},"secureJsonFields":{}}" \
  --compressed