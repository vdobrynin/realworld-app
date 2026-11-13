FROM cypress/included:16.3.0

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --force

RUN ["npx", "cypress", "verify"]

RUN ["npm", "run", "cypress:e2e"]