FROM cypress/included:13.6.1
# Okteto expects the workdir to be /okteto/src for okteto test
WORKDIR /okteto/src
COPY package.json yarn.lock /okteto/src/
RUN yarn install
COPY cypress.config.js cypress /okteto/src/