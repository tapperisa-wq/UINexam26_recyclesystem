// List.jsx
// Viser innholdet i en brukers kuraterte produktliste.
// URL: /list/:id

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function List() {
  // Henter liste-id fra URL-en
  const { id } = useParams()

  // State for listefataene – null betyr "ikke lastet ennå"
  const [list, setList] = useState(null)

  useEffect(() => {

      // GROQ-spørring som henter listen med eierinfo og alle produkter
      // products[]-> betyr "hent alle referanser i products-arrayet som fulle dokumenter"
      
    const fetchList = async () => {
      const query = `*[_type == "userList" && _id == $id][0]{
        _id,
        title,
        isPublic,

        // Henter eierens navn og id via join
        "owner": owner->{ _id, firstName, lastName },

        // Derefererer hvert produkt i listen – [] betyr "for hvert element i arrayet"
        "products": products[]->{
          _id, title, status, listingType, price, tradeWish
        }
      }`

      const result = await client.fetch(query, { id })
      setList(result)
    }
    fetchList()
  }, [id])

   // Viser lastemelding mens data hentes
  if (!list) return <p>Laster liste...</p>

  return (
    <div className="list">
      <h1>{list.title}</h1>

      {/* Lenke til eierens profil */}
      <p>
        Eier:{' '}
        <Link to={`/profile/${list.owner._id}`}>
          {list.owner.firstName} {list.owner.lastName}
        </Link>
      </p>

      {/*
        ⚠️ SVAKHET: isPublic vises som tekst, men det er ingen tilgangskontroll.
        Alle som har URL-en kan se private lister.
        Burde sjekket: if (!list.isPublic && !isOwnList) return <p>Ingen tilgang</p>
      */}
      <p>{list.isPublic ? 'Offentlig liste' : 'Privat liste'}</p>

      <h2>Produkter ({list.products?.length ?? 0})</h2>

      {/* ?. (optional chaining) unngår krasj hvis products er undefined */}
      {!list.products || list.products.length === 0 ? (
        <p>Ingen produkter i listen.</p>
      ) : (
        <ul>
          {list.products.map(product => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>{product.title}</Link>
              {' — '}
              {product.listingType === 'sale'
                ? `${product.price} kr`
                : `Bytte: ${product.tradeWish}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
