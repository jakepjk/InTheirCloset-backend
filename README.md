## Installation

```bash
$ npm install
```

## Required File

- .env.development.local
- .env.development
- .env.test

```.env.*
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

JWT_SECRET=${JWT_SECRET}

CALLBACK_URL=${CALLBACK_URL}

KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID}
KAKAO_CLIENT_SECRET=${KAKAO_CLIENT_SECRET}

NAVER_CLIENT_ID=${NAVER_CLIENT_ID}
NAVER_CLIENT_SECRET=${NAVER_CLIENT_SECRET}
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
