import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "User", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    email: {
      type: "text",
    },

    username: {
      type: "text",
    },

    thumbnail: {
      type: "text"
    },

    // passport-google id
    sub: {
      type: "text",
    },

    // Student | Teacher | Admin
    role: {
      type: "text",
    },

    createdAt: {
      type: "date"
    },

    updatedAt: {
      type: "date"
    }
  },
});

export default User;