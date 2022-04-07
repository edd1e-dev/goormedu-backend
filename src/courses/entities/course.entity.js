import { EntitySchema } from 'typeorm';

const Course = new EntitySchema({
  name: 'course',
  tableName: 'course',
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

    created_at: {
      type: 'date',
      createDate: true,
    },

    updated_at: {
      type: 'date',
      updateDate: true,
    },
  },
});

export default Course;
