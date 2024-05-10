# Unify CMS demo website

This application is a demonstration of how the Unify CMS API's can be interacted with. It's using Next.js with app-directory routing.

## Installation

1. Ensure you've got and are using atleast Node 20.11. If you haven't:
    1. Install (NVM)[https://github.com/coreybutler/nvm-windows]
    2. Open a new terminal/powershell
    3. Run `nvm install 20.11`
    4. Run `nvm use 20.11`
2. Install yarn: `npm i -g yarn`
3. Navigate to the root of the project
4. Install all dependencies: `yarn install`

## Starting the website

To start this application, we have to start the CMS, build the app, and then finally start the app as well.

This is because Next.js needs to generate static pages at build time, which requires the API content to be available.

To do this:

1. Ensure you've installed the project, as per **[Installation](#installation)**
2. Navigate to the root of the project
3. In one terminal, launch the CMS: `yarn start:cms`
4. Wait for the CMS to fully start
5. In another terminal, build and launch the app: `yarn start:app`

You'll then be able to access the CMS at http://localhost:1234, and the app at http://localhost:3000.

_The reason for not using Docker is because it appears to be a massive pain to spin up one container after another has already started using docker-compose._
