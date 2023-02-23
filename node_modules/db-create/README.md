# db-create

Creates the database.

## Getting started

Add the following to your `package.json` file to download the binary and
setup an npm script to run the task.

```json
./package.json
"scripts": {
  "db:create": "./node_modules/.bin/db_create"
},
```

Now run the commands:

```bash
$ npm install db-create --save-dev
$ npm run db:create
```

## Limitations

Currently only PostgreSQL is supported. To add support, open a pull request.

## Changelog

Get the project's history in [CHANGELOG.md](CHANGELOG.md).

## Maintainer

Andy Bettisworth <andy@accreu.com> https://andybettisworth.com

## License

This project is released under the [MIT License](LICENSE.txt).
