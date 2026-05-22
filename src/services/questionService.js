const { query } = require("../db/snowflake");

const TABLE = "PTE_EXAM_PREP_PLATFORM.PUBLIC.QUESTION_DETAILS";

async function findByCategory(category, subCategory) {
  const sql = `
    SELECT QUESTIONID, QUESTION_TEXT, TITLE
    FROM ${TABLE}
    WHERE LOWER(TRIM(CATEGORY)) = LOWER(TRIM(?))
      AND LOWER(TRIM(SUB_CATEGORY)) = LOWER(TRIM(?))
  `;
  return query(sql, [category, subCategory]);
}

async function listSections() {
  const sql = `
    SELECT DISTINCT CATEGORY, SUB_CATEGORY
    FROM ${TABLE}
    ORDER BY CATEGORY, SUB_CATEGORY
  `;
  return query(sql);
}

async function findById(id) {
  const rows = await query(`SELECT * FROM ${TABLE} WHERE QUESTIONID = ?`, [id]);
  return rows[0] || null;
}

module.exports = { findByCategory, listSections, findById };
