import { EntitySchema } from 'typeorm';

const CompletionRecord = new EntitySchema({
  name: 'completion_record',
  tableName: 'completion_record',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },

    student_id: {
      type: 'int',
    },

    lecture_id: {
      type: 'int',
    },
  },
  uniques: [
    {
      columns: ['student_id', 'lecture_id'],
    },
  ],
});

export default CompletionRecord;
