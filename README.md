# Service for SPK MBKM Widyatama University
> TODO: Insert project tagline here

## Prerequisites
Before you begin, ensure you have met the following requirements:
* You have installed the latest version of typescript/nodejs
* You have installed PostgreSQL
* You have installed of Minio on your machine

## Installing / Getting started
Follow instructions below to install this application on your machine.
1. Clone this repository to your machine:
    ```shell
    git clone https://github.com/septemberkid/service-with-express.git
    ```
2. Go inside the cloned repository:
    ```shell
    cd service-with-express
    ```
3. Install all project dependencies
    ```shell
    npm install
    ```
4. Rename `.env.development.example` to `.env.development`
5. Configure the environment settings with your environment in the `.env.development` file
6. Try running the service on your machine
    ```shell
    cross-env NODE_ENV=development nodemon
    ```
## Contributing
1. Before you commit and push your code, please run this script:
    ```shell
    eslint --ignore-path .gitignore --ext .ts src/ --fix
    ```
2. Make sure you have resolved these errors.

## Helpful Links
* [Typescript Homepage](https://www.typescriptlang.org/)
* [Express Homepage](https://expressjs.com/)
* [Inversify Homepage](https://inversify.io/)
* [Mikro ORM](https://mikro-orm.io/docs/installation)
