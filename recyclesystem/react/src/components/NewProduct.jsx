// NewProduct.jsx
// Skjema for å legge ut et nytt produkt.
// Kun tilgjengelig for innloggede brukere.
// URL: /products/new

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../helpers/sanityClient'
import './NewProduct.css'

// loggedInUser brukes til å knytte det nye produktet til riktig eier
export default function NewProduct({ loggedInUser }) {
    // useNavigate gir oss mulighet til å navigere programmatisk etter innsending
  const navigate = useNavigate()

  // Liste over tilgjengelige underkategorier hentet fra Sanity
  const [subcategories, setSubcategories] = useState([])

  // Skjemafelt-states – én per input
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')

  // Standardverdi er 'sale' – brukeren kan bytte til 'trade'
  const [listingType, setListingType] = useState('sale')

  // Disse to er betingede – bare én av dem er relevant om gangen
  const [price, setPrice] = useState('')
  const [tradeWish, setTradeWish] = useState('')

  // Statusflagg for å hindre dobbel-innsending og vise feilmeldinger
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {

      // Henter alle underkategorier fra Sanity for å fylle nedtrekkslisten
    // Inkluderer kategorinavnet via join (category->title) for å vise "Kategori / Underkategori"
    const fetchSubcategories = async () => {
      const query = `*[_type == "subcategory"] | order(title asc){
        _id, title, "category": category->title
      }`
      const data = await client.fetch(query)
      setSubcategories(data)
    }
    fetchSubcategories()
  }, []) // Kjøres én gang ved montering

  // Tidlig retur hvis ingen er innlogget – viser feilmelding i stedet for skjema
  if (!loggedInUser) {
    return <p>Du må være logget inn for å legge ut et produkt.</p>
  }

  const handleSubmit = async (event) => {
    // Hindrer standard HTML-skjema-innsending (som ville lastet siden på nytt)
    event.preventDefault()
    setError(null)

      // Klientside-validering før vi sender noe til Sanity
    if (!title.trim()) {
      setError('Tittel er påkrevd.')
      return
    }
    if (!subcategoryId) {
      setError('Velg en underkategori.')
      return
    }
    if (listingType === 'sale' && !price.trim()) {
      setError('Pris er påkrevd for salg.')
      return
    }
    if (listingType === 'trade' && !tradeWish.trim()) {
      setError('Beskriv hva du ønsker å bytte mot.')
      return
    }

    setSubmitting(true)
    // Oppretter et nytt produkt-dokument i Sanity
    try {
      const newProduct = await client.create({
        _type: 'product',
        title: title.trim(),
        description: description.trim(),
        status: 'active', // Nye produkter er alltid aktive fra start
        listingType,
        // Referanse til den innloggede brukeren som eier
        owner: { _type: 'reference', _ref: loggedInUser._id },

          // Referanse til valgt underkategori
        subcategory: { _type: 'reference', _ref: subcategoryId },

        // Spread-syntaks: legger bare til price HVIS listingType er 'sale'
        ...(listingType === 'sale' ? { price: price.trim() } : {}),

        // Legger bare til tradeWish HVIS listingType er 'trade'
        ...(listingType === 'trade' ? { tradeWish: tradeWish.trim() } : {})
      })
      // Navigerer til det nye produktets side etter vellykket opprettelse
      navigate(`/product/${newProduct._id}`)

      // Viser feilmelding fra Sanity hvis noe gikk galt
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Legg ut nytt produkt</h1>

      {/* onSubmit håndteres av handleSubmit-funksjonen over */}
      <form onSubmit={handleSubmit} className="product-form">

        {/* Tittel-felt */}
        <p>
          <label>
            Tittel:{' '}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting} // Deaktiveres mens skjemaet sendes
            />
          </label>
        </p>

        {/* Beskrivelse-felt – textarea for lengre tekst */}
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

        {/* Nedtrekksliste for underkategori – populeres fra Sanity */}
        <p>
          <label>
            Underkategori:{' '}
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={submitting}
            >
              {/* Viser "Kategori / Underkategori" for hver valgmulighet */}
              <option value="">— velg underkategori —</option>
              {subcategories.map(sc => (
                <option key={sc._id} value={sc._id}>
                  {sc.category} / {sc.title}
                </option>
              ))}
            </select>
          </label>
        </p>

        {/* Radio-knapper for å velge mellom salg og bytte */}
        <fieldset disabled={submitting}>
          <legend>Type</legend>
          <label>
            <input
              type="radio"
              name="listingType"
              value="sale"
              checked={listingType === 'sale'}
              onChange={(e) => setListingType(e.target.value)}
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
        

        {/* Prisfelt – vises kun hvis listingType er 'sale' */}
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

        {/* Byttekrav-felt – vises kun hvis listingType er 'trade' */}
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

      {/* Feilmelding vises under skjemaet hvis noe er feil */}
        {error && <p className="form-error">{error}</p>}

        <p>
          {/* Knappen deaktiveres og teksten endres mens skjemaet sendes */}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Legger ut…' : 'Legg ut produkt'}
          </button>
        </p>
      </form>
    </div>
  )
}
