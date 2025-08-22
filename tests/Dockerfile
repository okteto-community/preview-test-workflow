FROM cypress/included:13.6.1
# Okteto expects the workdir to be /okteto/src for okteto test
WORKDIR /okteto/src
COPY package.json yarn.lock cypress.config.js /okteto/src/
COPY cypress /okteto/src/cypress
RUN yarn install