import { EntitySchema } from 'typeorm';

const Lecture = new EntitySchema({
  name: 'lecture',
  tableName: 'lecture',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },

    course_id: {
      type: 'int',
    },

    chapter_id: {
      type: 'int',
    },

    title: {
      type: 'text',
    },

    video: {
      type: 'text',
    },

    content: {
      type: 'text',
    },

    isPublic: {
      type: 'bool',
    },

    order: {
      type: 'int',
    },

    pre_lecture_id: {
      type: 'int',
      default: null,
    },

    next_lecture_id: {
      type: 'int',
      default: null,
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

export default Lecture;
