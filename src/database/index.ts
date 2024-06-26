import { DataSource } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { PostEntity } from "./entities/post.entity";

export const db = new DataSource({
  type: "sqlite",
  database: "db.sql",
  synchronize: true,
  entities: [UserEntity, PostEntity],
});

export const initDatabase = async (): Promise<void> => {
  try {
    await db.initialize();
    console.log("Database Connected.");
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }
};
