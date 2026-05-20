//Den vises når brukeren går til en URL som ikke matcher noen av dine <Route>‑ruter. -> etter å trykke på¨Privacy i footer
//er definert i App.jsx
export default function Show404() {
    return (
        <div>
            {/*viser bilder */}
            <img src="./404.png" alt="404 Not Found" style={{ maxWidth: '100%', margin: '20px 0' }} />

            {/*viser tekst */}
            <p>Sorry, the page you are looking for does not exist or are currently being built. The builders are a shopping bag and a dog, so this might take some time...</p>
        </div>
    )
}
