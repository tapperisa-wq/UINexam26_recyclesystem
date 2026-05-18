// Users.jsx
// Viser en liste over alle registrerte brukere, sortert alfabetisk på fornavn.
// URL: /users

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function Users() {
  // State for brukerlisten
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      // Henter alle brukere, sortert alfabetisk på fornavn
      // Henter kun feltene vi trenger for å vise listen (ikke passord, adresse osv.)

      const query = `*[_type == "user"] | order(firstName asc){
        _id, firstName, lastName, city
      }`
      const result = await client.fetch(query)
      setUsers(result)
    }
    fetchUsers()
  }, [])// Kjøres én gang ved montering

  return (
    <div>
      <h1>Brukere</h1>
      {users.length === 0 ? (
        <p>Ingen brukere.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {/* Lenke til brukerens profilside */}
              <Link to={`/profile/${user._id}`}>
                {user.firstName} {user.lastName}
              </Link>
              {/* Viser by hvis den finnes – ?. og && unngår feil hvis city er undefined */}
              {user.city && ` — ${user.city}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
