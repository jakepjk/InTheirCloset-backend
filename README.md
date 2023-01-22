## Installation

```bash
$ npm install
```

## Required File

- .env.development.local
- .env.development
- .env.test

```.env.*
# Frontend Info
FRONTEND=${FRONTEND}

# DB Info
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}

# JWT Info
JWT_SECRET=${JWT_SECRET}

# Kakao Login Info
KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID}
KAKAO_CLIENT_SECRET=${KAKAO_CLIENT_SECRET}
KAKAO_CALLBACK_URL=${KAKAO_CALLBACK_URL}

# Naver Login Info
NAVER_CLIENT_ID=${NAVER_CLIENT_ID}
NAVER_CLIENT_SECRET=${NAVER_CLIENT_SECRET}

# Cloudflare
CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN}
CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID}
CLOUDFLARE_ACCOUNT_HASH=${CLOUDFLARE_ACCOUNT_HASH}
CLOUDFLARE_IMAGE_DELIVERY_URL=${CLOUDFLARE_IMAGE_DELIVERY_URL}
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
