var db = require('./databaseConfig.js');
var Review = require('./review.js');

var reviewDB = {
    getReviewsBySku: function (sku) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }
                var sql = 'SELECT * FROM reviewentity WHERE SKU=? ORDER BY createdAt DESC';
                conn.query(sql, [sku], (err, result) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }
                    var reviews = result.map(row => {
                        var r = new Review();
                        r.id = row.ID;
                        r.sku = row.SKU;
                        r.rating = row.RATING;
                        r.title = row.TITLE;
                        r.content = row.CONTENT;
                        r.author = row.AUTHOR;
                        r.createdAt = row.CREATEDAT;
                        return r;
                    });
                    conn.end();
                    return resolve(reviews);
                });
            });
        });
    },

    addReview: function (review) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }
                var sql = 'INSERT INTO reviewentity (SKU, RATING, TITLE, CONTENT, AUTHOR, CREATEDAT) VALUES (?,?,?,?,?,NOW())';
                conn.query(sql, [review.sku, review.rating, review.title, review.content, review.author], (err, result) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }
                    conn.end();
                    return resolve({ success: true, insertedId: result.insertId });
                });
            });
        });
    },


    deleteReview: function (id, author) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect((err) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }
                var sql = 'DELETE FROM reviewentity WHERE ID=? AND AUTHOR=?';
                conn.query(sql, [id, author], (err, result) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }
                    conn.end();
                    return resolve({ success: result.affectedRows > 0 });
                });
            });
        });
    }
}

module.exports = reviewDB;
