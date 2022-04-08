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
    teacher_id: {
      type: 'int',
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
      nullable: true,
    },
    content: {
      type: 'text',
      nullable: true,
    },
    order: {
      type: 'int',
    },
    // can be bool
    is_public: {
      type: 'boolean',
      default: false,
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
