import { defineDb, defineTable, column } from 'astro:db';

// Define the RoastCollection table
const RoastCollection = defineTable({
    columns: {
        username: column.text(),
        language: column.text(),
        response: column.text({ multiline: true }),
        createdAt: column.date(),
    }
});

// Export the database configuration
export default defineDb({
    tables: {
        RoastCollection,
    },
});