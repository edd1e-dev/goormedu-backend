import { EntitySchema } from "typeorm";

const TeacherRecord = new EntitySchema({
  name: "teacher_record", 
  tableName: "teacher_record", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    student_id: {
        type: "int"
    },

    accepted: {
        type: "bool"
    },

    career: {
        type: "text"
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

export default TeacherRecord;