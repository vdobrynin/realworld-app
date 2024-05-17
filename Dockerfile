FROM cypress/base:18.16.0

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --force

RUN npm install cypress --force

RUN npm install --save-dev cypress --force

RUN npx update-browserslist-db@latest --force

RUN npm update --force

RUN npx cypress verify
# RUN ["npx", "cypress", "verify"]

RUN npm run cypress:e2e
# RUN ["npm", "run", "cypress:e2e"]