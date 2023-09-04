lint-frontend:
		make -C frontend lint

install:
		npm ci & npm run build & npm run postinstall

start-frontend:
		make -C frontend start

start-backend:
		npx start-server

start:
		make start-backend & make start-frontend