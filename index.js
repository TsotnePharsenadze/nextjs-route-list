#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { program } from "commander";
import chalk from "chalk";

async function run() {
  function getRoutes(dirPath, isApiRoute = false) {
    const files = fs.readdirSync(dirPath);
    const routes = [];

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (
          isApiRoute &&
          (fs.existsSync(path.join(filePath, "route.js")) ||
            fs.existsSync(path.join(filePath, "route.ts")))
        ) {
          const relativePath = path.relative(
            path.join(process.cwd(), "app"),
            filePath
          );
          const route = relativePath === "" ? "/api" : `/api/${relativePath}`;
          routes.push(route);
        }

        if (
          fs.existsSync(path.join(filePath, "page.jsx")) ||
          fs.existsSync(path.join(filePath, "page.tsx"))
        ) {
          const relativePath = path.relative(
            path.join(process.cwd(), "app"),
            filePath
          );
          const route = relativePath === "" ? "/" : `/${relativePath}`;
          routes.push(route);
        }

        routes.push(...getRoutes(filePath, isApiRoute));
      }
    });

    return routes;
  }

  function formatRoute(route) {
    return route
      .replace(/\[([^\]]+)\]/g, ":$1")
      .replace(/\[\.\.\.([^\]]+)\]/g, "*$1");
  }

  program
    .command("list")
    .description("List all the routes in the app")
    .action(() => {
      const appRoutes = getRoutes(path.join(process.cwd(), "app"));
      const formattedAppRoutes = appRoutes.map((route) => formatRoute(route));

      const apiRoutes = getRoutes(path.join(process.cwd(), "app/api"), true);
      const formattedApiRoutes = apiRoutes.map((route) => formatRoute(route));

      console.log(chalk.bold("\n--- App Routes ---"));
      if (formattedAppRoutes.length > 0) {
        formattedAppRoutes.forEach((route) => console.log(chalk.green(route)));
      } else {
        console.log(chalk.red("No app routes found."));
      }

      console.log(chalk.bold("\n--- API Routes ---"));
      if (formattedApiRoutes.length > 0) {
        formattedApiRoutes.forEach((route) => console.log(chalk.blue(route)));
      } else {
        console.log(chalk.red("No API routes found."));
      }

      console.log(chalk.bold("\n--- Main Route ---"));
      console.log(chalk.yellow("/"));
    });

  program.parse(process.argv);
}

run();
