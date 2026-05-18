// show404.jsx
// Vises når brukeren navigerer til en URL som ikke finnes i applikasjonen.
// Fanges opp av <Route path="*"> i App.jsx
export default function Show404() {
    return (
        <div>
            {/* Tilpasset 404-bilde – filen må ligge i public/-mappen for å nås med ./ */}
            <img src="./404.png" alt="404 Not Found" style={{ maxWidth: '100%', margin: '20px 0' }} />
            <p>Sorry, the page you are looking for does not exist or are currently being built. The builders are a shopping bag and a dog, so this might take some time...</p>
        </div>
    )
}
