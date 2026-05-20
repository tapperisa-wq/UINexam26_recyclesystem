//Endrer URL-en til /search?q=stol etter brukeren skrevet ord i søkefelte og trykket på "Søk"knappen

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Search() {
  const navigate = useNavigate() 
  //navigate() brukes senere for å sende brukeren til /search?q=... (siden med ord brukeren prøvde finne)

  const [searchParams] = useSearchParams() //searchParams gir tilgang til URL-parameterne.

  {/*Henter eksisterende søkeord fra URL */}
  {/*Lage en state‑variabel som heter query (det som finnes etter "?"). */}
  const [query, setQuery] = useState(searchParams.get('q') || '') 
  //Hvis URL-en er /search?q=stol, så blir query = "stol" 
  {/*Så hvis noen skriver noe i søkefelte og trykker "Søk"-knappen så ser vi ord fra søkkefelte på main delen*/}

  {/*Når brukeren trykker "Søk"... */}
  const handleSubmit = (event) => {

    {/*Stopper at skjemaet prøver å laste siden på nytt -> vi kan ikke refreshe siden*/}
    event.preventDefault()

    {/*Søker ord bare når brukeren faktisk har skrevet noe */}
    if (query.trim()) {  //fjerner mellom rom slik at det bli ikke tatt som tekst

      {/*Sender brukeren til en ny URL: /search?q=søkeord*/}
      navigate(`/search?q=${encodeURIComponent(query.trim())}`) 
      {/*encodeURIComponent() sørger for at spesialtegn fungerer, slik at uansett hva brukeren skriver, 
        alt skal fungere som søk ord uten mellomrom */}
    }
  }

  return (
    //det som vises på skjermen

    //Når brukeren klikker "Søk": handleSubmit kjører og brukeren navigeres til /search?q=...
    <form onSubmit={handleSubmit}> 
      <input
        type="text"

        //Inputfeltet viser alltid det som ligger i React‑state (altså ord som brukeren skrevet i søkefelte)
        value={query}

        //Når du skriver i feltet: React oppdaterer state og UI oppdateres automatisk
        onChange={(e) => setQuery(e.target.value)}

        placeholder="Søk etter produkter..."
      />
      {/*Etter å trykke på "Søk kjører handleSubmit funksjon" */}
      <button type="submit">Søk</button> 
    </form>
  )
}
