import { useEffect, useState } from 'react'

// upcoming talks and shows (read only)
function CustomerAttractions() {
  const [attractions, setAttractions] = useState([])
  const [enclosures, setEnclosures] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [attRes, encRes] = await Promise.all([
          fetch('/api/attractions'),
          fetch('/api/enclosures'),
        ])
        const attData = await attRes.json()
        const encData = await encRes.json()

        if (!attRes.ok) {
          setError(attData.error || 'Could not load attractions')
          return
        }
        if (!encRes.ok) {
          setError(encData.error || 'Could not load enclosures')
          return
        }

        setAttractions(attData)
        setEnclosures(encData)
      } catch (err) {
        setError('Could not connect to the server')
      }
    }
    load()
  }, [])

  function enclosureName(enclosureId) {
    const enc = enclosures.find((e) => e.EnclosureID === enclosureId)
    return enc ? enc.Name : '—'
  }

  return (
    <div>
      <h1>Attractions</h1>

      {error ? <p className="error">{error}</p> : null}

      {!error && attractions.length === 0 ? (
        <p>No attractions scheduled.</p>
      ) : null}

      {attractions.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>When</th>
              <th>Enclosure</th>
            </tr>
          </thead>
          <tbody>
            {attractions.map((a) => (
              <tr key={a.AttractionID}>
                <td>{a.Name}</td>
                <td>{a.Type}</td>
                <td>{String(a.Schedule).replace('T', ' ').slice(0, 16)}</td>
                <td>{enclosureName(a.EnclosureID)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default CustomerAttractions
