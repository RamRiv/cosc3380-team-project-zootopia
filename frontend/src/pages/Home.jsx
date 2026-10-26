import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './Home.css'
import { TICKETS } from '../zooInfo.js'

// public front page, anyone can see this (no login)

const HOURS = [
  { days: 'Monday - Friday', time: '9am - 5pm' },
  { days: 'Saturday - Sunday', time: '9am - 6pm' },
]

function Home() {
  const [animals, setAnimals] = useState([])

  useEffect(() => {
    async function loadAnimals() {
      try {
        const response = await fetch('/api/animals')
        const data = await response.json()
        if (response.ok) {
          setAnimals(data)
        }
      } catch (err) {
        // leave empty if the backend is down
      }
    }
    loadAnimals()
  }, [])

  return (
    <div className="home">
      <header className="home-header">
        <span className="home-logo">Zoo Name</span>
        <nav>
        <a href="#hours">Hours</a>
        <a href="#tickets">Tickets</a>
        <a href="#animals">Animals</a>
        <Link to="/customer-login">Customer Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Staff Login</Link>
        </nav>
      </header>

      <section className="home-hero">
        <h1>Welcome to the Zoo</h1>
        <p>Short line about the zoo goes here.</p>
      </section>

      <section id="hours" className="home-section">
        <h2>Hours</h2>
        <ul>
          {/* .map turns each item in the list into a <li> */}
          {HOURS.map((h) => (
            <li key={h.days}>
              {h.days}: {h.time}
            </li>
          ))}
        </ul>
      </section>

      <section id="tickets" className="home-section">
        <h2>Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((t) => (
              <tr key={t.type}>
                <td>{t.type}</td>
                {/* toFixed(2) = always 2 decimals, like 19.90 */}
                <td>${t.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="animals" className="home-section">
        <h2>Meet Our Animals</h2>
        {animals.length === 0 ? (
          <p>No animals to show right now.</p>
        ) : (
          <div className="animal-grid">
            {animals.map((a) => (
              <div key={a.AnimalID} className="animal-card">
                <strong>{a.AnimalName}</strong>
                <span>{a.Species}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="home-footer">
        <p>© 2026 Zoo Name</p>
      </footer>
    </div>
  )
}

export default Home
