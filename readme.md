# AA-Simulator 3.0

Pseudo-simulator of the surface-to-air system, based on Vue 3, TresJS, Cannon-es, Express

## Used technologies
- Vue 3
- TresJs (Three.js wrap)
- Cannon-ES
- Konva.js (VueKonva)
- Typescript
- Vuetify
- Pinia

## Telegram channel of project

https://t.me/sam_simulator

![image](/screenshot_1.png)
![image](/screenshot_2.png)
![image](/screenshot_3.png)

## For setup development

- create postgres database
- provide DB_URI_LOCAL in backend .env
- run npm install in admin, client, backend
- run compose.yaml, select service static-server
- run npm run dev for backend, client, admin

## For setup production

- generate ssl certificates
- run compose.yaml
