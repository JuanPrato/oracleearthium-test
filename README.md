# Discord bot de HORUS_SPORTS

## Realizado en nodejs

Utiliza la librería de discordjs, y los datos son recuperado de la api de [api-football](https://www.api-football.com/)

Se deben cargar los secrets de .env.example, son todos requeridos.

Para iniciar en modo desarrollo:

1. npm i
2. npm run dev

Para iniciar en modo producción:

1. npm i
2. npm prune --prod
3. npm run build
4. npm run start

Incluye ya un docker file en caso de querer subirlo a un servicio de hosting
