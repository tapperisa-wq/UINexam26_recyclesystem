// Layout.jsx
// Wrapper-komponenten som omslutter alle sider i appen.
// Inneholder header, navigasjon, hovedinnhold og footer.
// Alle sidekomponenter rendres inne i <Outlet /> (der "main-content" er).

import { Link, Outlet } from 'react-router-dom'
import Search from './Search'
import './Layout.css'

export default function Layout({ loggedInUser }) {
  // loggedInUser sendes som prop fra App.jsx
// og brukes til å vise brukerens navn og betingede nav-lenker
  return (
    <div className="layout">

      {/* Toppbanner med logo, søkefelt og velkomstmelding */}
      <header className="header">
        <h1>Gjenbruken</h1>

        {/* Søkekomponenten – navigerer til /search?q=... ved søk */}
        <Search />
        {/* Viser brukerens fornavn hvis noen er "innlogget", ellers en fallback-tekst */}
        <p>Velkommen {loggedInUser ? loggedInUser.firstName : 'Ingen bruker lastet'}</p>
      </header>

      {/* Navigasjonsmeny – viser ekstra lenker hvis bruker er innlogget */}
      <nav className="nav">
        <ul>
          <li><Link to="/">Hjem</Link></li>
          <li><Link to="/users">Brukere</Link></li>

          {/* Disse lenkene vises bare hvis loggedInUser er satt (ikke null) */}
          {loggedInUser && (
            <>
            {/* Lenke til brukerens egen profil, med brukerens _id i URL-en */}
              <li><Link to={`/profile/${loggedInUser._id}`}>Min Profil</Link></li>
              {/* Lenke til skjema for å legge ut nytt produkt */}
              <li><Link to="/products/new">Nytt produkt</Link></li>
            </>
          )}
        </ul>
      </nav>


      {/*
        <Outlet /> er der den matchede rute-komponenten rendres.
        Hvis URL-en er /users, vil <Users /> rendres her.
        Hvis URL-en er /product/123, vil <Product /> rendres her, osv.
        
        OBS: loggedInUser sendt som prop til Outlet her har ingen effekt i React Router v6.
        Props til child-routes må sendes direkte på Route-elementene i App.jsx.
      */}
      <main className="main-content">
        <Outlet loggedInUser={loggedInUser} />
      </main>

      {/* Bunntekst med copyright og privacy-lenke */}
      <footer className="footer">
        <p>&copy; 2026 Gjenbruken. Alle rettigheter reservert.</p>
        <p><Link to="/privacy">Privacy</Link></p>
      </footer>
    </div>
  )
}
