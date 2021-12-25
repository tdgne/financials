AWS_ACCESS_KEY_ID = $$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY = $$(aws configure get aws_secret_access_key)
RUN_BATCH = docker-compose run --rm \
							-e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
							-e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
							batch

fetch-document-lists:
	cd docker && \
	$(RUN_BATCH) npm run sync-document-lists -- --from=$(FROM)

