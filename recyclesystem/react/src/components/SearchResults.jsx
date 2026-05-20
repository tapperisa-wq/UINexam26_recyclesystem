//SearchResults.jsx leser søkeordet,henter produkter og viser resultatene
//Dette er selve søkesiden

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function SearchResults() {

  {/*Hent søkeord fra URL */}
  const [searchParams] = useSearchParams()
  
  {/*searchParams.get('q') → henter verdien etter ?q=. */}
  const q = searchParams.get('q') || ''  //Hvis q ikke finnes → bruk tom streng som søkeresultat
  
  const [results, setResults] = useState([]) //results → listen med produkter som matcher søket.

  const [loading, setLoading] = useState(false) //loading → viser "Søker..." mens vi henter data.


  {/*useEffekt kjøres hver gang q endrer seg -> kjør søk når q endrer seg */}
  useEffect(() => {

    {/*Hvis q er tomt → tøm resultater og stopp funskjon*/}
    if (!q) {
      setResults([])
      return
    }

    {/*Henter produkter fra Sanity */}
    const fetchResults = async () => {
      {/*Mens vi henter data -> vis "Søker..." definert i return delen */}
      setLoading(true) 

      {/*Sanity‑query */}
      const query = `*[_type == "product" && (
        title match $term || description match $term
      )]{

        _id, title, description, listingType, price, tradeWish, status

      } | order(title asc)`
      //Hent alle dokumenter av typen product
      //Der title eller description (beskrivelse) matcher søkeordet
      //Returner disse feltene:_id, title, description, listingType (sale/trade), price, tradeWish, status
      //Sorter alfabetisk etter tittel

      {/*Sender søkeordet til Sanity */}
      const data = await client.fetch(query, { term: `*${q}*` }) //Sanity finner alt som inneholder søkeordet.

      {/*Lagre resultatene */}
      setResults(data) //Resultatene lagres i state

      setLoading(false) //loading = false → slutt å vise "Søker..."
    }
    fetchResults()
  }, [q])

  return (
    <div>
      {/*Viser overskrift med søkeordet. */}
      <h1>Søkeresultater for "{q}"</h1>
      {loading ?( //Hvis loading = true vis tekst "Søker.."
        <p>Søker...</p>
      ) 
      
      //Eller: Hvis ingen resultater: vis "Ingen produkter funnet"
      : results.length === 0 ? (
        <p>Ingen produkter funnet.</p>
      ) 
      
      //Eller: Hvis vi fant produkter
      : (
        <ul>
          {results.map(product => (
            <li key={product._id}>
              {/*Lager en lenke til produktsiden */}
              <Link to={`/product/${product._id}`}>{product.title}</Link> 

              {' — '}

              {/*Vis pris*/}
              {product.listingType === 'sale'
                ? `${product.price} kr`

                //eller bytte‑ønske 
                : `Bytte: ${product.tradeWish}`}
              {' — '}

              {/*Vis status (active, sold, etc.) */}
              {product.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
