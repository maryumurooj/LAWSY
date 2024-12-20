import React, { useState } from 'react';

const BookmarkForm = ({ folderId, userId, onBookmarkAdded }) => {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await  fetch('/api/bookmarks', {
                title, note, url, folder_id: folderId, user_id: userId,
            });
            onBookmarkAdded();
            setTitle('');
            setNote('');
            setUrl('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Note" 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
            />
            <input 
                type="url" 
                placeholder="URL" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                required 
            />
            <button type="submit">Add Bookmark</button>
        </form>
    );
};

export default BookmarkForm;
