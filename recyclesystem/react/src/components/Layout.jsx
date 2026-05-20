import { Link, Outlet } from 'react-router-dom'
import Search from './Search'
import './Layout.css'

export default function Layout({ loggedInUser }) { //Definerer Layout funksjonskomponent 
  return (
    <div className="layout">

      {/*HEADER*/}
      <header className="header">

        {/*Logo*/}
        <h1><Link to={"/"}>Gjenbruken</Link></h1> {/*omgjøre LOGO som link til hjemmeside */}

        {/*Kalle søk felte som er definert i Search komponent*/}
        <Search /> 

        {/*Brukeren navn */}
        <p>Velkommen {loggedInUser ? loggedInUser.firstName : 'Ingen bruker lastet'}</p>
        {/*ternary operator: 
        Hvis loggedInUser finnes vis første navn fra Sanity
        Hvis loggedInUser finnes IKKE vis teksten "Velkomen Ingen bruker lastet"
        */}

      </header>

      {/*NAV*/}
      <nav className="nav">
        <ul>
          <li><Link to="/">Hjem</Link></li> {/*navigerer til hjemmesiden uten full side-refresh.*/}
          <li><Link to="/users">Brukere</Link></li>

          {/*hvis brukeren finnes vis Min Profil og Nytt produkt inn i meny*/}
          {loggedInUser && (
            <>
              <li><Link to={`/profile/${loggedInUser._id}`}>Min Profil</Link></li>
              {/*url tiplasser seg til brukeren _id*/}
              
              <li><Link to="/products/new">Nytt produkt</Link></li>
            </>
          )}
        </ul>
      </nav>

      {/*MAIN*/}
      <main className="main-content">
        {/*plassen der barne-rutene vises */}
        <Outlet loggedInUser={loggedInUser} /> 
        {/*f.eks. når url er /users å blir den komponenten (Users) rendret inni Outlet. */}
      </main>

      {/*FOOTER */}
      <footer className="footer">
        <p>&copy; 2026 Gjenbruken. Alle rettigheter reservert.</p>

        {/*Linke til error side*/}
        <p><Link to="/privacy">Privacy</Link></p> 
      </footer>
    </div>
  )
}

