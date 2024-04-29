import { GraphQLError } from "graphql";
import { UserEntity } from "../../database/entities/user.entity";
import { schemaBuilder } from "../gql-schema-builder";
import { db } from "../../database";

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
        const repository = db.getRepository(UserEntity);

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
