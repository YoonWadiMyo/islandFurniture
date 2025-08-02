const db = require("./databaseConfig.js");

const reviewModel = {
  // Create review
  createReview: function (userId, sku, rating, title, content) {
    return new Promise((resolve, reject) => {
      const conn = db.getConnection();
      conn.connect(err => {
        if (err) {
          conn.end();
          return reject(err);
        }
        const sql = `
          INSERT INTO reviews (sku, user_id, rating, title, content)
          VALUES (?, ?, ?, ?, ?)
        `;
        conn.query(sql, [sku, userId, rating, title, content], (err, result) => {
          conn.end();
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  },

  // Get all reviews for SKU
  getReviewsBySku: function (sku) {
    return new Promise((resolve, reject) => {
      const conn = db.getConnection();
      conn.connect(err => {
        if (err) {
          conn.end();
          return reject(err);
        }
        const sql = `
          SELECT r.id, r.sku, r.rating, r.title, r.content, r.created_at, u.username AS author, u.email
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.sku = ?
          ORDER BY r.created_at DESC
        `;
        conn.query(sql, [sku], (err, results) => {
          conn.end();
          if (err) return reject(err);
          resolve(results);
        });
      });
    });
  },

  // Delete a review
  deleteReview: function (reviewId, userId) {
    return new Promise((resolve, reject) => {
      const conn = db.getConnection();
      conn.connect(err => {
        if (err) {
          conn.end();
          return reject(err);
        }
        const sql = `
          DELETE FROM reviews
          WHERE id = ? AND user_id = ?
        `;
        conn.query(sql, [reviewId, userId], (err, result) => {
          conn.end();
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  }
};

module.exports = reviewModel;
