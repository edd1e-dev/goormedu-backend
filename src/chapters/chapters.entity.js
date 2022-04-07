import { EntitySchema } from "typeorm";

const Chapter = new EntitySchema({
  name: "chapter", 
  tableName: "chapter", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    course_id: {
        type: "int"
    },

    title: {
        type: "text"
    },

    order: {
      type: "int"
    },

    created_at: {
      type: "timestamp",
      createDate: true
    },

    updated_at: {
      type: "timestamp",
      updateDate: true
    }
  },
});

export default Chapter;