const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Pool } = require('pg');
const cors = require("cors");
const axios = require("axios");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecretkey"; // temporary
USE_PLAIN_PASSWORDS = true
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // this comes from your JWT payload

    const userInfo = await pool.query(
      `
      SELECT 
        users.id AS user_id,
        users.username,
        users.email,
        users.image_url,
        users.profile_song_href,

        COALESCE(
          json_agg(
            json_build_object(
              'id', posts.id,
              'type', posts.type,
              'music_id', posts.music_id,
              'caption', posts.caption,
              'rating', posts.rating,
              'created_at', posts.created_at
            )
          ) FILTER (WHERE posts.id IS NOT NULL), 
          '[]'
        ) AS posts,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', f_followers.id,
                'username', f_followers.username,
                'image_url', f_followers.image_url
              )
            )
            FROM follows
            JOIN users AS f_followers
              ON follows.follower_id = f_followers.id
            WHERE follows.following_id = users.id
          ),
          '[]'
        ) AS followers,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', f_following.id,
                'username', f_following.username,
                'image_url', f_following.image_url
              )
            )
            FROM follows
            JOIN users AS f_following
              ON follows.following_id = f_following.id
            WHERE follows.follower_id = users.id
          ),
          '[]'
        ) AS following

      FROM users
      LEFT JOIN posts ON users.id = posts.user_id
      WHERE users.id = $1
      GROUP BY users.id;
      `,
      [userId]
    );

    if (userInfo.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const fullUser = userInfo.rows[0];

    res.json({
      user: {
        userId: fullUser.user_id,
        username: fullUser.username,
        email: fullUser.email,
        image_url: fullUser.image_url,
        profile_song_href: fullUser.profile_song_href,
        posts: fullUser.posts,
        followers: fullUser.followers,
        following: fullUser.following
      }
    });

  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Server error" });
  }
});

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
    }
  );

  return response.data.access_token;
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (!password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userInfo = await pool.query(
      `
      SELECT 
  users.id AS user_id,
  users.username,
  users.email,
  users.image_url,
  users.profile_song_href,

  -- Posts authored by this user
  COALESCE(
    json_agg(
      json_build_object(
        'id', posts.id,
        'type', posts.type,
        'music_id', posts.music_id,
        'caption', posts.caption,
        'rating', posts.rating,
        'created_at', posts.created_at
      )
    ) FILTER (WHERE posts.id IS NOT NULL), 
    '[]'
  ) AS posts,

  -- Followers (users who follow this user)
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', f_followers.id,
          'username', f_followers.username,
          'image_url', f_followers.image_url
        )
      )
      FROM follows
      JOIN users AS f_followers
        ON follows.follower_id = f_followers.id
      WHERE follows.following_id = users.id
    ),
    '[]'
  ) AS followers,

  -- Following (users this user follows)
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', f_following.id,
          'username', f_following.username,
          'image_url', f_following.image_url
        )
      )
      FROM follows
      JOIN users AS f_following
        ON follows.following_id = f_following.id
      WHERE follows.follower_id = users.id
    ),
    '[]'
  ) AS following

FROM users
LEFT JOIN posts ON users.id = posts.user_id
WHERE users.id = $1
GROUP BY users.id;

      `,
      [user.id]
    );

    const fullUser = userInfo.rows[0];

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        userId: fullUser.user_id,
        username: fullUser.username,
        email: fullUser.email,
        image_url: fullUser.image_url,
        profile_song_href: fullUser.profile_song_href,
        posts: fullUser.posts,
        followers: fullUser.followers,
        following: fullUser.following
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/track/:id", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { id } = req.params;

    const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch track data" });
  }
});

app.get("/api/artist/:id", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { id } = req.params;

    const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch artist data" });
  }
});

app.get("/api/album/:id", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { id } = req.params;

    const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch album data" });
  }
});

