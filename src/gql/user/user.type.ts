import { UserEntity } from "../../database/entities/user.entity";
import { schemaBuilder } from "../gql-schema-builder";

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
