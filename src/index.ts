import express from "express";
import { writeFileSync } from "fs";
import { join } from "path";
import SchemaBuilder from "@pothos/core";
import { createYoga } from "graphql-yoga";
import { GraphQLError, lexicographicSortSchema, printSchema } from "graphql";
import { DataSource } from "typeorm";
import { UserEntity } from "./user/user.entity";

const app = express();
const port = 3000;

const schemaBuilder = new SchemaBuilder({});

const dataSource = new DataSource({
  type: "sqlite",
  database: "db.sql",
  synchronize: true,
  entities: [UserEntity],
});

schemaBuilder.objectType(UserEntity, {
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
      type: [UserEntity],
      resolve: async () => {
        const repository = dataSource.getRepository(UserEntity);

        const users = await repository.find();
        return users;
      },
    }),

    user: t.field({
      type: UserEntity,
      args: {
        id: t.arg({
          type: "Int",
          required: true,
        }),
      },
      resolve: async (_, args) => {
        const { id } = args;
        const repository = dataSource.getRepository(UserEntity);

        const user = await repository.findOne({ where: { id } });

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
      type: UserEntity,
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
      resolve: async (_, args) => {
        const { name, email } = args;
        const repository = dataSource.getRepository(UserEntity);

        const alreadyExists = await repository.findOne({ where: { email } });

        if (alreadyExists) {
          throw new GraphQLError("Email already taken.");
        }

        const createdUser = repository.create({ name, email });
        return repository.save(createdUser);
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

  dataSource
    .initialize()
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log("Error connecting with database", err);
    });
});

writeFileSync(join(__dirname, "../schema.graphql"), schemaAsString);
