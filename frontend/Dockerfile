# frontend/Dockerfile

# 1단계: Node.js 런타임 환경 준비
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 (의존성 설치용)
# 이렇게 하면 package.json이 변경될 때만 npm install이 재실행되어 Docker 캐싱 활용에 유리합니다.
COPY package.json ./
COPY package-lock.json ./ 

# 의존성 설치
RUN npm install

# 개발 서버 실행 명령 (선택 사항: docker-compose.yml에서 command로 덮어쓸 수 있음)
# CMD ["npm", "start"]

# React 개발 서버의 기본 포트는 3000번입니다.
EXPOSE 3000


# # 실시간 반영 안 한 버전(됐었던 코드)
# FROM node:18-alpine as build
# WORKDIR /app
# COPY package.json ./
# COPY package-lock.json ./ 
# RUN npm install 
# COPY . ./
# RUN npm run build 

# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html 

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]