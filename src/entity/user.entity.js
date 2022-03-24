import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User", // Will use table name `User` as default behaviour.
  tableName: "User", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    email: {
      type: "text",
    },
    sub: {
      type: "text",
    },
  },
});

export default User;
