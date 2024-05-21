FROM cypress/included:13.9.0

RUN mkdir /app
WORKDIR /app

COPY . /app
# COPY package.json .

RUN npm install --force
RUN npm --save-dev install cypress 
RUN npm update

# RUN npx cypress verify
RUN ["npx", "cypress", "verify"]

RUN npx cypress run 
# RUN npm run cypress:e2e
# RUN ["npm", "run", "cypress:e2e"]