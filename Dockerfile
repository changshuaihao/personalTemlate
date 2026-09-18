FROM node:18.12.0 as builder

ARG VUE_APP_VERSION_NO
ENV VUE_APP_VERSION_NO=${VUE_APP_VERSION_NO}

WORKDIR /opt/myapp
COPY . /opt/myapp
RUN npm config set registry https://registry.npmmirror.com && npm install -g pnpm && pnpm i && pnpm run build


FROM nginx:1.19.8-alpine
EXPOSE 80
COPY docker/nginx.conf /etc/nginx/
COPY --from=builder /opt/myapp/dist/ /usr/share/nginx/html/
