// Product.jsx
// Viser detaljert informasjon om ett enkelt produkt.
// URL: /product/:id


import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

// Oversettelse fra engelske statusverdier (slik de er lagret i Sanity) til norsk visning
const statusLabels = {
  active: 'Aktiv',
  reserved: 'Reservert',
  sold: 'Solgt',
  archived: 'Arkivert'
}

export default function Product() {
  // useParams henter :id fra URL-en, f.eks. /product/abc123 → id = "abc123"
  const { id } = useParams()

  // State for produktdataene – null betyr "ikke lastet ennå"
  const [product, setProduct] = useState(null)

  useEffect(() => {
    // GROQ-spørring som henter ett produkt med tilhørende data via joins (->)

     // Henter URL til bildet via en join til Sanity sin asset-referanse
        //"imageUrl": image.asset->url,

     // Henter underkategori og dens tilhørende hovedkategori via dobbel join
        //"subcategory": subcategory->{
          //title,
          //"category": category->title

    // Henter eierens data via join – bare det vi trenger å vise
        //"owner": owner->{
          //_id, firstName, lastName, email, city

    const fetchProduct = async () => {
      const query = `*[_type == "product" && _id == $id][0]{
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
        status,
        listingType,
        price,
        tradeWish,
        "subcategory": subcategory->{
          title,
          "category": category->title
        },
        "owner": owner->{
          _id, firstName, lastName, email, city
        }
      }`

      // $id er en parameter som sendes inn trygt (forhindrer injection)
      const result = await client.fetch(query, { id })
      setProduct(result)
    }
    fetchProduct()
  }, [id]) // Kjøres på nytt hvis id i URL-en endres


  // Viser lastemelding mens data hentes
  if (!product) return <p>Laster produkt...</p>

  return (
    <div className="product">
      <h1>{product.title}</h1>

      {/*
        Viser produktbilde hvis det finnes, ellers et placeholder-bilde
        fra placehold.co med produkttittelen som tekst.
      */}
      <img
        src={product.imageUrl || `https://placehold.co/400x400?text=${encodeURIComponent(product.title)}`}
        alt={product.title}
        style={{ maxWidth: 400 }}
      />

      <p>{product.description}</p>

      <ul>
        {/* Bruker statusLabels-objektet til å vise norsk tekst, med fallback til råverdien */}
        <li>Status: {statusLabels[product.status] ?? product.status}</li>

        {/* Viser kategori / underkategori */}
        <li>
          Kategori: {product.subcategory?.category} / {product.subcategory?.title}
        </li>
        <li>
          Type: {product.listingType === 'sale' ? 'Til salgs' : 'Til bytte'}
        </li>

        {/* Viser pris kun for salgsprodukter */}
        {product.listingType === 'sale' && <li>Pris: {product.price} kr</li>}

        {/* Viser byttekrav kun for bytteprodukter */}
        {product.listingType === 'trade' && <li>Ønskes byttet mot: {product.tradeWish}</li>}
      </ul>

        {/* Kort om eieren med lenke til profilen */}
      <section className="owner-card">
        <h2>Eier</h2>
        <p>
          <Link to={`/profile/${product.owner._id}`}>
            {product.owner.firstName} {product.owner.lastName}
          </Link>
        </p>
        <p>{product.owner.email}</p>
        <p>{product.owner.city}</p>
      </section>
    </div>
  )
}
