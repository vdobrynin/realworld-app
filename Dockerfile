FROM cypress/included:13.5.0

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --force

RUN ["npx", "cypress", "verify"]

RUN ["npm", "run", "cypress:e2e"]