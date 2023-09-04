lint-frontend:
		make -C frontend lint

install:
		npm ci

start-frontend:
		cd frontend  && npm start

start-backend:
		npx start-server

start:
		make start-backend & make start-frontend