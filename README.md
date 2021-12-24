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

## Sync with EDINET

### Full sync (up to 5 years ago)

This can take about an hour.

```
cd docker
docker-compose run batch npm run fetch
```

### Partial sync

```
cd docker
docker-compose run batch npm run fetch -- --from=2021-12-24
docker-compose run batch npm run fetch -- --from=2021-12-23 --to=2021-12-25
```


# Troubleshooting

## Network error (EAI_AGAIN)

Try adding the following to `/etc/docker/daemon.json` and then restart docker.

```
{
  dns: ["8.8.8.8"]
}
```

```
sudo systemctl restart docker
```

