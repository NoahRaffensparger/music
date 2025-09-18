const express = require('express');
const { Pool } = require('pg');
const cors = require ("cors");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: 'postgres',
        password: '1012',
        host: 'localhost',
        database: 'music_db'
    },
    console.log(`Connected to the music_db database.`)
)

pool.connect();

app.get('/api/users', async (req, res) => {
  try {
    const db = 'SELECT id, username AS user FROM users';
    const { rows } = await pool.query(db);

    console.log(rows);

    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/posts', (req, res) => {

    const db = 'SELECT p.id, p.user_id, u.username, p.type, p.music_id, p.caption, p.rating, p.created_at FROM posts p JOIN users u ON p.user_id = u.id';

    pool.query(db, (err, { rows }) => {
        if (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
            return;
        }

        console.log(rows);
        res.json({
            message: 'success',
            data: rows
        })
    });
})

app.post('/api/add-user', ({ body }, res) => {
    const db = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
    const params = [body.username, body.email, body.password_hash];

    pool.query(db, params, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
            return;
        }

        console.log({ body })
        res.json({
            message: 'success',
            data: result.rows
        });
    });
});

app.post('/api/add-post', ({ body }, res) => {
    const db = 'INSERT INTO posts (user_id, track_id, caption) VALUES ($1, $2, $3) RETURNING *';
    const params = [body.user_id, body.track_id, body.caption];

    pool.query(db, params, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
            return;
        }

        console.log({ body })
        res.json({
            message: 'success',
            data: result.rows
        });
    });
});

app.delete('/api/user/:id', (req, res) => {

    const db = 'DELETE FROM users WHERE id = $1';
    const params = [req.params.id];

    pool.query(db, params, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        } else if (!result.rowCount) {
            res.json({
                message: 'User not found'
            });
        } else {
            res.json({
                message: 'deleted successfully',
                changes: result.rowCount,
                id: req.params.id
            });
        }
    });
});

app.delete('/api/post/:id', (req, res) => {

    const db = 'DELETE FROM posts WHERE id = $1';
    const params = [req.params.id];

    pool.query(db, params, (err, result) => {
        if (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        } else if (!result.rowCount) {
            res.json({
                message: 'Post not found'
            });
        } else {
            res.json({
                message: 'deleted successfully',
                changes: result.rowCount,
                id: req.params.id
            });
        }
    });
});

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
