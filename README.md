# Requirements

 - Docker
 - docker-compose
 - AWS CLI

# Usage

## Set S3 bucket name 
Create an S3 bucket and set `BUCKET_NAME` to it's name.

```bash
cp batch/.env.template batch/.env
vim batch/.env
```

## Sync with EDINET

### Full sync (up to 5 years ago)


This can take about an hour.


```bash
make sync-document-lists
```

### Partial sync

```bash
# from 2021-12-24 to today
make sync-document-lists FROM=2021-12-24

# from 2021-12-24 to 2021-12-26
make sync-document-lists FROM=2021-12-24 TO=2021-12-26
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

