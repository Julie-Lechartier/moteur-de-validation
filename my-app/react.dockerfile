FROM node:20-alpine

WORKDIR /my-app
ENV PATH /my-app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

COPY . ./

EXPOSE 3000

CMD ["sh", "-c", "HOST=0.0.0.0 PORT=3000 npm start"]