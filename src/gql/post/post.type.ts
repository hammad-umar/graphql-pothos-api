import { PostEntity } from "../../database/entities/post.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { schemaBuilder } from "../gql-schema-builder";

schemaBuilder.objectType(PostEntity, {
  name: "Post",
  description: "Represents Post",
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
    user: t.expose("user", { type: UserEntity }),
  }),
});
