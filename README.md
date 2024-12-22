# nextjs-route-list

A CLI tool for listing all routes in a Next.js app, similar to PHP's `artisan route:list`. This tool allows developers to easily see all the available routes in their Next.js application, including dynamic and catch-all routes, from a single command.

## Features

- **List All Routes**: Lists both app and API routes in your Next.js project.
- **Dynamic Routes**: Automatically formats dynamic routes like `[id]` as `:id`.
- **Catch-all Routes**: Formats catch-all routes like `[...slug]` as `/*slug`.
- **Main Route**: Always includes the root `/` route in the listing.
- **Customizable**: Simple to install and run, and can be easily integrated into your development workflow.

## Installation

You can install `nextjs-route-list` globally via npm or yarn.

### Global Installation

```bash
npm install -g nextjs-route-list
```

or

```bash
yarn global add nextjs-route-list
```

Alternatively, you can install it as a project dependency:

```bash
npm install nextjs-route-list --save-dev
```

## Usage

### List Routes

Once installed, you can run the following command to list all the routes in your Next.js app:

```bash
nextjs-route-list list
```

This will output all the app and API routes in your project, with dynamic routes formatted as `:param` and catch-all routes as `/*param`.

### Example Output

```bash
--- Main Route ---
/

--- App Routes ---
| Route |
|------------------------------|---------|
| /about                       | N/A     |
| /contact                     | N/A     |
| /blog/:id                    | N/A     |
| /blog/*slug                  | N/A     |

--- API Routes with Methods ---
| Route                        | Methods   |
|------------------------------|-----------|
| /auth/*nextauth           | GET, POST |
| /register                    | POST      |

--- Main Route ---
/
```

### Additional Options

Currently, there are no additional options, but you can always extend the tool as needed for your specific requirements.

## How It Works

`nextjs-route-list` recursively scans your `app` directory and lists all the routes based on the presence of `page.jsx` and `page.tsx` files (for app routes) or `route.js` and `route.ts` files (for API routes). The tool formats dynamic and catch-all routes and outputs them in an easy-to-read format.

## Contributing

We welcome contributions to `nextjs-route-list`. If you have suggestions or improvements, please feel free to fork the repository and create a pull request.

- Fork the repository on GitHub.
- Clone your fork to your local machine.
- Make changes and test them.
- Submit a pull request with a description of your changes.

## License

`nextjs-route-list` is open-source software licensed under the [ISC License](https://opensource.org/licenses/ISC).

## Links

- GitHub Repository: [https://github.com/TsotnePharsenadze/nextjs-route-list](https://github.com/TsotnePharsenadze/nextjs-route-list)
- Report Issues: [https://github.com/TsotnePharsenadze/nextjs-route-list/issues](https://github.com/TsotnePharsenadze/nextjs-route-list/issues)
