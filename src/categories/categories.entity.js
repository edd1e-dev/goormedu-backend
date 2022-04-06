import { EntitySchema } from "typeorm";

const Category = new EntitySchema({
  name: "category",
  tableName: "category",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    title: {
        type: "text"
    }
  },
});

export default Category;