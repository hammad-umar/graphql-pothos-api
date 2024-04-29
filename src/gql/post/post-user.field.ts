import { db } from "../../database";
import { PostEntity } from "../../database/entities/post.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { PothosFieldType } from "../gql-schema-builder";

export const postUserField = (t: PothosFieldType<PostEntity>) => {
  return t.field({
    type: UserEntity,
    description: "Post author",
    nullable: true,
    resolve: async (parent) => {
      const userRepository = db.getRepository(UserEntity);

      const user = await userRepository.findOne({
        where: { id: parent.user.id },
      });

      return user;
    },
  });
};
