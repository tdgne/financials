# Requirements

 - Docker
 - docker-compose

# Usage

## Set AWS credentials & bucket name 

```
cd batch
vim .env
```

## Fetch from EDINET
```
cd docker
docker-compose run batch npm run fetch
```
