const { query } = require("../db/snowflake");

const TABLE = "PTE_EXAM_PREP_PLATFORM.PUBLIC.USERDETAILS";

async function findByEmail(email) {
  const rows = await query(`SELECT * FROM ${TABLE} WHERE EMAIL = ?`, [email]);
  return rows[0] || null;
}

async function createStudent({ id, name, email }) {
  const sql = `
    INSERT INTO ${TABLE} (ID, NAME, EMAIL, ROLE)
    VALUES (?, ?, ?, 'student')
  `;
  await query(sql, [id, name, email]);
  return { id, name, email, role: "student" };
}

async function listStudents() {
  const rows = await query(
    `SELECT ID, NAME, EMAIL, ROLE, SCORE, PLAN, STATUS, JOINED
     FROM ${TABLE}
     WHERE ROLE = 'student'`,
  );
  return rows.map((r) => ({
    id: r.ID,
    name: r.NAME || "",
    email: r.EMAIL || "",
    role: r.ROLE || "",
    score: r.SCORE || 0,
    plan: r.PLAN || "Free",
    status: r.STATUS || "inactive",
    joined: r.JOINED || null,
  }));
}

module.exports = { findByEmail, createStudent, listStudents };
