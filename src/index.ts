import express from "express";
import SchemaBuilder from "@pothos/core";
import { createYoga } from "graphql-yoga";

const app = express();
const port = 3000;

const schemaBuilder = new SchemaBuilder({});

schemaBuilder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello, World",
    }),
  }),
});

const yoga = createYoga({
  schema: schemaBuilder.toSchema({}),
});

app.use(yoga.graphqlEndpoint, yoga);

app.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