app.get('/api/post/:id', (req, res) => {
  const { id } = req.params;
  const db = `
    SELECT 
      p.id,
      p.user_id,
      u.username,
      p.type,
      p.music_id,
      p.caption,
      p.rating,
      p.created_at,
      COALESCE(
          json_agg(
              json_build_object(
                  'id', c.id,
                  'content', c.content,
                  'author', cu.username,
                  'created_at', c.created_at
              )
              ORDER BY c.created_at ASC
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
      ) AS comments
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN users cu ON c.user_id = cu.id
    WHERE p.id = $1
    GROUP BY p.id, u.username;
  `;

  pool.query(db, [id], (err, { rows }) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = `
SELECT 
    u.id AS user_id,
    u.username,
    u.email,
    u.password_hash,
    u.image_url,
    u.profile_song_href,
    u.created_at AS user_created_at,
    COALESCE(
        json_agg(
            json_build_object(
                'post_id', p.id,
                'type', p.type,
                'music_id', p.music_id,
                'caption', p.caption,
                'rating', p.rating,
                'title', p.title,
                'artist', p.artist,
                'image_url', p.image_url,
                'created_at', p.created_at,
                'comments', (
                    SELECT json_agg(
                        json_build_object(
                            'comment_id', c.id,
                            'author', cu.username,
                            'content', c.content,
                            'created_at', c.created_at
                        ) ORDER BY c.created_at DESC
                    )
                    FROM comments c
                    JOIN users cu ON c.user_id = cu.id
                    WHERE c.post_id = p.id
                )
            )
            ORDER BY p.created_at DESC  -- 👈 ensures newest posts come first
        ) FILTER (WHERE p.id IS NOT NULL), '[]'
    ) AS posts
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.id = ${id}
GROUP BY u.id;

    `;
    const { rows } = await pool.query(db);

    res.json({
      message: 'success',
      data: rows
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});



// app.get("/api/search", async (req, res) => {
//   try {
//     const token = await getAccessToken();
//     const { q } = req.query;

//     const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=album%2Ctrack%2Cartist&limit=10`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const tracks = response.data.tracks.items.map(track => ({
//       trackName: track.name,
//       artistName: track.artists.map(a => a.name).join(", "), // handles multiple artists
//       albumName: track.album.name,
//       albumImage: track.album.images[0]?.url // usually first image = largest
//     }));

//     res.json(tracks);
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to fetch search data" });
//   }
// });



app.get("/api/search", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { q } = req.query;

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=album%2Ctrack%2Cartist&limit=3`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { tracks, artists, albums } = response.data;

    const formattedTracks = tracks.items.map(track => ({
      type: "track",
      name: track.name,
      artists: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      image: track.album.images[0]?.url,
      popularity: track.popularity,
      href: track.href
    }));

    const formattedArtists = artists.items.map(artist => ({
      type: "artist",
      name: artist.name,
      artists: null,
      album: null,
      image: artist.images[0]?.url,
      popularity: artist.popularity,
      href: artist.href
    }));

    const combinedResults = [...formattedTracks, ...formattedArtists]

    const formattedAlbums = albums.items.map(album => ({
      name: album.name,
      artistName: album.artists.map(a => a.name).join(", "),
      image: album.images[0]?.url,
      href: album.href
    }));

    res.json({
      results: combinedResults,
      albums: formattedAlbums
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch search data" });
  }
});

app.get("/api/search/:q", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { q } = req.params;

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { tracks } = response.data;

    const formattedTracks = tracks.items.map(track => ({
      type: "track",
      name: track.name,
      artists: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      image: track.album.images[0]?.url,
      popularity: track.popularity
    }));

    res.json(formattedTracks);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch search data" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const db = `SELECT 
    u.id,
      u.username,
      u.email,
      u.created_at,
      u.password_hash,
      u.image_url,
      u.profile_song_href,
      --Posts by the user
    COALESCE(
      (
         SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'type', p.type,
                    'music_id', p.music_id,
                    'caption', p.caption,
                    'rating', p.rating,
                    'created_at', p.created_at
                )
            )
            FROM posts p
            WHERE p.user_id = u.id
        ),
        '[]'::json
    ) AS posts,

    COALESCE(
        (
            SELECT json_agg(
                json_build_object(
                    'id', f.following_id,
                    'username', uf.username
                )
            )
            FROM follows f
            JOIN users uf ON uf.id = f.following_id
            WHERE f.follower_id = u.id
        ),
        '[]'::json
    ) AS following,

    COALESCE(
        (
            SELECT json_agg(
                json_build_object(
                    'id', f.follower_id,
                    'username', uf.username
                )
            )
            FROM follows f
            JOIN users uf ON uf.id = f.follower_id
            WHERE f.following_id = u.id
        ),
        '[]'::json
    ) AS followers

FROM users u;`;
    const { rows } = await pool.query(db);

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

  const db = `SELECT 
    p.id, 
    p.user_id, 
    u.username, 
    p.type, 
    p.music_id, 
    p.caption, 
    p.rating, 
    p.created_at, 
    COALESCE(
        json_agg(
            json_build_object(
                'id', c.id,
                'content', c.content,
                'author', cu.username,
                'created_at', c.created_at
            ) ORDER BY c.created_at ASC
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
    ) AS comments
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN users cu ON c.user_id = cu.id
GROUP BY p.id, u.username
ORDER BY p.created_at DESC;
`;

  pool.query(db, (err, { rows }) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: rows
    })
  });
})

app.get('/api/posts/:userId', (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const db = `
SELECT 
  p.id, 
  p.user_id, 
  u.username, 
  u.image_url AS user_image_url,
  p.type, 
  p.music_id, 
  p.caption, 
  p.rating, 
  p.title, 
  p.artist, 
  p.image_url AS post_image_url,
  p.created_at, 
  COALESCE(
      json_agg(
          json_build_object(
              'id', c.id,
              'content', c.content,
              'author', cu.username,
              'created_at', c.created_at
          )
          ORDER BY c.created_at ASC
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'
  ) AS comments
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN users cu ON c.user_id = cu.id
WHERE 
  p.user_id = $1
  OR p.user_id IN (
    SELECT following_id 
    FROM follows 
    WHERE follower_id = $1
  )
GROUP BY 
  p.id, p.user_id, u.username, u.image_url,
  p.type, p.music_id, p.caption, p.rating, 
  p.title, p.artist, p.image_url, p.created_at
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3;

  `;

  pool.query(db, [userId, limit, offset], (err, result) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: 'success',
      data: result.rows,
    });
  });
});

app.get("/api/posts/music/:musicId", async (req, res) => {
  const { musicId } = req.params;

  try {
    const query = `
      SELECT 
        posts.*, 
        users.username,
        users.email
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.music_id = $1
      ORDER BY posts.created_at DESC;
    `;
    const { rows } = await pool.query(query, [musicId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No posts found for this music_id" });
    }

    res.status(200).json({
      success: true,
      count: rows.length,
      posts: rows,
    });
  } catch (err) {
    console.error("Error fetching posts by music_id:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/api/add-user', upload.single("image"), async (req, res) => {
  console.log("✅ /api/add-user route executed");
  const { username, email, password, songHref } = req.body;
  const file = req.file;

  try {

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email or username already taken" });
    }

    let passwordToStore;
    if (USE_PLAIN_PASSWORDS) {
      passwordToStore = password;
    } else {
      const saltRounds = 10;
      passwordToStore = await bcrypt.hash(password, saltRounds);
    }

    let imageUrl = null;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const bucket = process.env.S3_BUCKET_NAME;

      const uploadParams = {
        Bucket: bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      };

      await s3.send(new PutObjectCommand(uploadParams));

      imageUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, image_url, profile_song_href) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email",
      [username, email, passwordToStore, imageUrl, songHref]
    );

    res.status(201).json({ message: "success", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/add-post', ({ body }, res) => {
  const db = 'INSERT INTO posts (user_id, type, music_id, caption, rating, title, image_url, artist) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  const params = [body.user_id, body.type, body.music_id, body.caption, body.rating, body.title, body.image_url, body.artist];

  pool.query(db, params, (err, result) => {
    if (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: result.rows
    });
  });
});

app.post('/api/add-comment', ({ body }, res) => {
  const db = 'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *';
  const params = [body.post_id, body.user_id, body.content];

  pool.query(db, params, (err, result) => {
    if (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: result.rows
    });
  });
});

app.put('/api/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { caption, rating } = req.body;

  try {
    const result = await pool.query(
      `UPDATE posts 
       SET caption = COALESCE($1, caption), 
           rating = COALESCE($2, rating),
           created_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [caption, rating, postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      message: "Post updated successfully",
      post: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put('/api/follow-user', ({ body }, res) => {
  const db = `INSERT INTO follows (follower_id, following_id) VALUES
($1, $2)
`;
  const params = [body.user, body.isFollowing];

  pool.query(db, params, (err, result) => {
    if (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
      return;
    }

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
