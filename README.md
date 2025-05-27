# 겜숲 GemSup

# 게임 추천 시스템/위시리스트 프로젝트 (with Spring Boot & React)

## 1. 프로젝트 개요
- **목표**: 사용자가 관심 있는 게임을 위시리스트에 추가하고, 과거 플레이 기록 및 선호 장르 등을 기반으로 새로운 게임을 추천받을 수 있는 웹 애플리케이션 개발
- **기술 스택**:
  - 백엔드: Spring Boot, JPA, Spring Security, JWT, PostgreSQL (Docker)
  - 프론트엔드: React (TypeScript), React Router DOM, Axios
  - 인프라: Docker, Docker Compose

---

## 2. 기능 요건

### 2.1. 사용자 관리 (인증/인가)
- 회원가입(이메일, 사용자명, 비밀번호)
- 로그인/로그아웃(JWT 기반)
- 사용자 정보 조회/수정
- 비밀번호 암호화 및 인증 필터 적용(Spring Security)
- 프론트엔드에서 인증 토큰 관리 및 로그인 상태 UI 반영

### 2.2. 게임 정보 관리 및 조회
- IGDB API(필수), Steam API(선택) 연동
- 게임 정보(이름, 장르, 플랫폼, 출시일, 설명, 이미지, 평점 등) DB 저장 및 캐싱
- 게임 목록 조회(페이징, 정렬, 필터링)
- 게임 상세 정보 조회
- 게임 검색(이름, 장르 등)
- 프론트엔드: 검색/필터 UI, 카드형 목록, 상세 페이지, 무한 스크롤/페이징

### 2.3. 위시리스트 기능
- 위시리스트에 게임 추가/삭제/조회 API
- User-Game 다대다 관계(중간 테이블 활용)
- 프론트엔드: 위시리스트 버튼, 내 위시리스트 페이지

### 2.4. 게임 평가/리뷰 기능
- 게임별 평점 및 리뷰 등록/조회/수정/삭제 API
- User, Game, Review 엔티티 설계
- 평균 평점 계산
- 프론트엔드: 별점 입력, 리뷰 작성/목록 UI

### 2.5. 게임 추천 시스템
- 콘텐츠 기반 추천(선호 장르/플랫폼/개발사)
- 인기 기반 추천(위시리스트/평점 순)
- 최신 게임 추천
- 프론트엔드: 추천 게임 목록, 추천 방식 선택 UI

---

## 3. 비기능 요건
- Docker Compose로 개발/운영 환경 통합 관리
- API 호출 제한 대응(캐싱, 주기적 데이터 동기화)
- 반응형 UI 및 사용자 친화적 UX
- 보안(비밀번호 암호화, JWT 만료/갱신, API 인증 등)
- 코드 및 데이터베이스 구조의 확장성

---

## 4. 개발 단계
1. 환경 설정(Docker Compose)
2. 백엔드: Game 엔티티/CRUD, IGDB 연동, 게임 목록 API
3. 프론트엔드: 게임 목록/상세/검색 UI, API 연동
4. 인증/인가(Spring Security, JWT, 로그인/회원가입 UI)
5. 위시리스트 기능
6. 평가/리뷰 기능
7. 추천 시스템(단순 → 고도화)

---

## 5. 기능별 상세 요구사항

### 5.1. 사용자 관리 (인증/인가)
- 사용자는 이메일, 사용자명, 비밀번호로 회원가입할 수 있다.
- 비밀번호는 암호화되어 저장되어야 한다.
- 사용자는 JWT 기반으로 로그인/로그아웃할 수 있다.
- 로그인 성공 시 JWT 토큰이 발급되어야 하며, 프론트엔드는 토큰을 안전하게 저장/관리한다.
- 사용자는 자신의 정보를 조회 및 수정할 수 있다.
- 인증이 필요한 API는 Spring Security로 보호되어야 한다.
- 비로그인 사용자는 위시리스트, 평가, 추천 등 주요 기능을 사용할 수 없다.

### 5.2. 게임 정보 관리 및 조회
- 관리자는 외부 IGDB API(필수) 또는 Steam API(선택)에서 게임 정보를 주기적으로 동기화할 수 있다.
- 게임 정보는 이름, 장르, 플랫폼, 출시일, 설명, 이미지, 평점 등 주요 필드를 포함한다.
- 게임 목록은 페이징, 정렬(이름, 평점, 출시일 등), 장르/플랫폼 등으로 필터링할 수 있다.
- 사용자는 게임을 이름, 장르 등으로 검색할 수 있다.
- 게임 상세 페이지에서는 해당 게임의 모든 정보와 리뷰, 위시리스트 추가 버튼이 표시된다.
- 외부 API 호출 제한을 고려해, 게임 데이터는 DB에 캐싱/저장한다.

### 5.3. 위시리스트 기능
- 사용자는 게임 목록/상세 페이지에서 위시리스트에 게임을 추가/삭제할 수 있다.
- 위시리스트는 사용자별로 관리되며, 로그인한 사용자만 접근 가능하다.
- 사용자는 자신의 위시리스트 목록을 별도의 페이지에서 확인할 수 있다.
- 동일 게임을 중복 추가할 수 없다.

