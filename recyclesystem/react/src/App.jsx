// App.jsx
// Rot-komponenten for applikasjonen.
// Håndterer innlogget bruker og definerer alle URL-ruter.


import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

// Sanity-klienten brukes til å hente data fra databasen
import client from './helpers/sanityClient'

// Layout er "skallet" rundt alle sider – header, nav, footer
import Layout from './components/Layout'

// Sidekomponenter
import Home from './components/Home'
import Product from './components/Product'
import Profile from './components/Profile'
import List from './components/List'
import Users from './components/Users'
import Show404 from './components/show404'
import NewProduct from './components/NewProduct'
import SearchResults from './components/SearchResults'
import './App.css'



function App() {

   // State for innlogget bruker. null betyr at ingen er logget inn (ennå).
  // I en ekte app ville dette komme fra et autentiseringssystem.
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    // OBS: Dette er ikke ekte innlogging – appen henter bare den første
    // brukeren i databasen og later som om de er innlogget.
    // En ekte løsning ville brukt f.eks. JWT-tokens eller sessions.

    // Only fetch if loggedInUser is not set
    if (!loggedInUser) {
      const fetchUser = async () => {
        try {
          // Henter kun _id og navn – nok til å vise navn i header og sjekke rettigheter
          const query = `*[_type == "user"][0]{ _id, firstName, lastName }`
          const user = await client.fetch(query)
          setLoggedInUser(user)
        } catch (error) {
          console.error('❌ Error fetching logged in user:', error)
        }
      }
      fetchUser()
    }
  }, []) // Tom array = kjøres kun én gang når appen lastes

  return (
    // Routes er containeren for alle rute-definisjoner
    <Routes>
      {/*
        Layout er en wrapper-rute (uten path).
        Alle ruter inni her vil bruke Layout sin header/nav/footer.
        loggedInUser sendes ned slik at Layout kan vise brukerens navn i headeren.
      */}
      <Route element={<Layout loggedInUser={loggedInUser} />}>

       {/* Forsiden – viser de nyeste produktene */}
        <Route path="/" element={<Home />} />

        {/* Liste over alle brukere */}
        <Route path="/users" element={<Users />} />

        {/* Enkeltprodukt – :id er en dynamisk parameter fra URL-en */}
        <Route path="/product/:id" element={<Product />} />

         {/* Brukerprofil – loggedInUser sendes for å sjekke om det er din egen profil */}
        <Route path="/profile/:id" element={<Profile loggedInUser={loggedInUser} />} />

        {/* En brukers kuraterte liste med produkter */}
        <Route path="/list/:id" element={<List />} />

        {/* Skjema for å legge ut nytt produkt – krever innlogget bruker */}
        <Route path="/products/new" element={<NewProduct loggedInUser={loggedInUser} />} />

        {/* Søkeresultater – søketermen kommer fra URL-parameteret ?q=... */}
        <Route path="/search" element={<SearchResults />} />

        {/* Catch-all: vises for alle URL-er som ikke matcher noe over */}
        <Route path="*" element={<Show404 />} />
      </Route>
    </Routes>
  )
}

export default App
