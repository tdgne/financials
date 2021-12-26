AWS_ACCESS_KEY_ID = $$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY = $$(aws configure get aws_secret_access_key)
RUN_IN_BATCH_CONTAINER = docker-compose run --rm \
													-e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
													-e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
													batch /bin/bash -c
DATETIME = $(shell date -Iseconds)

.PHONY: sync-document-lists

sync-document-lists:
	cd docker && \
	$(RUN_IN_BATCH_CONTAINER) "\
		npm i && \
		npm run sync-document-lists -- --from=$(FROM) --to=$(TO) -r \
	" 2>&1 | tee $(CURDIR)/sync-document-lists-$(DATETIME).log

sync-documents-lists:
	cd docker && \
	$(RUN_IN_BATCH_CONTAINER) "\
		npm i && \
		npm run sync-documents -- --from=$(FROM) --to=$(TO) -r \
	" 2>&1 | tee $(CURDIR)/sync-document-lists-$(DATETIME).log

