REALM_APP_ID=webhookmanagement-gfbga
APP_NAME=WebhookManagement
REALM_PUBLIC_KEY=kvdzlrzg
REALM_PRIVATE_KEY=006a7f8f-f536-444b-8009-1dea229b99b2

realm_login:
	realm-cli login --api-key ${REALM_PUBLIC_KEY} --private-api-key ${REALM_PRIVATE_KEY}

realm_pull_app:
	realm-cli pull -y --remote=${REALM_APP_ID}

setup_functions:
	cp -R functions/* ${APP_NAME}/functions

setup_triggers:
	cp -R triggers ${APP_NAME}

deploy_all:
	cd ${APP_NAME} && realm-cli -y push --include-package-json
