DROP DATABASE IF EXISTS music_db;
CREATE DATABASE music_db;

\c music_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(225) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE post_type AS ENUM ('song', 'album', 'artist', 'playlist');

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  type post_type NOT NULL,
  music_id VARCHAR(60),
  caption TEXT, 
  rating INT NOT NULL CHECK (rating BETWEEN 1 and 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE follows (
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id <> following_id)
);

CREATE TABLE likes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);