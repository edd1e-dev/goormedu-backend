import { EntitySchema } from "typeorm";

const Category = new EntitySchema({
  name: "Category",
  tableName: "Category",
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