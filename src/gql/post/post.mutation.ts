import { GraphQLError } from "graphql";
import { db } from "../../database";
import { PostEntity } from "../../database/entities/post.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { schemaBuilder } from "../gql-schema-builder";

schemaBuilder.mutationField("createPost", (t) =>
  t.field({
    type: PostEntity,
    args: {
      title: t.arg({
        type: "String",
        required: true,
      }),
      content: t.arg({
        type: "String",
        required: true,
      }),
      userId: t.arg({
        type: "Int",
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const { userId, ...rest } = args;

      const userRepository = db.getRepository(UserEntity);
      const postRepository = db.getRepository(PostEntity);

      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new GraphQLError("User not found.");
      }

      const createdPost = postRepository.create({
        user,
        ...rest,
      });

      return postRepository.save(createdPost);
    },
  })
);
