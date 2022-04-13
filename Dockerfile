FROM node:16.14.2-alpine

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 캐시를 이용하기 위한 COPY -> 전체 파일 복사 시 시간 오래걸림
COPY package*.json ./

# 필요한 패키지를 node_modules폴더에 설치
# 도커 이미지 사이즈를 최대한 작게 하기 위해
# 이미지를 만들 때부터 넣지 않고 컨테이너 생성 시 설치
RUN npm install

# 앱 소스 추가
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
