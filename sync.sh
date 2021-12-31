#!/bin/bash

run_batch() {
  AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
  AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
  DATETIME=$(date -Iseconds)
  LOG_DIR="$(pwd)/log"

  cmd=$1
  log_prefix=$2

  mkdir -p $LOG_DIR

  pushd docker

  docker-compose run --rm \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    batch /bin/bash -c \
    "$cmd" 2>&1 | tee "$LOG_DIR/$log_prefix-$DATETIME.log"

  popd
}

sync_document_lists() {
  args=$1

  run_batch "\
		npm i && \
		npm run sync-document-lists -- $args \
    " sync-document-lists
}

sync_documents() {
  args=$1

  run_batch "\
		npm i && \
		npm run sync-documents -- $args \
    " sync-document-lists
}

subcommand=$1
options="$2 $3 $4"

if [ "$subcommand" = "document-lists" -o "$subcommand" = "l" ]; then
  sync_document_lists "$options"
elif [ "$subcommand" = "documents" -o "$subcommand" = "d" ]; then
  sync_documents "$options"
else
  echo "Usage:"
  echo "       $0 document-lists --from=2021-12-20 -=to=2021-12-31"
  echo "       $0 documents --from=2021-12-20 -=to=2021-12-31"
fi

