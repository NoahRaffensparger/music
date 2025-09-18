-- USERS
TRUNCATE follows RESTART IDENTITY CASCADE;

INSERT INTO users (username, email, password_hash) VALUES
('alice', 'alice@example.com', 'hashed_pw1'),
('bob', 'bob@example.com', 'hashed_pw2'),
('charlie', 'charlie@example.com', 'hashed_pw3'),
('diana', 'diana@example.com', 'hashed_pw4'),
('eric', 'eric@example.com', 'hashed_pw5');

-- POSTS
INSERT INTO posts (user_id, type, music_id, caption, rating) VALUES
(1, 'album', 101, 'Loving this new album!', 5),
(2, 'song', 102, 'Throwback vibes', 4),
(3, 'artist', 103, 'This one hits different.', 4),
(1, 'song', 104, 'Chill session tune.', 3),
(4, 'album', 105, 'Rocking out', 4),
(5, 'artist', 106, 'Perfect workout jam.', 1);

-- FOLLOWS
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2), (1, 3),
(2, 1), (2, 3),
(3, 4),
(4, 5),
(5, 1);

-- LIKES (must use post ids 1–6 that were just created)
INSERT INTO likes (user_id, post_id) VALUES
(1, 2),
(2, 1),
(3, 1),
(4, 3),
(5, 4),
(1, 5);

-- COMMENTS
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Love this album too!'),
(1, 3, 'Solid choice'),
(2, 1, 'Classic track'),
(3, 4, 'Yep, totally agree'),
(4, 5, 'This is perfect for late nights.'),
(5, 1, 'Rock on!'),
(6, 2, 'Definitely a gym banger');
