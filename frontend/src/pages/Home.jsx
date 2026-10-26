import { Link } from 'react-router'
import './Home.css'

// public front page, anyone can see this (no login)
// info is hardcoded for now, prices could come from the db later

const HOURS = [
  { days: 'Monday - Friday', time: '9am - 5pm' },
  { days: 'Saturday - Sunday', time: '9am - 6pm' },
]

import { TICKETS } from '../zooInfo.js'

//Hardcoded animal data for now, will come from the db later
const ANIMALS = [
  { name: 'Simba', species: 'African Lion' },
  { name: 'Ellie', species: 'African Elephant' },
  { name: 'Flip', species: 'Bottlenose Dolphin' },
  { name: 'Mei', species: 'Giant Panda' },
]

function Home() {
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
        <div className="animal-grid">
          {ANIMALS.map((a) => (
            <div key={a.name} className="animal-card">
              <strong>{a.name}</strong>
              <span>{a.species}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 Zoo Name</p>
      </footer>
    </div>
  )
}

export default Home