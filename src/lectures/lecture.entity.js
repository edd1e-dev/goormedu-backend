import { EntitySchema } from 'typeorm';

const Lecture = new EntitySchema({
  name: 'Lecture',
  tableName: 'Lecture',
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

    video_url: {
      type: 'text',
    },

    content: {
      type: 'text',
      nullable: true
    },

    order: {
      type: 'int',
    },

    // can be bool
    isPublic: {
      type: 'boolean',
    },

    createdAt: {
      type: 'date',
    },

    updatedAt: {
      type: 'date',
    },
  },
});

export default Lecture;
