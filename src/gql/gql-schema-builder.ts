import SchemaBuilder from "@pothos/core";

export const schemaBuilder = new SchemaBuilder({});

import "./user/user.mutation";
import "./user/user.query";
import "./user/user.type";

import "./post/post.type";
import "./post/post.query";

export const schema = schemaBuilder.toSchema();
