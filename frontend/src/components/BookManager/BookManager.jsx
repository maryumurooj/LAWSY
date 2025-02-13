import React, { useState, useEffect } from "react";
import styles from "./BookManager.module.css";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    id: null,
    book_name: "",
    edition: "",
    price: 0.0,
    in_stock: false,
    image: null,  // New field for storing selected file
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setNewBook({
      id: null,
      book_name: "",
      edition: "",
      price: 0.0,
      in_stock: false,
    });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/books");
      if (response.data.success) {
        setBooks(response.data.books);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrUpdateBook = async () => {
    try {
      const formData = new FormData();
      formData.append("book_name", newBook.book_name);
      formData.append("edition", newBook.edition);
      formData.append("price", newBook.price);
      formData.append("in_stock", newBook.in_stock ? "true" : "false");
      if (newBook.image) {
        formData.append("image", newBook.image); // Append file
      }
  
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/books/${newBook.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:3000/api/books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      fetchBooks();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  const handleEditBook = (book) => {
    setNewBook({ ...book });
    setIsEditing(true);
  };

  const handleToggleInStock = (id) => {
    axios.patch(`http://localhost:3000/api/books/${id}/toggle-in-stock`)
      .then((response) => {
        if (response.data.success) {
          fetchBooks();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({ ...newBook, [name]: value });
  };

  return (
    <div className={styles.formcontainer}>
      <Form>
      <Form.Group controlId="image">
  <Form.Label>Upload Image</Form.Label>
  <Form.Control
    type="file"
    accept="image/*"
    onChange={(e) => setNewBook({ ...newBook, image: e.target.files[0] })}
  />
</Form.Group>

        <Form.Group controlId="book_name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={newBook.book_name}
            onChange={handleInputChange}
            name="book_name"
          />
        </Form.Group>

        <Form.Group controlId="edition">
          <Form.Label>Edition</Form.Label>
          <Form.Control
            type="text"
            value={newBook.edition}
            onChange={handleInputChange}
            name="edition"
          />
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={newBook.price}
            onChange={handleInputChange}
            name="price"
          />
        </Form.Group>

        <Form.Group className="p-3" controlId="in_stock">
          <Form.Check
            type="checkbox"
            label="Available"
            checked={newBook.in_stock}
            onChange={(e) => setNewBook({ ...newBook, in_stock: e.target.checked })}
            name="in_stock"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddOrUpdateBook}>
          {isEditing ? "Update Book" : "Add New Book"}
        </Button>
        {isEditing && (
          <Button variant="secondary" onClick={resetForm} style={{ marginLeft: "10px" }}>
            Cancel Edit
          </Button>
        )}
      </Form>

      <hr />

      <table className={styles.bookList}>
<thead>
  <tr>
    <th>Image</th>
    <th>Name</th>
    <th>Edition</th>
    <th>Price</th>
    <th>In Stock</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {books.map((book) => (
    <tr key={book.id}>
      <td>
        {book.image_url && <img src={book.image_url} alt="Book" width="50" />}
      </td>
      <td>{book.book_name}</td>
      <td>{book.edition}</td>
      <td>₹{book.price}</td>
      <td>
        <Form.Check
          type="switch"
          checked={book.in_stock}
          onChange={() => handleToggleInStock(book.id)}
        />
      </td>
      <td>
        <Button variant="secondary" onClick={() => handleEditBook(book)}>
          Edit
        </Button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default BookManager;
