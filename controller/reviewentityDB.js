var express = require('express');
var app = express();
let middleware = require('./middleware');
var reviewDB = require('../model/reviewModel.js');

// Get all reviews by SKU
app.get('/api/reviews/:sku', function (req, res) {
    var sku = req.params.sku;
    reviewDB.getReviewsBySku(sku)
        .then(result => res.send(result))
        .catch(err => {
            console.log(err);
            res.status(500).send("Failed to get reviews");
        });
});

// Add a review
app.post('/api/reviews', middleware.checkToken, express.json(), function (req, res) {
    console.log("Saving review:", req.body);
    var r = {
        sku: req.body.sku,
        rating: req.body.rating,
        title: req.body.title,
        content: req.body.content,
        author: req.decoded.email
    };
    reviewDB.addReview(r)
        .then(result => res.send(result))
        .catch(err => {
            console.error(err);
            res.status(500).send("Failed to add review");
        });
});


// Delete a review by ID
app.delete("/api/reviews/:id", middleware.checkToken, (req, res) => {
    const id = req.params.id;
    const email = req.user.email;
    reviewDB.deleteReview(id, email)
        .then(result => {
            if (!result.success) {
                return res.status(403).json({ error: "Not allowed or review not found." });
            }
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Failed to delete review." });
        });
});


module.exports = app;
