FROM node:16-alpine

ARG FONTAWESOME_NPM_AUTH_TOKEN

# Install nginx & bash – bash is needed by e.g. the entrypoint script
RUN apk add nginx bash

RUN mkdir -p /develop
WORKDIR /develop

# Create a user for the app and set its permissions
RUN addgroup -S permissionui && adduser -S -D permissionui -G permissionui
RUN chown permissionui: /develop

# Copy files and install app as app user
USER permissionui

# Install dependencies
COPY .npmrc ./
COPY package*.json ./
COPY mydatashare-core-*.tgz ./
# We need devdeps for build (eslint, typescript stuff), so we cannot use --only=production.
# Using multi-stage build would help us get rid of devdeps and extra clutter in the production image build.
RUN npm ci

# Copy source files needed for build
COPY .eslintrc ./
COPY .prettierrc ./
COPY .babel-plugin-macrosrc.js ./
COPY tsconfig.json ./
COPY src src/
COPY public public/

ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false

# Build React app – see entrypoint.sh, index.html and the getEnvVar function for environment variable inlining
RUN npm run build
RUN mv build/index.html build/index.html.orig

# Switch to root for setting up nginx configuration
USER root

# Copy nginx configuration
COPY nginx/base-nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/sites-enabled/default.conf

RUN  mkdir -p /usr/share/nginx/html \
        && chown permissionui: -R /usr/share/nginx/html \
        && chown permissionui: -R /var/lib/nginx \
        && chown permissionui: -R /var/log/nginx

# Switch back to app user
USER permissionui

RUN mv ./build/* /usr/share/nginx/html

# nginx will serve content on this port
EXPOSE 5000

COPY entrypoint.sh ./
ENTRYPOINT ./entrypoint.sh
