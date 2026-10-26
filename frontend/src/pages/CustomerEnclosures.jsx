import { useEffect, useState } from 'react'

// read-only: enclosures + which animals live in each (guest plaque view)
function CustomerEnclosures() {
  const [enclosures, setEnclosures] = useState([])
  const [animals, setAnimals] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [encRes, aniRes] = await Promise.all([
          fetch('/api/enclosures'),
          fetch('/api/animals'),
        ])
        const encData = await encRes.json()
        const aniData = await aniRes.json()

        if (!encRes.ok) {
          setError(encData.error || 'Could not load enclosures')
          return
        }
        if (!aniRes.ok) {
          setError(aniData.error || 'Could not load animals')
          return
        }

        setEnclosures(encData)
        setAnimals(aniData)
      } catch (err) {
        setError('Could not connect to the server')
      }
    }
    load()
  }, [])

  function animalsInEnclosure(enclosureName) {
    return animals.filter((a) => a.Enclosure === enclosureName)
  }

  return (
    <div>
      <h1>Enclosures</h1>

      {error ? <p className="error">{error}</p> : null}

      {!error && enclosures.length === 0 ? (
        <p>No enclosures to show.</p>
      ) : null}

      {enclosures.map((enc) => {
        const residents = animalsInEnclosure(enc.Name)
        return (
          <section key={enc.EnclosureID} className="guest-section">
            <h2>{enc.Name}</h2>
            <p>
              {enc.HabitatType} · {enc.Location} · Status: {enc.Status}
            </p>

            {residents.length === 0 ? (
              <p>No animals listed here right now.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Sex</th>
                    <th>Born</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((a) => (
                    <tr key={a.AnimalID}>
                      <td>{a.AnimalName}</td>
                      <td>{a.Species}</td>
                      <td>{a.Sex}</td>
                      <td>
                        {a.DateOfBirth
                          ? String(a.DateOfBirth).slice(0, 10)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )
      })}
    </div>
  )
}

export default CustomerEnclosures
