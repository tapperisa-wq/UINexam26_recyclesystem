//Komponent for selve list element

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../helpers/sanityClient'

export default function List() {

  {/*Hent ID fra URL */}
  const { id } = useParams()
  const [list, setList] = useState(null)

  {/*Hent listen fra Sanity hver gang på nytt når hvis URL-ID endres*/}
  useEffect(() => {

    {/*Henter data fra Sanity. */}
    const fetchList = async () => {

      {/*Hente én liste*/}
      const query = `*[_type == "userList" && _id == $id][0]{
        _id,
        title,
        isPublic,
        "owner": owner->{ _id, firstName, lastName },
        "products": products[]->{
          _id, title, status, listingType, price, tradeWish
        }
      }`
      //hente lister informasjon bare for person med: det samme id som står i Velkomen profilen
      //dvs. lister fines bare for person som er logget inn

      const result = await client.fetch(query, { id })
      setList(result)
    }
    fetchList()
  }, [id])

  {/*Hvis listen ikke er lastet ennå vis tekst*/}
  if (!list) return <p>Laster liste...</p>

  return (
    <div className="list">
      <h1>{list.title}</h1>
      <p>
        Eier:{' '} 
        {/*mellom rom mellom eier og navn til eier */}

        {/*Lage klikkbart navn og etternavn til eier -> etter trykket på, bytter side til selve side for eier*/}
        <Link to={`/profile/${list.owner._id}`}>
          {list.owner.firstName} {list.owner.lastName}
        </Link>
      </p>

      {/*Hvis liste er offentlig (list = isPublic) -> vis tekst "Offentlig liste
      Hvis noe annet -> vis tekst "Privat liste""*/}
      <p>{list.isPublic ? 'Offentlig liste' : 'Privat liste'}</p>

      {/*Produkt titel med antall produker som tilhører person*/}
      <h2>Produkter ({list.products?.length ?? 0})</h2>
      {/*Hvis listen har produkter → vis antallet*/}
      {/*Hvis listen ikke har produkter → vis 0 */}


    {/*Hvis listen ikke har produkter -> vis teksten*/}
      {!list.products || list.products.length === 0 ? (
        //hvis finnes ikke products og lengde på products er 0 vis tekst

        <p>Ingen produkter i listen.</p>
      ) 

      //Eller hvis produkt finnes så gå gjennom hvert element og hent informasjon
      : (
        <ul>
          {list.products.map(product => (
            <li key={product._id}>
              {/*hente _id fra URL for å definere unik key*/}

              {/*Klikkbart titel av produkter som lenke  */}
              <Link to={`/product/${product._id}`}>{product.title}</Link>
              {' — '}

              {/*hvis produkt er til å selge vis pris */}
              {product.listingType === 'sale'
                ? `${product.price} kr`

                //hvis produkt er til å bytte hvis bytteønske
                : `Bytte: ${product.tradeWish}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
