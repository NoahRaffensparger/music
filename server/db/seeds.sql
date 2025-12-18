-- USERS
TRUNCATE follows RESTART IDENTITY CASCADE;

INSERT INTO users (username, email, password_hash, image_url, header_artist_href, header_artists, header_image_url, header_name, header_url )
VALUES
  ('noah', 'noah@example.com', '$2b$10$abcdefghij1234567890abcdEfghijklmnoPqrstu', 'https://ettaappbucket.s3.us-east-2.amazonaws.com/albert-dera-ILip77SbmOE-unsplash.jpg', '7HkdQ0gt53LP4zmHsL0nap', 'Ella Mai', 'https://i.scdn.co/image/ab67616d0000b2737ce0faf0620ab9c1779e1fbf', 'Trip', 'https://open.spotify.com/track/6CTWathupIiDs7U4InHnDA' ),
  ('sarah', 'sarah@example.com', '$2b$10$abcdefghij1234567890abcdEfghijklmnoPqrstu', 'https://ettaappbucket.s3.us-east-2.amazonaws.com/albert-dera-ILip77SbmOE-unsplash.jpg', '7HkdQ0gt53LP4zmHsL0nap', 'Ella Mai', 'https://i.scdn.co/image/ab67616d0000b2737ce0faf0620ab9c1779e1fbf', 'Trip', 'https://open.spotify.com/track/6CTWathupIiDs7U4InHnDA' ),
  ('liam', 'liam@example.com', '$2b$10$abcdefghij1234567890abcdEfghijklmnoPqrstu', 'https://ettaappbucket.s3.us-east-2.amazonaws.com/albert-dera-ILip77SbmOE-unsplash.jpg', '7HkdQ0gt53LP4zmHsL0nap', 'Ella Mai', 'https://i.scdn.co/image/ab67616d0000b2737ce0faf0620ab9c1779e1fbf', 'Trip', 'https://open.spotify.com/track/6CTWathupIiDs7U4InHnDA' ),
  ('john', 'john@example.com', '$2b$10$abcdefghij1234567890abcdEfghijklmnoPqrstu', 'https://ettaappbucket.s3.us-east-2.amazonaws.com/albert-dera-ILip77SbmOE-unsplash.jpg', '7HkdQ0gt53LP4zmHsL0nap', 'Ella Mai', 'https://i.scdn.co/image/ab67616d0000b2737ce0faf0620ab9c1779e1fbf', 'Trip', 'https://open.spotify.com/track/6CTWathupIiDs7U4InHnDA' ),
  ('musicman', 'musicman@example.com', '$2b$10$abcdefghij1234567890abcdEfghijklmnoPqrstu', 'https://ettaappbucket.s3.us-east-2.amazonaws.com/albert-dera-ILip77SbmOE-unsplash.jpg', '7HkdQ0gt53LP4zmHsL0nap', 'Ella Mai', 'https://i.scdn.co/image/ab67616d0000b2737ce0faf0620ab9c1779e1fbf', 'Trip', 'https://open.spotify.com/track/6CTWathupIiDs7U4InHnDA' );



-- POSTS
-- INSERT INTO posts (user_id, type, music_id, caption, rating) VALUES
-- (1, 'song', '2MLHyLy5z5l5YRp7momlgw', 'Late-night driving mood.', 5),
-- (2, 'album', '6mm1Skz3JE6AXneya9Nyiv', 'This beat is unreal.', 4),
-- (3, 'song', '6Re2AwZUVlgBng04BZTauW', 'Coffee + this track = perfect morning.', 3),
-- (4, 'artist', '3YQKmKGau1PzlVlkL1iodx', 'Instant serotonin boost.', 5),
-- (5, 'song', '3vQ4T78TTMOjQXGfXVKQJo', 'Can’t stop replaying this.', 4),
-- (2, 'album', '7GjVWG39IOj4viyWplJV4H', 'Feels like summer all over again.', 5),
-- (3, 'song', '47oS7xB31QQUyPCgHpM3VZ', 'Rainy day soundtrack.', 3),
-- (4, 'album', '1KFWgQTw3EMTQebaaepVBI', 'My current obsession.', 5),
-- (5, 'song', '4Hff1IjRbLGeLgFgxvHflk', 'Such a nostalgic vibe.', 4),
-- (1, 'artist', '3ONSkkEnOSZVNogu98dvTY', 'Background music for coding.', 5);


-- FOLLOWS
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 5),
(4, 1),
(5, 2);


-- LIKES
-- INSERT INTO likes (user_id, post_id) VALUES
-- (1, 2),
-- (2, 1),
-- (3, 4),
-- (4, 3),
-- (5, 5),
-- (1, 6),
-- (2, 7),
-- (3, 8),
-- (4, 9),
-- (5, 10);

-- COMMENTS
-- INSERT INTO comments (post_id, user_id, content) VALUES
-- (1, 2, 'This one never gets old.'),
-- (2, 3, 'On repeat all day.'),
-- (3, 4, 'Love the vibe here.'),
-- (4, 5, 'Such good energy!'),
-- (5, 1, 'Motivates me every time.'),
-- (6, 2, 'This track hits hard.'),
-- (7, 3, 'Brings back memories.'),
-- (8, 4, 'Totally underrated.'),
-- (9, 5, 'Always gets me moving.'),
-- (10, 1, 'Perfect road trip jam.');
