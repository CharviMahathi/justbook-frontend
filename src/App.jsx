import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/movies`).then((response) => {
      setMovies(response.data);
      if (response.data.length > 0) {
        setSelectedMovieId(response.data[0].id);
      }
    }).catch(() => setMessage('Failed to fetch movies.'));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedMovieId) {
      setMessage('Please select a movie.');
      return;
    }

    axios.post(`${API_BASE_URL}/bookings`, {
      customerName,
      seats: Number(seats),
      movieId: Number(selectedMovieId),
    }).then(() => {
      setMessage('Booking successful!');
      setCustomerName('');
      setSeats(1);
    }).catch((error) => {
      const errorMessage = error.response?.data?.message || 'Booking failed.';
      setMessage(errorMessage);
    });
  };

  return (
    <div className="app">
      <h1>JustBook</h1>
      <p>Select a movie and reserve your seats.</p>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        <label htmlFor="movie">Movie</label>
        <select
          id="movie"
          value={selectedMovieId}
          onChange={(event) => setSelectedMovieId(event.target.value)}
        >
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title} ({movie.availableSeats} seats left)
            </option>
          ))}
        </select>

        <label htmlFor="name">Your Name</label>
        <input
          id="name"
          type="text"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="Jane Doe"
          required
        />

        <label htmlFor="seats">Seats</label>
        <input
          id="seats"
          type="number"
          min="1"
          value={seats}
          onChange={(event) => setSeats(event.target.value)}
          required
        />

        <button type="submit">Book Now</button>
      </form>

      <section className="movie-list">
        {movies.map((movie) => (
          <article key={movie.id}>
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <p><strong>Available Seats:</strong> {movie.availableSeats}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
