INSERT INTO posts (user_id, type, image_url, music_id, title, artist, caption, rating)
SELECT
  2,
  'song',
  'https://i.scdn.co/image/ab67616d0000b27366ae1fd71a3e5779e98e277a',
  '0xLCa6dp0wmDUhkDGKzDpv' || i,
  'F.F.F. (feat. G-Eazy) ' || i,
  'Bebe Rexha, G-Eazy',
  'auto-generated post #' || i,
  (1 + (random() * 4)::int)
FROM generate_series(1, 100) AS s(i);
