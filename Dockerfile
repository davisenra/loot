FROM node:26-alpine AS spa-builder

ENV VITE_POCKETBASE_URL="http://127.0.0.1:8090"
ENV CI="true"

WORKDIR /app
COPY webapp/package.json webapp/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY webapp/ .
RUN pnpm run build

FROM alpine:3.22.4 AS pb-downloader

ARG PB_VERSION=0.38.2

RUN apk add --no-cache \
    unzip \
    curl \
    ca-certificates

RUN curl -L -o /tmp/pocketbase.zip https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip /tmp/pocketbase.zip -d /pb \
    && rm /tmp/pocketbase.zip

FROM alpine:3.22.4

RUN apk add --no-cache \
    nginx \
    tini \
    ca-certificates

COPY --from=pb-downloader /pb/pocketbase /pb/pocketbase
COPY --from=spa-builder /app/build /var/www/spa

COPY ./pocketbase/pb_migrations /pb/pb_migrations
COPY ./pocketbase/pb_hooks /pb/pb_hooks

COPY .docker/nginx.conf /etc/nginx/http.d/default.conf
COPY .docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ARG VERSION=latest
ARG BUILD_DATE
LABEL org.opencontainers.image.title="Loot"
LABEL org.opencontainers.image.description="Self-hosted order tracking/management"
LABEL org.opencontainers.image.version=${VERSION}
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.licenses=MIT

VOLUME /pb_data
EXPOSE 80

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]
