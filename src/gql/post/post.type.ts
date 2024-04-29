import { PostEntity } from "../../database/entities/post.entity";
import { schemaBuilder } from "../gql-schema-builder";
import { postUserField } from "./post-user.field";

schemaBuilder.objectType(PostEntity, {
  name: "Post",
  description: "Represents Post",
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content"),
    user: postUserField(t),
  }),
});
