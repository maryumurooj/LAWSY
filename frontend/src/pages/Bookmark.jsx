import React, { useEffect, useState } from 'react';
import styles from './Bookmarks.module.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  const bookmark = [
    {
      id: 1,
      title: 'Criminal Law',
      description: '2024 (6) ALD 1 (AP) (DB)',
      url: 'https://reactjs.org/docs/getting-started.html',
    },
    {
      id: 2,
      title: 'Civil Procedure Code',
      description: '2024 (6) ALD 2 (AP) (DB)',
      url: 'https://developer.mozilla.org/',
    },
    {
      id: 3,
      title: 'Hindu Property Act Rules',
      description: '2024 (6) ALD 3 (AP) (DB)',
      url: 'https://css-tricks.com/',
    },
    {
        id: 4,
        title: 'Indian Penal Code',
        description: '2024 (6) ALD 4 (AP) (DB)',
        url: 'https://css-tricks.com/',
      },
      {
        id: 5,
        title: 'Juvenile Justice Act',
        description: '2024 (6) ALD 5 (AP) (DB)',
        url: 'https://css-tricks.com/',
      },
      {
        id: 6,
        title: 'Constitutional Law',
        description: '2024 (6) ALD 6 (AP) (DB)',
        url: 'https://css-tricks.com/',
      },
  ];


  //useEffect(() => {
  //const fetchBookmarks = async () => {
  //    try {
  //      const response = await fetch('http://localhost:3000/api/bookmarks');
  //      const data = await response.json();
  //      setBookmarks(data);
  //    } catch (error) {
  //      console.error('Error fetching bookmarks:', error);
  //    }
  //  };
//
  //  fetchBookmarks();
 // }, []);

  return (
    <div className={styles.bookmarksContainer}>
      {bookmark.map((bookmark) => (
        <div key={bookmark.id} className={styles.bookmarkCard}>
        <div className={styles.bookmarkContent}>
          <h3 className={styles.title}>{bookmark.title}</h3>
          <p className={styles.description}>{bookmark.description}</p>
          <p className={styles.url}>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              {bookmark.url}
            </a>
          </p>
        </div>
        <div className={styles.openButtonContainer}>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className={styles.openButton}>
            Open
          </a>
        </div>
      </div>
    ))}
  </div>
);
};

export default Bookmarks;
