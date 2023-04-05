# Flyway Command-Line Usage Guide
> This guide provides instructions on how to use the Flyway Command-Line tool to manage database migrations for your project. Flyway is an open-source database migration tool that helps you automate and manage the process of applying changes to your database schema.
## Installation
Before you can use Flyway, you need to install it on your system. You can download Flyway from the official website at https://flywaydb.org/.
And make sure flyway is registered on your environment system variables
## Setup
To get started, you need to copy and rename `flyway.conf.example` to `flyway.conf`. The configuration file specifies the details of your database connection and the location of your migration scripts. Create a file named flyway.conf in the root directory of your project and add the following configuration parameters:
```
flyway.url=jdbc:mysql://localhost:3306/mydb
flyway.user=myuser
flyway.password=mypassword
flyway.locations=filesystem:/path/to/migrations
```
Replace mydb, myuser, mypassword, and /path/to/migrations with your database details and migration script directory path, respectively.
## Usage
Once you have set up your configuration file, you can use Flyway to manage your database migrations. Here are some common commands:
1. flyway migrate: This command applies all pending migrations to your database. To use this command, navigate to the root directory of your project and run the following command:
    ```shell 
    flyway -community -configFiles=flyway.conf migrate
    ```
2. flyway info: This command shows the current status of your database migrations. To use this command, navigate to the root directory of your project and run the following command:
   ```shell 
   flyway -community -configFiles=flyway.conf info
   ```
3. flyway validate: This command validates the applied migrations against the ones available locally. To use this command, navigate to the root directory of your project and run the following command:
   ```shell 
   flyway -community -configFiles=flyway.conf validate
   ```
4. flyway clean: This command removes all the objects in the database schema. To use this command, navigate to the root directory of your project and run the following command:
   ```shell 
   flyway -community -configFiles=flyway.conf clean
   ```