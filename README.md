# SM Marketplace - API

## Requeriments

- Node 16
- Project in [Pinata](https://www.pinata.cloud/)

## Docker Image
Necesita obtener PINATA_API_KEY y PINATA_SECRET_API_KEY creando un proyecto en 
[Pinata](https://www.pinata.cloud/) y reemplazar los valores en `<PINATA_API_KEY>` y
`<PINATA_SECRET_API_KEY>`

```sh
docker pull rogrp6/smmp-api:dev
docker stop smmp-api # limpieza, ignore si da error
docker rm smmp-api # limpieza, ignore si da error
docker run --name smmp-api -d -p 3000:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e STAGE=dev \
  -e PINATA_API_KEY=<PINATA_API_KEY> \
  -e PINATA_SECRET_API_KEY=<PINATA_SECRET_API_KEY> \
  rogrp6/smmp-api:dev
```

## Development

1 - Create `.env` file and copy content of `.env.sample`, then fill the variables

2 - Execute 
```
npm run start

// or use nodemon: 
npm run watch
```

## Docs

1. Save postman file: `docs/smmp-api.postman_collection.json`
2. Generate Open API file: `npm run mkoapi`
