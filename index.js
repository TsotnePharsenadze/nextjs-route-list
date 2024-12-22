#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program } from "commander";
import chalk from "chalk";

function parseRouteFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const methods = new Set();

  const methodPattern = /\b(GET|POST|PUT|DELETE|PATCH)\b/g;

  let match;
  while ((match = methodPattern.exec(content)) !== null) {
    methods.add(match[1]);
  }

  return Array.from(methods);
}

function getRoutes(dirPath, isApiRoute = false, visitedDirs = new Set()) {
  const files = fs.readdirSync(dirPath);
  const routes = [];

  if (visitedDirs.has(dirPath)) {
    return routes;
  }

  visitedDirs.add(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      routes.push(...getRoutes(filePath, isApiRoute, visitedDirs));
    } else if (isApiRoute && (file === "route.ts" || file === "route.js")) {
      const relativePath = path
        .relative(path.join(process.cwd(), "app/api"), filePath)
        .replace(/\\/g, "/");

      const route = relativePath.replace(/\/route\.(ts|js)$/, "");
      const methods = parseRouteFile(filePath);
      routes.push({ route: `/${route}`, methods });
    } else if (!isApiRoute && (file === "page.tsx" || file === "page.jsx")) {
      const relativePath = path
        .relative(path.join(process.cwd(), "app"), filePath)
        .replace(/\\/g, "/");

      const route = relativePath.replace(/\/page\.(tsx|jsx)$/, "");
      routes.push({ route: `/${route}`, methods: null });
    }
  });

  return routes;
}

function formatRoute(route) {
  return route
    .replace(/\[([^\]]+)\]/g, ":$1")
    .replace(/\[\.\.\.([^\]]+)\]/g, "*$1");
}

function formatTable(routes, isApiRoute = false) {
  if (routes.length === 0) {
    console.log(chalk.red("No routes found."));
    return;
  }

  if (!isApiRoute) {
    console.log(
      chalk.bold(
        `\n| ${chalk.underline("Route")} |\n|${"-".repeat(40)}|${"-".repeat(
          20
        )}|`
      )
    );
  } else {
    console.log(
      chalk.bold(
        `\n| ${chalk.underline("Route")} | ${chalk.underline(
          "Methods"
        )} |\n|${"-".repeat(40)}|${"-".repeat(20)}|`
      )
    );
  }

  routes.forEach(({ route, methods }) => {
    const methodList = methods ? methods.join(", ") : "N/A";
    console.log(
      `| ${chalk.green(route.padEnd(38))} | ${chalk.blue(
        methodList.padEnd(18)
      )} |`
    );
  });
}

program
  .command("list")
  .description("List all the routes in the App Router, including API methods")
  .action(() => {
    const apiRoutes = getRoutes(path.join(process.cwd(), "app/api"), true);
    const appRoutes = getRoutes(path.join(process.cwd(), "app"));
    const formattedRoutes = [
      ...apiRoutes.map(({ route, methods }) => ({
        route: formatRoute(route),
        methods,
      })),
      ...appRoutes.map(({ route, methods }) => ({
        route: formatRoute(route),
        methods,
      })),
    ];

    const appRoutesWithoutMethods = formattedRoutes.filter((r) => !r.methods);
    const apiRoutesWithMethods = formattedRoutes.filter((r) => r.methods);

    console.log(chalk.bold("\n--- App Routes ---"));
    formatTable(appRoutesWithoutMethods);

    console.log(chalk.bold("\n--- API Routes with Methods ---"));
    formatTable(apiRoutesWithMethods, true);

    console.log(chalk.bold("\n--- Main Route ---"));
    console.log(chalk.yellow("/"));
  });

program.parse(process.argv);
