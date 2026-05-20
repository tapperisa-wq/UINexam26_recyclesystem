//Komponent for selve produkt

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

{/*Lage et objekt som oversetter status‑koder (status egenskap i Sanity ) fra databasen til norske ord*/}
{/*etterpå kan jeg bruke de norske orde til å vise dem i nettside*/}
const statusLabels = {
  active: 'Aktiv',
  reserved: 'Reservert',
  sold: 'Solgt',
  archived: 'Arkivert'
}

export default function Product() {

  {/*Hente ID fra URL*/}
  const { id } = useParams()

  {/*Lage state‑variabel som skal holde på produktet*/}
  const [product, setProduct] = useState(null)

  {/*Hente produktet fra Sanity*/}
  {/*useEffekt kjører på nytt hvis ID i URL endrer seg*/}
  useEffect(() => {
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
      //Henter dokumenter av typen product, [0] betyr -> ta første treff


      const result = await client.fetch(query, { id })

      {/*Oppdaterer produktet med nye objektet*/}
      setProduct(result) 
    }
    
    {/*Kjøre funksjon*/}
    fetchProduct()
  }, [id])

  {/*Hvis produktet ikke er hentet -> vis en enkel "loading"-tekst.*/}
  if (!product) return <p>Laster produkt...</p>

  return (
    //Vis produkt
    <div className="product">
      <h1>{product.title}</h1>

      <img
        //Hvis produktet har bilde → bruk det       //Hvis ikke → bruk en placeholder med produktnavnet
        src={product.imageUrl || `https://placehold.co/400x400?text=${encodeURIComponent(product.title)}`}        
        alt={product.title}
        style={{ maxWidth: 400 }}
      />

      {/*Beskrivelse*/}
      <p>{product.description}</p>

      {/*Produktinfo*/}
      <ul>
        
        {/*Oversetter status fra Sanity kode element til tekst*/}
        <li>Status: {statusLabels[product.status] ?? product.status}</li>
        {/*Hvis status finnes -> prøv å oversette statusen og vis den
        Hvis status ikke finnes i listen også hvis vi har ikke oversettelse → vis original verdi*/}

        <li>
          {/*Vis kategori bare når den kategori har underkategori*/}
          Kategori: {product.subcategory?.category} / {product.subcategory?.title}
        </li>

        <li>
          {/*Type av produkt*/}
          Type: {product.listingType === 'sale' ? 'Til salgs' : 'Til bytte'}
          {/*Hvis product har listingType = "sale" -> vis tekst "Til salgs"*/}
          {/*Hvis listingType er noe annet enn sale -> vis tekst "Til bytte"*/}
        </li>
        {/*Hvis product er til salgs → vis pris*/}
        {product.listingType === 'sale' && <li>Pris: {product.price} kr</li>}

        {/*Hvis til product er til bytte → vis bytteønske*/}
        {product.listingType === 'trade' && <li>Ønskes byttet mot: {product.tradeWish}</li>}
      </ul>

      <section className="owner-card">
        {/*Eier-seksjon*/}
        <h2>Eier</h2>
        <p>
          {/*Lage klikkbart navn og etternavn til eier -> etter trykket på, bytter side til selve side for eier*/}
          <Link to={`/profile/${product.owner._id}`}>
            {product.owner.firstName} {product.owner.lastName} 
            {/*Navn til eier i produkt side*/}
          </Link>
        </p>
        {/*Under navn viser vi email og byen til eier*/}
        <p>{product.owner.email}</p>
        <p>{product.owner.city}</p>
      </section>
    </div>
  )
}
