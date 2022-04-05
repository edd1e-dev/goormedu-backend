import { EntitySchema } from "typeorm";

const Educator = new EntitySchema({
  name: "Educator", 
  tableName: "Educator", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    student_id: {
        type: "int"
    },

    isAccepted: {
        type: "bool"
    },

    career: {
        type: "text"
    },

    createdAt: {
      type: "date"
    },

    updatedAt: {
      type: "date"
    }
  },
});

export default Educator;