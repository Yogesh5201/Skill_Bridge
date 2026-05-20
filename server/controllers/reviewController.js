const pool = require('../db/pool');

exports.addReview = async (req, res) => {
  const { revieweeId, rating, comment } = req.body;
  const reviewerId = req.user.id;

  if (!revieweeId || !rating)
    return res.status(400).json({ error: 'revieweeId and rating are required.' });

  if (rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });

  try {
    await pool.query(
      `INSERT INTO "Review" (id, rating, comment, "reviewerId", "revieweeId", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
      [rating, comment || null, reviewerId, revieweeId]
    );

    // Recalculate average rating
    const agg = await pool.query(
      `SELECT AVG(rating)::float as avg, COUNT(*)::int as count FROM "Review" WHERE "revieweeId" = $1`,
      [revieweeId]
    );

    await pool.query(
      `UPDATE "User" SET rating=$1, "numReviews"=$2, "updatedAt"=NOW() WHERE id=$3`,
      [agg.rows[0].avg || 0, agg.rows[0].count, revieweeId]
    );

    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error('addReview error:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as "reviewerName", u.avatar as "reviewerAvatar"
       FROM "Review" r
       JOIN "User" u ON u.id = r."reviewerId"
       WHERE r."revieweeId" = $1
       ORDER BY r."createdAt" DESC`,
      [req.params.userId]
    );

    const reviews = result.rows.map(r => ({
      ...r,
      reviewer: { name: r.reviewerName, avatar: r.reviewerAvatar }
    }));

    res.json(reviews);
  } catch (err) {
    console.error('getUserReviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
};
