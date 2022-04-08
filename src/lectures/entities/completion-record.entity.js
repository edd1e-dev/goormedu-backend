import { EntitySchema } from 'typeorm';

const CompletionRecord = new EntitySchema({
  name: 'completion-record',
  tableName: 'completion-record',
  uniques: [{ columns: ['student_id', 'lecture_id'] }],
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
    course_id: {
      type: 'int',
    },
  },
});

export default CompletionRecord;
