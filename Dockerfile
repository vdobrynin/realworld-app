FROM cypress/included:13.5.0
# FROM cypress/base:10.18.0    // this one won't work

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --force

RUN ["npx", "cypress", "verify"]
# RUN $(npm bin)/cypress verify     // this one won't work

RUN ["npm", "run", "cypress:e2e"]
# CMD ["npm", "run", "cypress:e2e"]    // i didn't try but teacher had at last min of lecture