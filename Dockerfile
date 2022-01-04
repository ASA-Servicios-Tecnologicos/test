FROM node:14.18.1-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

ENV ENVIRONMENT production

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir -p /usr/src/app
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

WORKDIR /usr/src/app
ADD . /usr/src/app

RUN --mount=type=ssh,id=gitlab npm install
RUN --mount=type=ssh,id=gitlab npm run-script build

EXPOSE 3090

CMD /wait && npm run-script start:prod
