# Requirements

 - Docker
 - docker-compose

# Usage

## Set AWS credentials & bucket name 

```
cd batch
cp .env.template .env
vim .env
```

## Fetch from EDINET

This takes several hours.

```
cd docker
docker-compose run batch npm run fetch
```

# Troubleshooting

## EAI_AGAIN

Try adding the following to `/etc/docker/daemon.json` and then restart docker.

```
{
  dns: ["8.8.8.8"]
}
```

```
sudo systemctl restart docker
```

