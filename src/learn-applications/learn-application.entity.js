import { EntitySchema } from 'typeorm';

const LearnApplication = new EntitySchema({
  name: 'LearnApplication',
  tableName: 'LearnApplication',
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
      type: 'date',
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
      type: 'date',
    },

    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
});

export default LearnApplication;
