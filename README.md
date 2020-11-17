# va-server

Typescript version of the vacancy-aggregator backend.

Serves the vacancy-aggregator stacks api requests.

- built with nodejs using the [express](https://www.npmjs.com/package/express) framework
- uses [va-database](https://github.com/shibii/va-database) package to interface with a configured postgres database
- requires authentication to access the secured routes
- authentication is a simple jwt cookie express middleware implementation built with [bcrypt](https://www.npmjs.com/package/bcrypt) and [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) packages.
