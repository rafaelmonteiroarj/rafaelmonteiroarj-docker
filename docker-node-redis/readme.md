## Comando para rodar o projeto via Dockerfile

**_Primeiro criar uma rede:_**

```ssh
docker network create --driver bridge network-app
```

**_Em seguida instalar redis via docker CLI:_**

```ssh
docker run -v $PWD/tmp:/data --name redis-server --network network-app -p 6379:6379 -d redis
docker exec -it redis-server sh
redis-cli
```

**_Por último rodar o seguinte comando, para rodar aplicação:_**

```ssh
docker build -t application .
docker run --name application-app --network network-app -p 3000:3000 application
```

## Ou se preferir rodar aplicação via docker-compose

```ssh
docker-compose -p "application" up -d
```

## Comando para rodar o projeto:

```ssh
npm install
npm run start:dev
```

## Acessar servidor na porta:

http://localhost:3000/

http://localhost:3000/fish/red-snapper
