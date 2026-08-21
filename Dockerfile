FROM node:20-alpine AS builder

ADD ./ /imbrace-ui

WORKDIR /imbrace-ui

RUN corepack enable && corepack prepare pnpm@9.1.2 --activate

RUN pnpm config set store-dir .pnpm-store

RUN pnpm fetch

RUN pnpm install -r

RUN pnpm build

COPY publish.sh /

RUN chmod +x /publish.sh

ENTRYPOINT ["/publish.sh"]