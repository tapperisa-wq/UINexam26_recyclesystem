import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import client from './helpers/sanityClient'
import Layout from './components/Layout'
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
  const [loggedInUser, setLoggedInUser] = useState(null) //lager en variabel som skal holde informasjon om brukeren

  useEffect(() => { {/*kjør bare én gang når App.jsx lastes inn*/}
  
    //Hvis brukeren er ikke logget inn hent første navn fra Sanity -> Bruker
    if (!loggedInUser) { 
      const fetchUser = async () => {
        try {

          //Hent første brukeren fra Sanity med id, navn og etternavn
          const query = `*[_type == "user"][0]{ _id, firstName, lastName }` 
          //Hent ALLE dokumenter som har typen user (Bruker Kategori i Sanity)
          //[0] første brukeren i fra liste

          //Sende spørskjema til Sanity
          const user = await client.fetch(query) 

          //Oppdatere React-state, rtter dette vet hele App‑komponenten hvem som er “innlogget”.
          setLoggedInUser(user)

          //Hvis noe går galt i try‑blokken -> tekst Error er send til konsolen sammen med error, så kan se hva som skjedde
        } catch (error) {
          console.error('❌ Error fetching logged in user:', error)
        }
      }
      //Kaller funksjonen, så den faktisk kjører. Uten denne linjen hadde funksjonen bare vært definert, men aldri brukt
      fetchUser()
    }
  }, [])
  //[] -> kjør denne effekten bare én gang


  
  return (
    //her definerer vi hvilke sider som finnes
    <Routes>  {/*boksen som inneholder ALLE rutene dine*/}
      <Route element={<Layout loggedInUser={loggedInUser} />}>
      {/*Alle sidene under her skal vises inni Layout‑komponenten (header,nav, main og footer)*/}
      {/*Sende en verdi (loggedInUser) fra App.jsx til Lyout komponent som er som en prop.*/}
      
      {/*                 BARNE-RUTENE / BARNEKOMPONENTENE             */}
      {/*Nav elementer: hjem, brukere, min profil, nytt produkt */}
        <Route path="/" element={<Home />} /> {/*Når URL er / → vis Home. */}
        <Route path="/users" element={<Users />} /> {/*Når URL er /users → vis Users.*/}

      {/*Main -> Nyeste produkter  */}
        <Route path="/product/:id" element={<Product />} />
        {/*:id er en variabel del av URL‑en, dvs. at den tilpasser seg til produkt id som ble valgt av brukeren */}

      {/*Brukerne */}
        <Route path="/profile/:id" element={<Profile loggedInUser={loggedInUser} />} />
        {/*:id tilpasser seg til id av brukeren som ble valgt*/}
        {/*Sende en verdi (loggedInUser) fra App.jsx til Profile komponent som er som en prop.*/}

        <Route path="/list/:id" element={<List />} />

        {/*Nytt produkt*/}
        <Route path="/products/new" element={<NewProduct loggedInUser={loggedInUser} />} />
        {/*Sende en verdi (loggedInUser) fra App.jsx til NewProduct komponent som er som en prop.*/}

        {/*Søkeresultater*/}
        <Route path="/search" element={<SearchResults />} />

        {/*404-side*/}
        <Route path="*" element={<Show404 />} />
        {/*Hvis ingen andre ruter matcher → vis 404.*/}
      </Route>
    </Routes>
  )
}

export default App
