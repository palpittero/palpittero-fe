FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN node -v

RUN npm -v

RUN apk add --no-cache python3 make g++

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS production-stage

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
