
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
    </main>
  )
}

export default Dashboard
