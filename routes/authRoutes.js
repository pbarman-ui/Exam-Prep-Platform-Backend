const express = require("express");
const router = express.Router();

const connection = require("../db/snowflake");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");


// ================= LOGIN ROUTE =================
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  // SAFE QUERY WITH BINDS
  const query = `
    SELECT * 
    FROM LOGINDETAILS.PUBLIC.USERDETAILS
    WHERE EMAIL = ?
  `;

  connection.execute({
    sqlText: query,
    binds: [email],

    complete: function (err, stmt, rows) {

      // DATABASE ERROR
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      // USER NOT FOUND
      if (rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = rows[0];

      // WRONG PASSWORD
      if (user.PASSWORD !== password) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }

      // GENERATE JWT TOKEN
      const token = jwt.sign(
        {
          email: user.EMAIL,
          id: user.ID,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // SUCCESS RESPONSE
      return res.json({
        message: "Login successful",
        token,
      });
    },
  });
});


// ================= PROTECTED DASHBOARD ROUTE =================
router.get("/dashboard", verifyToken, (req, res) => {

  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });

});


// ================= SIGNUP ROUTE =================
router.post("/signup", (req, res) => {

  const { name, email, password } = req.body;

  // CHECK IF USER EXISTS
  const checkQuery = `
    SELECT * 
    FROM LOGINDETAILS.PUBLIC.USERDETAILS
    WHERE EMAIL = ?
  `;

  connection.execute({
    sqlText: checkQuery,
    binds: [email],

    complete: function (err, stmt, rows) {

      // DATABASE ERROR
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      // USER ALREADY EXISTS
      if (rows.length > 0) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      // INSERT NEW USER
      const insertQuery = `
        INSERT INTO LOGINDETAILS.PUBLIC.USERDETAILS
        (ID, NAME, EMAIL, PASSWORD)
        VALUES (?, ?, ?, ?)
      `;

      const id = Date.now().toString();

      connection.execute({
        sqlText: insertQuery,
        binds: [id, name, email, password],

        complete: function (err2) {

          // INSERT ERROR
          if (err2) {
            return res.status(500).json({
              message: "Insert failed",
              error: err2.message,
            });
          }

          // SUCCESS RESPONSE
          return res.status(201).json({
            message: "User created successfully",
            user: {
              id,
              name,
              email,
            },
          });
        },
      });
    },
  });
});

module.exports = router;