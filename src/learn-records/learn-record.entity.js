import { EntitySchema } from 'typeorm';

const LearnRecord = new EntitySchema({
  name: 'LearnRecord',
  tableName: 'LearnRecord',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    student_id: {
      type: 'int',
    },
    course_id: {
      type: 'int',
    },

    last_learning_date: {
      type: 'timestamp',
      nullable: true,
    },
    last_lecture_id: {
      type: 'int',
      nullable: true,
    },
    next_lecture_id: {
      type: 'int',
      nullable: true,
    },

    created_at: {
      type: 'timestamp',
      createDate: true,
    },

    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
});

export default LearnRecord;
