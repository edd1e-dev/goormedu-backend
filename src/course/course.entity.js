import { EntitySchema } from 'typeorm';

const Course = new EntitySchema({
  name: 'Course',
  tableName: 'Course',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },

    teacher_id: {
      type: 'int',
    },

    category_id: {
      type: 'int',
    },

    title: {
      type: 'text',
    },

    description: {
      type: 'text',
    },

    // 1 ~ 5
    level: {
      type: 'int',
    },

    cover_image: {
      type: 'text',
    },

    createdAt: {
      type: 'date',
    },

    updatedAt: {
      type: 'date',
    },
  },
});

export default Course;