### 5.4. 게임 평가/리뷰 기능
- 사용자는 각 게임에 대해 평점(별점)과 텍스트 리뷰를 남길 수 있다.
- 사용자는 자신의 리뷰를 수정/삭제할 수 있다.
- 각 게임 상세 페이지에는 모든 사용자 리뷰와 평균 평점이 표시된다.
- 한 사용자는 한 게임에 한 번만 리뷰를 남길 수 있다.
- 부적절한 리뷰는 관리자가 삭제할 수 있다.

### 5.5. 게임 추천 시스템
- 사용자는 메인/추천 페이지에서 추천 게임 목록을 확인할 수 있다.
- 추천 방식은 콘텐츠 기반(선호 장르/플랫폼/개발사), 인기 기반(위시리스트/평점 순), 최신 게임 중 선택할 수 있다.
- 추천 결과는 사용자별로 다르게 제공된다(개인화).
- 추천 알고리즘은 추후 고도화가 가능하도록 설계한다.

---

## 6. API 명세

### 6.1. 사용자 관리
- **POST /api/auth/register** : 회원가입
  - Request: { email, username, password }
  - Response: { userId, username, email }
- **POST /api/auth/login** : 로그인
  - Request: { email, password }
  - Response: { token, userId, username }
- **GET /api/users/me** : 내 정보 조회 (JWT 필요)
  - Response: { userId, username, email, ... }
- **PUT /api/users/me** : 내 정보 수정 (JWT 필요)
  - Request: { username, email, ... }
  - Response: { userId, username, email, ... }

### 6.2. 게임 정보
- **GET /api/games** : 게임 목록 조회
  - Query: page, size, sort, genre, platform, search
  - Response: { content: [게임], totalPages, ... }
- **GET /api/games/{id}** : 게임 상세 조회
  - Response: { id, name, genre, platform, ... }
- **POST /api/games/sync** : 외부 API 동기화 (관리자)
  - Response: { syncedCount }

### 6.3. 위시리스트
- **GET /api/wishlist** : 내 위시리스트 목록 (JWT 필요)
  - Response: [게임]
- **POST /api/wishlist/{gameId}** : 위시리스트에 게임 추가 (JWT 필요)
  - Response: { success }
- **DELETE /api/wishlist/{gameId}** : 위시리스트에서 게임 삭제 (JWT 필요)
  - Response: { success }

### 6.4. 평가/리뷰
- **GET /api/games/{gameId}/reviews** : 게임별 리뷰 목록
  - Response: [ { reviewId, user, rating, comment, createdAt } ]
- **POST /api/games/{gameId}/reviews** : 리뷰 등록 (JWT 필요)
  - Request: { rating, comment }
  - Response: { reviewId, ... }
- **PUT /api/reviews/{reviewId}** : 리뷰 수정 (JWT 필요)
  - Request: { rating, comment }
  - Response: { reviewId, ... }
- **DELETE /api/reviews/{reviewId}** : 리뷰 삭제 (JWT 필요)
  - Response: { success }

### 6.5. 추천 시스템
- **GET /api/recommendations** : 추천 게임 목록 (JWT 필요)
  - Query: type=[content|popular|latest]
  - Response: [게임]

---

## 7. DB ERD (Entity Relationship Diagram)

```
[User]
- id (PK)
- email (UNIQUE)
- username
- password
- created_at
- updated_at

[Game]
- id (PK)
- name
- genre
- platform
- release_date
- description
- image_url
- rating
- created_at
- updated_at

[Wishlist]
- id (PK)
- user_id (FK, User)
- game_id (FK, Game)
- created_at

[Review]
- id (PK)
- user_id (FK, User)
- game_id (FK, Game)
- rating
- comment
- created_at
- updated_at

// 관계 설명
User 1 --- N Wishlist N --- 1 Game
User 1 --- N Review   N --- 1 Game

// 주요 관계
- 한 사용자는 여러 게임을 위시리스트에 추가할 수 있음 (Wishlist: User-Game 다대다 중간 테이블)
- 한 사용자는 여러 게임에 리뷰를 남길 수 있고, 한 게임에 한 번만 리뷰 가능
- 한 게임은 여러 사용자의 위시리스트/리뷰에 포함될 수 있음
```

---

## 8. 리액트 타입스크립트 구조

```
src/
  ├── api/           # API 통신 모듈 (Axios 등)
  ├── components/    # 공통 UI 컴포넌트(버튼, 카드 등)
  ├── features/      # 도메인별 폴더(게임, 유저, 위시리스트 등)
  │     ├── games/
  │     ├── users/
  │     ├── wishlist/
  │     └── reviews/
  ├── hooks/         # 커스텀 훅
  ├── pages/         # 라우트 단위 페이지 컴포넌트
  ├── routes/        # 라우팅 관련 파일
  ├── store/         # 전역 상태관리(Redux 등)
  ├── types/         # 타입 정의(TypeScript 인터페이스 등)
  ├── utils/         # 유틸 함수
  ├── App.tsx
  ├── index.tsx
  └── ...

```

### 예시
```
src/features/games/GameList.tsx
src/features/users/LoginForm.tsx
src/components/Button.tsx
src/pages/HomePage.tsx
src/api/gameApi.ts
src/types/game.ts
src/store/index.ts
src/hooks/useAuth.ts
src/utils/formatDate.ts
```
