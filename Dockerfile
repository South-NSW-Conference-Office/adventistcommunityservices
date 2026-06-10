# syntax=docker/dockerfile:1
# Public website (Vite/React SPA) -> static build served by nginx

FROM node:20-bullseye-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
ARG VITE_API_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
