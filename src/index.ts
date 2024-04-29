import express from "express";
import { writeFileSync } from "fs";
import { join } from "path";
import SchemaBuilder from "@pothos/core";
import { createYoga } from "graphql-yoga";
import { GraphQLError, lexicographicSortSchema, printSchema } from "graphql";

const app = express();
const port = 3000;

const schemaBuilder = new SchemaBuilder({});

class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public verified: boolean
  ) {}
}

let users: User[] = [
  new User(1, "Hammad Umar", "hammadumar8080@gmail.com", true),
  new User(2, "Ali", "ali@gmail.com", false),
];

schemaBuilder.objectType(User, {
  name: "User",
  description: "Represents User",
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    verified: t.exposeBoolean("verified"),
  }),
});

schemaBuilder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello, World",
    }),

    users: t.field({
      type: [User],
      resolve: () => {
        return users;
      },
    }),

    user: t.field({
      type: User,
      args: {
        id: t.arg({
          type: "Int",
          required: true,
        }),
      },
      resolve: (_, args) => {
        const { id } = args;

        const user = users.find((user) => user.id === id);

        if (!user) {
          throw new GraphQLError("User not found");
        }

        return user;
      },
    }),
  }),
});

schemaBuilder.mutationType({
  fields: (t) => ({
    createUser: t.field({
      type: User,
      args: {
        name: t.arg({
          type: "String",
          required: true,
        }),
        email: t.arg({
          type: "String",
          required: true,
        }),
      },
      resolve: (_, args) => {
        const { name, email } = args;

        const alreadyExists = users.find((user) => user.email === email);

        if (alreadyExists) {
          throw new GraphQLError("Email already taken.");
        }

        const newUser = new User(users.length + 1, name, email, true);
        users.push(newUser);
        return newUser;
      },
    }),
  }),
});

const yoga = createYoga({
  schema: schemaBuilder.toSchema({}),
});

app.use(yoga.graphqlEndpoint, yoga);

const schema = schemaBuilder.toSchema();
const schemaAsString = printSchema(lexicographicSortSchema(schema));

app.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});

writeFileSync(join(__dirname, "../schema.graphql"), schemaAsString);
