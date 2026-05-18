// Profile.jsx
// Viser profilen til en bruker – enten din egen eller en annen bruker sin.
// URL: /profile/:id

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './Profile.css'

// loggedInUser sendes fra App.jsx via Route-proppen
export default function Profile({ loggedInUser }) {

// Henter :id fra URL-en – dette er profilen vi skal vise
  const { id } = useParams()

  // Sjekker om den innloggede brukeren ser på sin egen profil
  // Brukes til å vise/skjule sensitive felter og egne handlinger
  const isOwnProfile = loggedInUser && loggedInUser._id === id

  // State for brukerdata, lister og produkter
  const [user, setUser] = useState(null)
  const [lists, setLists] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {

      // En GROQ-spørring som henter tre datasett på én gang
      const query = `{

      // Henter brukerens grunninfo
        "user": *[_type == "user" && _id == $id][0]{
          _id, firstName, lastName, email, streetAddress, postalCode, city
        },

         // Henter alle lister som tilhører denne brukeren
        // productCount beregner antall produkter i listen uten å hente selve produktene
        "lists": *[_type == "userList" && owner._ref == $id]{
          _id, title, isPublic, "productCount": count(products)
        },

        // Henter kun aktive produkter eid av denne brukeren
        "products": *[_type == "product" && owner._ref == $id && status == "active"]{
          _id, title, listingType, price, tradeWish
        }
      }`
      const result = await client.fetch(query, { id })
      setUser(result.user)
      setLists(result.lists)
      setProducts(result.products)
    }
    fetchProfile()
  }, [id]) // Kjøres på nytt hvis en annen profil åpnes

   // Viser lastemelding mens data hentes fra Sanity
  if (!user) return <p>Laster brukerprofil...</p>

  return (
    <div className="profile">
      <h1>{user.firstName} {user.lastName}</h1>

      {/* Ekstra handlinger som bare vises på din egen profil */}
      {isOwnProfile && (
        <>
          <p><strong>Dette er din profil</strong></p>
          {/* Lenke-knapp til å legge ut nytt produkt */}
          <p><Link to="/products/new" className="button-link">+ Legg ut nytt produkt</Link></p>
        </>
      )}

      {/*
        ⚠️ SVAKHET: E-post og adresse vises for alle besøkende, ikke bare eieren selv.
        Burde vært pakket inn i: {isOwnProfile && (...)}
      */}
      <p>{user.email}</p>
      <p>{user.streetAddress}, {user.postalCode} {user.city}</p>

      {/* Seksjon for aktive produkter */}
      <section>
        <h2>Aktive produkter ({products.length})</h2>
        {products.length === 0 ? (
          <p>Ingen aktive produkter.</p>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.title}</Link>
                {' — '}
                {/* Viser pris for salg, byttekrav for bytte */}
                {product.listingType === 'sale'
                  ? `${product.price} kr`
                  : `Bytte: ${product.tradeWish}`}
              </li>
            ))}
          </ul>
        )}
      </section>

        {/* Lister vises kun på din egen profil */}
      {isOwnProfile && (
      <section>
        <h2>Lister ({lists.length})</h2>
        {lists.length === 0 ? (
          <p>Ingen lister.</p>
        ) : (
          <ul>
            {lists.map(list => (
              <li key={list._id}>
                <Link to={`/list/${list._id}`}>{list.title}</Link>
                {' — '}
                {list.productCount} produkter
                {/* Viser om listen er offentlig eller privat */}
                {list.isPublic ? ' (offentlig)' : ' (privat)'}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}
    </div>
  )
}
