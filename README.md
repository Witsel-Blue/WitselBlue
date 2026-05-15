## Requirements
vue2 + nuxt



## Build Setup

### install dependencies
$ npm install

### serve with hot reload
$ npm run dev

- 기본: **v2026** → `http://localhost:3000/`
- **v2025** 는 `http://localhost:3001` 에서 직접 뜨고, 3000에서는 **`@nuxtjs/proxy`** 로 **`/v2025`** 를 3001로 넘깁니다 (`http://localhost:3000/v2025/`).

운영 환경에서는 v2026의 프록시가 비활성화되므로, 동일 도메인에서 `/v2025` 를 쓰려면 웹서버/CDN에서 경로별로 v2025 정적 산출물(또는 SSR)을 따로 매핑해야 합니다.

### build for production and launch server
$ npm run build

$ npm run start

### generate static project
$ npm run generate
