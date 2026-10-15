const db = require("../config/db");
const { createToken } = require("../middleware/authenticate");

exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT
      user_id,
      full_name,
      username,
      role,
      status
    FROM users
    WHERE username = ?
      AND password = ?
      AND status = 1
  `;

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Invalid username or password"
      });
    }

    let token;
    try {
      token = createToken(result[0]);
    } catch {
      return res.status(503).json({
        success: false,
        message: "Authentication is not configured on the server",
      });
    }

    res.json({
      success: true,
      user: result[0],
      token,
    });
  });
};
