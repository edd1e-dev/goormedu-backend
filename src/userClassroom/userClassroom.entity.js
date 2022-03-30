import { EntitySchema } from "typeorm";

const UserClassroom = new EntitySchema({
  name: "UserClassroom", 
  tableName: "UserClassroom", 
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

export default UserClassroom;