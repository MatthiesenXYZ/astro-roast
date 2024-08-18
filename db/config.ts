import { defineDb, defineTable, column } from 'astro:db';

const RoastCollection = defineTable({
    columns: {
        username: column.text(),
        language: column.text(),
        response: column.text({ multiline: true }),
        createdAt: column.date(),
    }
});

export default defineDb({
    tables: {
        RoastCollection,
    },
});