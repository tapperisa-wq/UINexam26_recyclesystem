//sanityClient = koblingen mellom React prosjektet og Sanity‑databasen

//denne fil lager en ferdig Sanity-klient som React‑appen vil bruker til å:
    //hente data (fetch)
    //lage nye dokumenter (create)
    //oppdatere dokumenter
    //slette dokumenter


{/*importerer funksjonen createClient fra Sanity‑biblioteket */}
import {createClient} from '@sanity/client'
{/*Denne funksjonen brukes til å lage en “kobling” mellom React‑appen din og Sanity‑databasen. */}


{/*Dette objektet inneholder innstillingene som Sanity trenger for å vite*/}
const client = createClient({

  //id for Sanity prosjekt vi kobler seg til
  projectId: 'wsjmcvrh', 

  //informasjon hvilken database (dataset) vi bruker 
  dataset: 'production', 
  //Vi bruker den som la os gjøre at alt vi henter eller lager går til live data

  //API‑versjon vi vil bruke
  apiVersion: '2024-06-01', 

  //vi vil bruke CDN = Content Delivery Network som betyr raskere resultater
  useCdn: true,
  //Sanity gir oss data raskere fordi dataene leveres fra en server som er nær oss geografisk

  //Dette er en API‑nøkkel som gir tilgang til databasen
  token: "sk5ItVOH996bphBP7wVNb88YI1dzl8toahjsYrdi6xqtFxDcG6leELpJxpvT2OLZ1D4jO9FeRP6A0CCC0cfmN6nxC2bHDycEaZ5e3eilckUQH8KgBOzJEqgdYfb6bKp3KTqpznb9gu5cL4Y8RP2NPohttDdR74jV94qxWLv68vg5YaEnbyNk"
})

export default client



