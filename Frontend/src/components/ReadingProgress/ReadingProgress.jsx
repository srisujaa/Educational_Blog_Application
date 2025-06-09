import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Progress, Button, Form } from "reactstrap";
import "./readingprogress.css";

const API_URL = 'http://localhost:5003';

const ReadingProgress = () => {
  const [readingStats, setReadingStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    readingStreak: 0,
    averageRating: 0
  });

  const [readingGoal, setReadingGoal] = useState({
    target: 12,
    current: 0,
    deadline: new Date(new Date().getFullYear(), 11, 31)
  });

  const [tips, setTips] = useState([
    "Set aside dedicated reading time each day",
    "Join a book club or reading community",
    "Keep a reading journal",
    "Try different genres to keep things interesting",
    "Use the Pomodoro technique for focused reading sessions"
  ]);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    pages: '',
    rating: 5
  });

  const handleAddBook = (e) => {
    e.preventDefault();
    setReadingStats(prev => ({
      ...prev,
      booksRead: prev.booksRead + 1,
      pagesRead: prev.pagesRead + parseInt(newBook.pages),
      averageRating: ((prev.averageRating * prev.booksRead) + parseInt(newBook.rating)) / (prev.booksRead + 1)
    }));
    setReadingGoal(prev => ({
      ...prev,
      current: prev.current + 1
    }));
    setNewBook({
      title: '',
      author: '',
      pages: '',
      rating: 5
    });
  };

  const calculateProgress = () => {
    return (readingGoal.current / readingGoal.target) * 100;
  };

  return (
    <div className="reading-progress">
      <h1>Reading Progress Tracker</h1>
      
      <div className="stats-container">
        <div className="stats-card">
          <h3>Books Read</h3>
          <p className="stat-number">{readingStats.booksRead}</p>
        </div>
        <div className="stats-card">
          <h3>Pages Read</h3>
          <p className="stat-number">{readingStats.pagesRead}</p>
        </div>
        <div className="stats-card">
          <h3>Reading Streak</h3>
          <p className="stat-number">{readingStats.readingStreak} days</p>
        </div>
        <div className="stats-card">
          <h3>Average Rating</h3>
          <p className="stat-number">{readingStats.averageRating.toFixed(1)}/5</p>
        </div>
      </div>

      <div className="goal-card">
        <h2>Annual Reading Goal</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p>{readingGoal.current} of {readingGoal.target} books completed</p>
      </div>

      <div className="tips-section">
        <h2>Reading Tips</h2>
        <ul className="tips-list">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="add-book-section">
        <h2>Add New Book</h2>
        <form onSubmit={handleAddBook}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Book Title"
              value={newBook.title}
              onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Number of Pages"
              value={newBook.pages}
              onChange={(e) => setNewBook({...newBook, pages: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Rating:</label>
            <input
              type="range"
              min="1"
              max="5"
              value={newBook.rating}
              onChange={(e) => setNewBook({...newBook, rating: e.target.value})}
            />
            <span>{newBook.rating}/5</span>
          </div>
          <button type="submit" className="add-book-btn">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default ReadingProgress; 