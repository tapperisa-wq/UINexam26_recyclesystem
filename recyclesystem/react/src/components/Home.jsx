import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

{/*Sanity-klienten som brukes til å hente data fra Sanity. */}
import client from '../helpers/sanityClient'

export default function Home() {

  {/*forSale → liste med produkter som er til salgs*/}
  const [forSale, setForSale] = useState([]) 
  //Lagre resultatet i state, Nå oppdateres React-state -> Komponent rendrer på nytt med data
  
  {/*forTrade → liste med produkter som er til bytte*/}
  const [forTrade, setForTrade] = useState([]) 
  //Lagre resultatet i state

  {/*useEffect – henter data fra Sanity, kjøres en gang når komponent rendres*/}
  useEffect(() => {

    //hente produkter fra Sanity
    const fetchProducts = async () => {

      {/*Sanity-spørring*/}
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
      // Nyeste produkter for salg: Hent dokumenter av typen product status == "active" og listingType == "sale" -> henter id, titel og pris
      // Nyeste produkter til bytte: Hent document av typen product status == "active" og listingType == "trade" -> hente id, titel og bytteønske informasjon 

      // order(_createdAt desc)[0...5] er GROQ-syntaks fra GROQ‑dokumentasjon som sier sorter produktene etter nyeste

      {/*Hent data fra Sanity*/}
      const result = await client.fetch(query)

      //Lagre resultatet i state
      setForSale(result.forSale)
      setForTrade(result.forTrade)
    }

    //Kjør funksjonen
    fetchProducts()
  }, [])

  return (
    //MAIN
    <div>
      <section>
        {/*Produkter til salgs*/}
        <h2>Nyeste produkter til salgs</h2>

        {/*Hvis forSale er tom → vis tekst: "Ingen produkter til salgs." */}
        {forSale.length === 0 ? (
          <p>Ingen produkter til salgs.</p>
        ) 
        //Eller: Hvis forSale har produkter → vis liste
        : (
          <ul>

          {/*Gå gjennom hvert produkt i products‑arrayet og lag én <li> for hver.*/}
            {forSale.map(product => (

              <li key={product._id}>
                {/*lage unik key fra _id i Sanity */}

                {/*Lage klikkbart tekst av produkt titel som kilde til den produkt side */}
                <Link to={`/product/${product._id}`}>{product.title}</Link>

                {/*Vise strek med pris*/}
                {' — '}{product.price} kr
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        {/*Produkter til bytte*/}
        <h2>Nyeste produkter til bytte</h2>

        {/*Hvis "forTrade" er tomt  → vis tekst: "Ingen produkter til salgs."*/}
        {forTrade.length === 0 ? (
          <p>Ingen produkter til bytte.</p>
        ) 
        
        //Eller: Hvis forTrade har produkter  → vis liste
        : (
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
