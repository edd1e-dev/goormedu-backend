import { EntitySchema } from "typeorm";

const Chapter = new EntitySchema({
  name: "Chapter", 
  tableName: "Chapter", 
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

    createdAt: {
      type: "date"
    },

    updatedAt: {
      type: "date"
    }
  },
});

export default Chapter;