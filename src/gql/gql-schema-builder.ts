import SchemaBuilder, { ObjectFieldBuilder } from "@pothos/core";

export const schemaBuilder = new SchemaBuilder({});

import "./user/user.mutation";
import "./user/user.query";
import "./user/user.type";

import "./post/post.type";
import "./post/post.query";
import "./post/post.mutation";

export const schema = schemaBuilder.toSchema();

export type PothosFieldType<ParentType> = ObjectFieldBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<{}>,
  ParentType
>;
