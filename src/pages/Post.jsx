import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PostAlbum from './new-post-pages/PostAlbum';
import PostPlaylist from './new-post-pages/PostPlaylist';
import PostSong from './new-post-pages/PostSong';
import PostArtist from './new-post-pages/PostArtist';

export default function Post() {
    return (
        <>
            <Routes>
                <Route path="/song" element={<PostSong/>} />
                <Route path="/artist" element={<PostArtist />} />
                <Route path="/album" element={<PostAlbum />} />
                <Route path="/playlist" element={<PostPlaylist />} />
            </Routes>
        </>
    );
}
