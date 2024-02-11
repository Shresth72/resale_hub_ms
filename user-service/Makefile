start_db:
	docker compose up -d

stop_db:
	docker compose stop

server:
	yarn run dev

migrate: 
	db-migrate up

migrate-down: 
	db-migrate down

.PHONY: start_db stop_db server migrate migrate-down