import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../helpers/sanityClient'


// Home.jsx
// Forsiden av applikasjonen.
// Viser de 5 nyeste aktive produktene til salgs og til bytte.

export default function Home() {
  // State for produkter til salgs
  const [forSale, setForSale] = useState([])

  // State for produkter til bytte
  const [forTrade, setForTrade] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      // GROQ-spørring som henter to lister i én request (effektivt)
      const query = `{
        "forSale": *[_type == "product" && status == "active" && listingType == "sale"]
          | order(_createdAt desc)[0...5]{
            _id, title, price
          },
        "forTrade": *[_type == "product" && status == "active" && listingType == "trade"]
          | order(_createdAt desc)[0...5]{
            _id, title, tradeWish
          }
      }`
      const result = await client.fetch(query)
      setForSale(result.forSale)
      setForTrade(result.forTrade)
    }
    fetchProducts()
  }, []) // Tom array = kjøres én gang når komponenten monteres

  return (
    <div>
      {/* Seksjon for salgsprodukter */}
      <section>
        <h2>Nyeste produkter til salgs</h2>
        {forSale.length === 0 ? (
          <p>Ingen produkter til salgs.</p>
        ) : (
          <ul>
            {forSale.map(product => (
              // Hver li trenger en unik key – bruker Sanity sin _id
              <li key={product._id}>
                {/* Link til produktsiden */}
                <Link to={`/product/${product._id}`}>{product.title}</Link>
                {' — '}{product.price} kr
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Seksjon for bytteprodukter */}
      <section>
        <h2>Nyeste produkter til bytte</h2>
        {forTrade.length === 0 ? (
          <p>Ingen produkter til bytte.</p>
        ) : (
          <ul>
            {forTrade.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.title}</Link>
                {' — '}Bytte: {product.tradeWish}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
