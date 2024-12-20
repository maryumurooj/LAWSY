import React, { useEffect, useState } from 'react';
import BookmarkForm from './BookmarksForm';

const Dashboard = ({ userId }) => {
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const fetchFolders = async () => {
            const response = await  fetch(`/api/folders/${userId}`);
            setFolders(response.data);
        };
        fetchFolders();
    }, [userId]);

    return (
        <div>
            <h1>Folders</h1>
            {folders.map(folder => (
                <div key={folder.id}>
                    <h2>{folder.name}</h2>
                    <BookmarkForm folderId={folder.id} userId={userId} onBookmarkAdded={() => {}} />
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
