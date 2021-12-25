# Requirements

 - Docker
 - docker-compose
 - AWS CLI

# Usage

## Set S3 bucket name 
Create an S3 bucket and set `BUCKET_NAME` to it's name.

```bash
cd batch
cp .env.template .env
vim .env
```

## Sync with EDINET

### Full sync (up to 5 years ago)

This can take about an hour.

```bash
cd docker

docker-compose run --rm \
  -e AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id) \
  -e AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key) \
  batch npm run sync-document-lists
```

### Partial sync

```bash
cd docker

# from 2021-12-24 to today
docker-compose run --rm \
  -e AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id) \
  -e AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key) \
  batch npm run sync-document-lists -- --from=2021-12-24

# from 2021-12-24 to 2021-12-25
docker-compose run --rm \
  -e AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id) \
  -e AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key) \
  batch npm run sync-document-lists -- --from=2021-12-23 --to=2021-12-25
```

# Troubleshooting

## Network error (`EAI_AGAIN`)

Try adding the following to `/etc/docker/daemon.json` and then restart docker.

```json
{
  "dns": ["8.8.8.8"]
}
```

```bash
sudo systemctl restart docker
```

