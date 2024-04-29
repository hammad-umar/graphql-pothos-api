import express from "express";
import { join } from "path";
import { writeFileSync } from "fs";
import { createYoga } from "graphql-yoga";
import { lexicographicSortSchema, printSchema } from "graphql";

import { schema } from "./gql/gql-schema-builder";
import { initDatabase } from "./database";

const app = express();
const port = 3000;

const yoga = createYoga({
  schema,
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use(yoga.graphqlEndpoint, yoga);

const schemaAsString = printSchema(lexicographicSortSchema(schema));

app.listen(port, () => {
  console.log(`Server is up on port:${port}`);

  initDatabase();
});

writeFileSync(join(__dirname, "../schema.graphql"), schemaAsString);
