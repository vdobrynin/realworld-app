FROM cypress/base:18.16.0

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

RUN npm install cypress

RUN npm install --save-dev cypress

RUN npm update

RUN npx cypress verify
# RUN ["npx", "cypress", "verify"]

RUN npm run cypress:e2e
# RUN ["npm", "run", "cypress:e2e"]