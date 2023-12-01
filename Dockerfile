FROM node:16-alpine

RUN mkdir -p /develop
WORKDIR /develop

ENV PATH /develop/node_modules/.bin:$PATH

ARG FONTAWESOME_NPM_AUTH_TOKEN
ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/package.json \
    ${SERVICE_DIR}/package-lock.* \
    ${SERVICE_DIR}/.npmrc \
    /develop/
COPY ${SERVICE_DIR}/mydatashare-core-*.tgz /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn

EXPOSE 3001

CMD ["npm", "start"]
