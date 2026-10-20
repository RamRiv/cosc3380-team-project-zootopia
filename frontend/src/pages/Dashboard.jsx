
import { useEffect, useState } from 'react'

function Dashboard() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAnimals() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/animals')

      if (!response.ok) {
        throw new Error('Could not retrieve animal records.')
      }

      const data = await response.json()
      setAnimals(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnimals()
  }, [])

  return (
    <main className="dashboard">
      <h2>Zoo Dashboard</h2>
      <p>View animal records stored in the zoo database.</p>

      <section className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>Animal Records</h3>
          <button onClick={loadAnimals} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading && <p>Loading animal records...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <p>Total animals returned: {animals.length}</p>
        )}

        {!loading && !error && animals.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {Object.keys(animals[0]).map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {animals.map((animal, index) => (
                  <tr key={animal.animalId ?? index}>
                    {Object.keys(animals[0]).map((column) => (
                      <td key={column}>
                        {animal[column] == null
                          ? '—'
                          : String(animal[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && animals.length === 0 && (
          <p>No animal records were found.</p>
        )}
      </section>
    </main>
  )
}

export default Dashboard
