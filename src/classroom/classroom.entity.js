import { EntitySchema } from "typeorm";

const Classroom = new EntitySchema({
  name: "Classroom", 
  tableName: "Classroom", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    student_id: {
      type: "int",
    },

    classroom_id: {
      type: "int",
    }
  },
  uniques: [
    {
      columns: ['student_id', 'classroom_id']
    }
  ]
});

export default Classroom;