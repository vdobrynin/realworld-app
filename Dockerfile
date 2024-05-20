FROM cypress/included:13.9.0

RUN mkdir /app
WORKDIR /app

COPY . /app
COPY package.json .

RUN npm install
RUN npm --save-dev install cypress 

RUN npm update && npm upgrade

# RUN npx cypress verify
RUN ["npx", "cypress", "verify"]

# RUN npm run cypress:e2e
RUN ["npm", "run", "cypress:e2e"]
# RUN npx cypress run --headless --browser chrome