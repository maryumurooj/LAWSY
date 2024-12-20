import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { Link } from 'react-router-dom';


const data = [
  { id: 1, image: 'image1.png', name: 'Maryum', sku: '0003156', condition: 'New', location: 'Warehouse 1', available: 3546, reserved: 3354, onHand: 3546, price: '$10.13', modified: '03/13/2017' },
  { id: 2, image: 'image2.png', name: 'Yasir', sku: '00027648', condition: 'New', location: 'Warehouse 2', available: 4567, reserved: 6754, onHand: 4567, price: '$357.99', modified: '04/21/2016' },
  { id: 3, image: 'image3.png', name: 'Affan', sku: '00436784', condition: 'New', location: 'Warehouse 3', available: 657, reserved: 43675, onHand: 657, price: '$654.50', modified: '05/23/2017' },
  { id: 4, image: 'image4.png', name: 'Qadija', sku: '00046783', condition: 'New', location: 'Warehouse 4', available: 1463, reserved: 3789, onHand: 1463, price: '$36.99', modified: '09/25/2017' },
  // Add more data as necessary
];

const Dashboard = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <ul>
          <li>
            <Link to="/Home">
              <img className={styles.img} src="/home-icon.png" alt="Home" /> 
            </Link>
          </li>
          <li>
            <Link to="/ProfilePage">
              <img className={styles.img} src="/profile-icon.png" alt="Profile" /> 
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <img className={styles.img} src="/dashboard-icon.png" alt="Dashboard" /> 
            </Link>
          </li>
        </ul>
      </aside>

    <div className={styles.dashboard}>
      <div className={styles.actions}>
        <button className={styles.actionButton}>Udpate Membership</button>
        <button className={styles.actionButton}>Delete</button>
        <div className={styles.actionGroup}>
          <button className={styles.actionButton}>Export</button>
          <button className={styles.actionButton}>Import from CSV</button>
        </div>
        <button className={styles.addButton}>+ Add Member</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              Active
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Adress</th>
            <th>Tier</th>
            <th>Available</th>
            <th>Reserved</th>
            <th>On Hand</th>
            <th>Price</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className={selectedRows.includes(item.id) ? styles.selectedRow : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </td>
              <td>
                <img src={item.image} alt={item.name} className={styles.productImage} /> {item.name}
              </td>
              <td>{item.sku}</td>
              <td>{item.condition}</td>
              <td>{item.location}</td>
              <td>{item.available}</td>
              <td>{item.reserved}</td>
              <td>{item.onHand}</td>
              <td>{item.price}</td>
              <td>{item.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button className={styles.pageButton}>First</button>
        <button className={styles.pageButton}>Previous</button>
        <button className={styles.pageButton}>1</button>
        <button className={styles.pageButton}>2</button>
        <button className={styles.pageButton}>3</button>
        <button className={styles.pageButton}>4</button>
        <button className={styles.pageButton}>Next</button>
        <button className={styles.pageButton}>Last</button>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
