import { EntitySchema } from 'typeorm';

const User = new EntitySchema({
  name: 'user',
  tableName: 'user',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },

    email: {
      type: 'text',
    },

    username: {
      type: 'text',
    },

    thumbnail: {
      type: 'text',
    },

    // passport-google id
    sub: {
      type: 'text',
    },

    // Student | Teacher | Admin
    role: {
      type: 'text',
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

export default User;
