import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

{/*Sanity-klienten som brukes til å hente data fra Sanity. */}
import client from '../helpers/sanityClient' 

import './Profile.css'

export default function Profile({ loggedInUser }) {
{/*mottar loggedInUser som prop (fra App.jsx til Layout.jsx og deretter til Profile.jsx)*/}

  {/*Hente id fra url, dvs. Hvis URL er /profile/1234, blir id = "1234". */}
  const { id } = useParams() 
  {/*Vi gjør dette fordi URL‑en forteller oss hvilken profil vi skal vise. */}

  const isOwnProfile = loggedInUser && loggedInUser._id === id
  {/*Hvis en bruker er logget inn og brukerens _id matcher URL‑id → dette er riktig profil. */}

  {/*user → info om profilen vi besøker.*/}
  const [user, setUser] = useState(null)

  {/*lists → brukerens lister, dvs. elementer far Brukerliste fra Sanity */}
  const [lists, setLists] = useState([])

  {/*products → brukerens aktive produkter, dvs. elementer fra Produkt fra Sanity*/}
  const [products, setProducts] = useState([])

  {/*hente data når id endrer seg */}
  useEffect(() => {
    const fetchProfile = async () => {

      {/*Sanity-spørring*/}
      const query = `{
        "user": *[_type == "user" && _id == $id][0]{
          _id, firstName, lastName, email, streetAddress, postalCode, city
        },
        "lists": *[_type == "userList" && owner._ref == $id]{
          _id, title, isPublic, "productCount": count(products)
        },
        "products": *[_type == "product" && owner._ref == $id && status == "active"]{
          _id, title, listingType, price, tradeWish
        }
      }`
      //Henter brukeren med riktig _id.
      //Henter alle lister som brukeren eier.
      //Henter alle aktive produkter som brukeren eier.


      {/*Kjør spørringen*/}
      const result = await client.fetch(query, { id }) 
                    {/*bruker Sanity-klienten til å hente data fra databasen*/}
                    {/*query er hele GROQ-spørringen definert oppe*/}
                    {/*_id == $id] dvs. id kommer fra URL, så hvis URL er /profile/Ole så id blir id fra Ole*/}
      
      {/*Lagre resultatene i state*/}
      {/*Sanity returnerer ett objekt med tre nøkler: */}
      setUser(result.user)
      setLists(result.lists)
      setProducts(result.products)
    }

    {/*Kjør funksjonen*/}
    fetchProfile()
  }, [id])

  {/*Vis loading hvis bruker ikke er lastet*/}
  if (!user) return <p>Laster brukerprofil...</p>


  {/*RENDERING AV PROFILEN*/}
  return (
    //Sende til main
    <div className="profile">
      {/*Vis navn*/}
      <h1>{user.firstName} {user.lastName}</h1>

      {/*isOwnProfile sjekker om brukeren som er logget inn har samme ID som profilen som vises.*/}
      {/*Hvis ja → true (din egen profil tekst og knappen som gir mulighet for å legge til produkt).*/}
      {isOwnProfile && (
        <>
          <p><strong>Dette er din profil</strong></p>
          <p><Link to="/products/new" className="button-link">+ Legg ut nytt produkt</Link></p>
        </>
      )}

      {/*Hvis brukeren har ikke samme id som profilen da viser vi bare email og adress*/}
      <p>{user.email}</p>
      <p>{user.streetAddress}, {user.postalCode} {user.city}</p>

      <section>
        {/*Overskrift med antall aktive produkter som er koblet til person*/}
        <h2>Aktive produkter ({products.length})</h2>

        {/*Hvis det ikke finnes produkter → vis “Ingen aktive produkter.”*/}
        {products.length === 0 ? ( <p>Ingen aktive produkter.</p> ) 

        //Eller: Hvis det finnes produkter → vis en liste med dem
        : 
        (
          <ul>
            {/*Gå gjennom hvert produkt i products‑arrayet og lag én <li> for hver.*/}
            {products.map(product => (

              <li key={product._id}>
                {/*React krever en unik key for hver liste‑rad.*/}

                {/*Lager en klikkbar lenke til produkt side: */}
                <Link to={`/product/${product._id}`}>{product.title}</Link>
                {/*Hvis _id = "4Th..." URL blir: /product/4Th... , og titel er navne til produkt som tilpasser _id*/}

                {/*Lag strek mellom produkt navn og pris */}
                {' — '} 

                {/*Vise pris eller bytte informasjon*/}

                {/*Hvis produktet er til salgs*/}
                {product.listingType === 'sale'
                    
                    //vis prisen
                  ? `${product.price} kr`

                  //Hvis produktet er til bytte vis bytteønsket
                  : `Bytte: ${product.tradeWish}`}
                  {/*tradeWish er egenskap fra Sanity, der er beskrevet bytte ønske for hvert produkt*/}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/*Vise lister (kun hvis egen profil også i "Min Profil") */}
      {isOwnProfile && //Hvis du besøker din egen profil → isOwnProfile = true → innholdet (lister) vises.
                        //Hvis du besøker noen andres profil → isOwnProfile = false → innholdet (lister) skjules.
      (
      <section>
        {/*Viser overskriften: “Lister” med antall lister brukeren har */}
        <h2>Lister ({lists.length})</h2>

        {/*Hvis brukeren ikke har noen lister → vis “Ingen lister.*/}
        {lists.length === 0 ? (
          <p>Ingen lister.</p>
        ) 
        
        //Eller: Hvis brukeren har lister → vis en <ul> med alle listene
        : (
          <ul>

            {lists.map(list => (
              //Gå gjennom hver liste i lists‑arrayet og lag én <li> for hver.

              <li key={list._id}>
                {/*Bruke _id fra Sanity som unik key*/}

                {/*Lager en klikkbar lenke til hvert element*/}
                <Link to={`/list/${list._id}`}>{list.title}</Link>
                
                {/*lage en strek mellom element navn og antall til element*/}
                {' — '}

                {/*Vise antall produkter i lista som er definert i Sanity: brukerliste kategori -> selve liste element -> produkter felte*/}
                {list.productCount} produkter

                {/*Vise om lista er offentlig eller privat*/}
                {list.isPublic ? ' (offentlig)' : ' (privat)'}
                {/*Hvis isPublic === true → vis (offentlig)
                  Hvis isPublic === false → vis (privat)*/}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}
    </div>
  )
}
