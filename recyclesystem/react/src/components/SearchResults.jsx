// SearchResults.jsx
// Viser søkeresultater basert på søketermen i URL-en (?q=...).
// URL: /search?q=søketerm
// **

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function SearchResults() {
   // Leser søketermen fra URL-parameteret ?q=...
  const [searchParams] = useSearchParams()
  //     ↑ lese params    
  // useSearchParams() lar deg lese og endre det som kommer etter ? i URL-en.
    // useSearchParams – leser det som kommer etter ?
  const q = searchParams.get('q') || ''
    // || '' er en fallback — "hvis verdien ?q... er null i URL-en den returnerer, bruk en tom string i stedet ("eller")
    //Dette forhindrer at q er null, noe som kunne krasjet koden lenger ned der q brukes.

  // State for søkeresultatene og lastestatus
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Hvis søketermen er tom, tøm resultatene og avslutt
    if (!q) {
      setResults([])
      return
    }
    //stopper hvis den er tom, hvis ikke fortsetter:
    
    const fetchResults = async () => {
      setLoading(true)
    
       // GROQ-spørring som søker i tittel OG beskrivelse
      // $term er en parameter som sendes inn – dette er trygt mot injection
      // match-operatoren bruker wildcard (*) for delvis treff

      const query = `*[_type == "product" && (
        title match $term || description match $term
      )]{
        _id, title, description, listingType, price, tradeWish, status
      } | order(title asc)`

    // *${q}* betyr "inneholder q" (wildcard på begge sider)
      const data = await client.fetch(query, { term: `*${q}*` })
      setResults(data)
      setLoading(false)
    }
    fetchResults()
  }, [q]) // Kjøres på nytt hver gang søketermen i URL-en endres

  return (
    <div>
      <h1>Søkeresultater for "{q}"</h1>
      {loading ? (
        <p>Søker...</p>
      ) : results.length === 0 ? (
        <p>Ingen produkter funnet.</p>
      ) : (
        <ul>
          {results.map(product => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>{product.title}</Link>
              {' — '}
              {/* Viser pris for salg, byttekrav for bytte */}
              {product.listingType === 'sale'
                ? `${product.price} kr`
                : `Bytte: ${product.tradeWish}`}
              {' — '}
              {product.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
