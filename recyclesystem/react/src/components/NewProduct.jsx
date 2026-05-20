import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './NewProduct.css'

{/*Komponenten tar imot loggedInUser som betyr: 
  Hvis ingen bruker er logget inn → vis en melding
  Hvis bruker er logget inn → vis skjemaet */}
export default function NewProduct({ loggedInUser }) {

  {/*State-variabler*/}
  const navigate = useNavigate()
  {/*Når Sanity har lagret produktet sender brukeren til produktsiden */}

  {/*Underkategorier*/}
  const [subcategories, setSubcategories] = useState([])
  {/*subcategories er en liste med alle underkategorier hentet fra Sanity,   starter som tom liste*/}
  {/*setSubcategories -> Når vi henter data i useEffect, bruker vi setSubcategories(data) for å fylle den*/}



  {/*vanlige felter hvor brukeren kan skrive noe,   de er tomt fra starten*/}
  const [title, setTitle] = useState('') //titel
  const [description, setDescription] = useState('') //beskrivelse

  //underkategori lagres som ID‑en til valgt underkategori (det skjer i select-felte)
  const [subcategoryId, setSubcategoryId] = useState('') 



  {/*Type produkt (salg eller bytte)*/}
  const [listingType, setListingType] = useState('sale')  //Starter som "sale" (standardvalg)
  {/*Dette styrer hvilke felter som vises (det er bestemt i return delen): 
    Hvis sale → vis pris
    Hvis trade → vis tradeWish*/}
  
  const [price, setPrice] = useState('') //Brukes bare hvis listingType === "sale"

  const [tradeWish, setTradeWish] = useState('') //Brukes bare hvis listingType === "trade"

  {/*State for logikk (ikke skjema) */}
  const [submitting, setSubmitting] = useState(false) 
  {/* Hvis false -> Skjemaet er klart til å fylles ut*/}
  {/*Hvis true -> Skjemaet sender data 
    (alt låses slik at brukeren ikke sender flere ganger samme produkt, knappen viser “Legger ut…”) */}
  
  {/*Hvis noe mangler i skjemaet → setError("Tittel er påkrevd") - dette er definert i if-testen i handleSubmit */}
  const [error, setError] = useState(null)

  {/*Hente underkategorier fra Sanity*/}
  {/*Dette kjører én gang når siden åpnes*/}
  useEffect(() => {
    const fetchSubcategories = async () => {
      const query = `*[_type == "subcategory"] | order(title asc){
        _id, title, "category": category->title
      }`
      //Hent alle dokumenter av typen subcategory -> Henter alle underkategorier 
      //Sorterer alfabetisk etter title
      //Lagrer dem i subcategories felte og Returner: _id, title og category (hentet via referanse → category->title)

      {/*Hente data fra Sanity */}
      const data = await client.fetch(query)

      {/*Lagrer resultatet i state*/}
      setSubcategories(data)
    }

    {/*Kjøre funksjon */}
    fetchSubcategories()
  }, [])

  {/*Hvis brukeren er ikke logget inn, altså brukeren kunne ikke bli hente fra Sanity -> vis tekst */}
  if (!loggedInUser) {
    return <p>Du må være logget inn for å legge ut et produkt.</p>
  }

  {/*Funksjon som definerer hva som skal skje når brukeren trykker "Legg ut produkt" */}
  const handleSubmit = async (event) => {

    {/*Nettleseren laster siden på nytt, alt brukeren skrev inn er borte (fordi states som title, description kommer til startverdi)*/}
    event.preventDefault()

    {/*Fjern feilmeldingen som vises akkurat nå siden handleSubmit kjøres, dvs. brukeren har sendt produkt til Sanity liste*/}
    setError(null) 

    {/*Hvis noe mangler → stopp funksjonen og vis feilmelding.*/}
    if (!title.trim()) { //Sjekk tittel
      setError('Tittel er påkrevd.')
      return
    }
    if (!subcategoryId) { //Sjekk undekategori
      setError('Velg en underkategori.')
      return
    }
    if (listingType === 'sale' && !price.trim()) {  //Hvis listingType = sale → pris må fylles ut
      setError('Pris er påkrevd for salg.')         //Hvis ikke -> vis melding
      return                                        //og stopp handleSumbit (stopp sende funskjon)
    }
    if (listingType === 'trade' && !tradeWish.trim()) {
      setError('Beskriv hva du ønsker å bytte mot.')
      return
    }

    {/*Når alt ble gjort riktig -> Nå sender vi inn skjemaet — lås alt! 
      -> (da feltet blir grått og kan ikke brukes)
      knappen viser "Legger ut" (bestemt i return button)
      brukeren kan ikke sende skjemaet flere ganger*/}
    setSubmitting(true)


    try {
      //sender informasjon til Sanity
      const newProduct = await client.create({
        _type: 'product',
        title: title.trim(), //med trim() Fjern vi alle mellomrom før og etter teksten
        description: description.trim(),
        status: 'active',
        listingType,
        owner: { _type: 'reference', _ref: loggedInUser._id },
        subcategory: { _type: 'reference', _ref: subcategoryId },
        ...(listingType === 'sale' ? { price: price.trim() } : {}), //Hvis listingType = "sale" → legg til price i objektet
        ...(listingType === 'trade' ? { tradeWish: tradeWish.trim() } //Hvis listingType = "trade" → legg til tradeWish
        //De "..." betyr -> Legg inn innholdet i dette objektet inn i det andre objektet -> her betyr det "Send de objekter til Sanity"

        : {}) //Hvis ikke → legg til ingenting
      })

      {/*Når Sanity har lagret produktet:*/}
      {/*Sanity returnerer det nye dokumentet -> Det inneholder _id -> Sender brukeren til produktsiden: med /product/ID i URL*/}
      navigate(`/product/${newProduct._id}`)

      {/*Hvis noe gikk glat... */}
    } catch (err) { //Viser feilmelding
      setError(err.message)

      {/*Åpner skjemaet igjen slik at brukeren kan prøve på nytt*/}
      setSubmitting(false)
    }
  }

  return (
    //SKJEMA
    <div>
      <h1>Legg ut nytt produkt</h1>
      {/*Når brukeren trykket på "Legg ut" knappen -> handleSubmit kjører og Skjemaet styres 100% av React*/}
      <form onSubmit={handleSubmit} className="product-form">
        <p>
          <label>
          {/*React viser inputfeltet → med teksten som ligger i title (det som brukeren skrevet).*/}
            Tittel:{' '}

            {/*Brukeren skriver → React oppdaterer title i state. */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)} //hver eneste tastatur knappen oppdaterer state 
              disabled={submitting} //Hvis submitting = true (hvis alt ble gjort riktig) → inputfeltet låses
            />
          </label>
        </p>

        <p>
          <label>
            Beskrivelse:<br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              rows={4}
            />
          </label>
        </p>

        <p>
          <label>
            Underkategori:{' '}
            <select
              value={subcategoryId}  //subcategories kommer fra Sanity ved å bruke useEffect
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={submitting}
            >

              {/*For hver underkategori lages en <option> */}
              <option value="">— velg underkategori —</option>

              {subcategories.map(sc => (
                <option 
                key={sc._id} 

                //ID‑en lagres i state når brukeren velger noe
                value={sc._id}>
                  {sc.category} / {sc.title} {/*subcategoryId blir ID‑en til valgt underkategori */}
                </option>
              ))}
            </select>
          </label>
        </p>

        <fieldset disabled={submitting}>
          <legend>Type</legend>
          <label>
            <input
            //Hvis listingType === "sale" → denne radioen er valgt
              type="radio"
              name="listingType"
              value="sale"
              checked={listingType === 'sale'}
              onChange={(e) => setListingType(e.target.value)} //Når brukeren klikker → listingType endres til "sale"
            />
            {' '}Til salgs
          </label>
          {' '}
          <label>
            <input
              type="radio"
              name="listingType"
              value="trade"
              checked={listingType === 'trade'}
              onChange={(e) => setListingType(e.target.value)}
            />
            {' '}Til bytte
          </label>
        </fieldset>




        {/*React viser riktig felt basert på hva brukeren velger. */}
        
        {/*Hvis listingType === "sale" → vis prisfeltet */}
        {listingType === 'sale' && (
          <p>
            <label>
              Pris (kr):{' '}
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={submitting}
              />
            </label>
          </p>
        )}

        {/*Hvis listingType === "trade" → vis tradeWish‑feltet */}
        {listingType === 'trade' && (
          <p>
            <label>
              Ønskes byttet mot:<br />
              <textarea
                value={tradeWish}
                onChange={(e) => setTradeWish(e.target.value)}
                disabled={submitting}
                rows={3}
              />
            </label>
          </p>
        )}

        {/*Feilmelding */}
        {error && <p className="form-error">{error}</p>}
        {/*Hvis error har tekst → vis feilmeldingen eller ikke vis noe */}

        {/*Submit‑knappen*/}
        <p>
          {/*Når alt ble gjort riktig og når brukeren trykker på knapp -> kommer "Legger ut..." tekst på knapp, hvis ikke så vis "Legg ut produkt" */}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Legger ut…' : 'Legg ut produkt'}
          </button>
        </p>
      </form>
    </div>
  )
}
