## Copy .env

```
cp .env.example .env
```

## Docker build

```
docker-compose build (docker compose -f docker-compose.prod.yml build --no-cache)
docker-compose up
```

## Access to container

```
docker-compose run app bash (docker exec -it worksync_app_prod bash)
```

## APP install composer and generate key

```
composer install
php artisan key:generate
```

## DB

```
php artisan migrate

# Seed for test
php artisan db:seed

php artisan passport:client --password
php artisan passport:keys
```

## yarn

```
yarn install

# Dev environment
yarn dev

# Product environment
yarn prod
```

## Add xdebug into launch.json (VSCode)

```
{
    "name": "XDebug on docker",
    "type": "php",
    "request": "launch",
    "port": 9004,
    "stopOnEntry": true,
    "pathMappings": {
        "/var/www/html": "${workspaceRoot}/"
    }
},
```

## Web URL

```
http://127.0.0.1:8088
```
