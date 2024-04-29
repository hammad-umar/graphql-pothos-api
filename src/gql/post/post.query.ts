import { GraphQLError } from "graphql";
import { db } from "../../database";
import { PostEntity } from "../../database/entities/post.entity";
import { schemaBuilder } from "../gql-schema-builder";

schemaBuilder.queryField("posts", (t) =>
  t.field({
    type: [PostEntity],
    resolve: async () => {
      const repository = db.getRepository(PostEntity);
      const posts = await repository.find();
      return posts;
    },
  })
);

schemaBuilder.queryField("post", (t) =>
  t.field({
    type: PostEntity,
    args: {
      id: t.arg({
        type: "Int",
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const { id } = args;

      const repository = db.getRepository(PostEntity);
      const post = await repository.findOne({ where: { id } });

      if (!post) {
        throw new GraphQLError("Post not found.");
      }

      return post;
    },
  })
);
