const { connection, query } = require("../src/db/snowflake");

setTimeout(async () => {
  try {
    const rows = await query(`
      SELECT CATEGORY, SUB_CATEGORY, COUNT(*) AS Q_COUNT
      FROM PTE_EXAM_PREP_PLATFORM.PUBLIC.QUESTION_DETAILS
      GROUP BY CATEGORY, SUB_CATEGORY
      ORDER BY CATEGORY, SUB_CATEGORY
    `);
    console.log("Database Subcategory Counts:", rows);
    connection.destroy(() => process.exit(0));
  } catch (err) {
    console.error("Query failed:", err.message);
    process.exit(1);
  }
}, 2000);
