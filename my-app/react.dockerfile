FROM node:20-alpine
WORKDIR /my-app
ENV PATH /my-app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

EXPOSE 3000