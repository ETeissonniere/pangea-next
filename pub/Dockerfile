FROM node:alpine

# Gyp will complain if python isn't installed
# We need dev tools to use gyp
RUN apk update
RUN apk add python alpine-sdk

RUN npm install -g scuttlebot
RUN npm install -g secure-scuttlebutt

CMD /bin/ash
