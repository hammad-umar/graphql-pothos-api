import { GraphQLError } from "graphql";
import { UserEntity } from "../../database/entities/user.entity";
import { schemaBuilder } from "../gql-schema-builder";
import { db } from "../../database";

schemaBuilder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello, World",
    }),

    users: t.field({
      type: [UserEntity],
      resolve: async () => {
        const repository = db.getRepository(UserEntity);

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
        const repository = db.getRepository(UserEntity);

        const user = await repository.findOne({ where: { id } });

        if (!user) {
          throw new GraphQLError("User not found");
        }

        return user;
      },
    }),
  }),
});
