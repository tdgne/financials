[EDINET](https://disclosure.edinet-fsa.go.jp/EKW0EZ0015.html) から 指定期間の有価証券報告書などを取得し指定した S3 バケットにアップロードします。

# Requirements

 - Docker
 - docker-compose (>1.28)
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


This can take a very long time.


```bash
./sync.sh document-lists
./sync.sh documents
```

### Partial sync

```bash
# from 2021-12-24 to today
./sync.sh document-lists --from=2021-12-24
./sync.sh documents --from=2021-12-24

# from 2021-12-24 to 2021-12-26
./sync.sh document-lists --from=2021-12-24 --to=2021-12-26
./sync.sh documents --from=2021-12-24 --to=2021-12-26
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

