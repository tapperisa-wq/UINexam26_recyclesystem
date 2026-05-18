// Search.jsx
// Søkefelt i headeren som sender brukeren til /search?q=... ved innsending.
// Selve søkeresultatene håndteres av SearchResults.jsx.

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Search() {
  // useNavigate lar oss navigere til en annen URL programmatisk
  const navigate = useNavigate()

   // useSearchParams leser URL-parametere – brukes til å fylle søkefeltet
  // hvis brukeren allerede er på søkesiden (for å beholde søketermen synlig)
  const [searchParams] = useSearchParams()

  // Initialiserer søketeksten fra URL-parameteret ?q=... hvis det finnes
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSubmit = (event) => {
    // Hindrer standard skjema-innsending (som ville lastet siden på nytt)
    event.preventDefault()
    if (query.trim()) {
      // Navigerer til søkesiden med søketermen kodet i URL-en
      // encodeURIComponent sørger for at spesialtegn (mellomrom, æøå osv.) håndteres riktig
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søk etter produkter..."
      />
      <button type="submit">Søk</button>
    </form>
  )
}
