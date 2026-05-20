//fyller databasen med testdata
//Det er som en helt tom butikk uten varer -> varer vi bestemmer  senere, så den fila gjør:


import client from './sanityClient.js'

// Helper function to get random element
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]
//Funksjon for velge én tilfeldig verdi fra et array.


// Helper function to get random number in range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
//Gir et tilfeldig tall mellom min og max (inkludert).


// Helper function to shuffle array
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
//Lager en tilfeldig rekkefølge av elementene i et array.


//DATASETT FOR GENERERING

// First names for generating users
const firstNames = [
  'Johan', 'Maria', 'Erik', 'Anna', 'Per',
  'Kari', 'Ole', 'Astrid', 'Bjørn', 'Inger'
]

// Last names for generating users
const lastNames = [
  'Hansen', 'Andersen', 'Larsen', 'Johansen', 'Olsen',
  'Berg', 'Nilsen', 'Ström', 'Sørensen', 'Dahl'
]

// Test cities
const cities = ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Tromsø']

// Product titles for different subcategories
const productTitles = {
  Electronics: [
    'Brukt MacBook Pro 13"',
    'iPhone XS Max',
    'Sony Kamera',
    'Trådløse hodetelefoner',
    'Bærbar Bluetooth høyttaler',
    'USB-C kabel',
    'Ladekabel',
    'Skjermskjermer'
  ],
  Furniture: [
    'Birk-sofakrok',
    'Skrivebord',
    'Hvit bokhylle',
    'Spisebordsstoler',
    'Nattbord',
    'Garderobe',
    'TV-benk',
    'Reol'
  ],
  Clothing: [
    'Vintage denim jakke',
    'Dress kostyme',
    'Snørstøvler',
    'Sommerkjole',
    'Joggebukse',
    'Skjorte',
    'Sportssko',
    'Lammegenser'
  ],
  Books: [
    'Harry Potter samling',
    'Ender\'s Game',
    'Norske eventyr',
    'IT-boken',
    'Design klassikere',
    'Kokebok',
    'Tegneseriebiler',
    'Biografiboken'
  ],
  Sports: [
    'Bergklatringsutstyr',
    'Sykkelglasögon',
    'Treningssmartklokke',
    'Joggemaatte',
    'Hantler set',
    'Yogamatte',
    'Tennisracket',
    'Isskøyter'
  ]
}

// Bytteønsker
const tradeWishes = [
  'Søker vinyl plates',
  'Bytte for gaming konsoll',
  'Søker vintage møbler',
  'Bytte for elektronikk',
  'Søker strikkverk',
  'Bytte for sykkel deler',
  'Søker fotografiutstyr',
  'Bytte for komisk bok'
]






// Main function
export async function seedDatabase() {
  try {
    //gi komando i konsollen slik at vi vet at database slettes
    console.log('🗑️ Sletter eksisterende test data...') 

    //en funksjon som sletter alle dokumenter i Sanity
    await deleteAllData() 
    //await ->  Vent til alt er slettet før du går videre


    //Kalle funskjoner for å lagee elementer 

    //Lager kategorier og underkategorier
    console.log('📚 Oppretter kategorier og underkategorier...')
    const categories = await createCategories()

    //Lager brukere
    console.log('👥 Oppretter brukere...')
    const users = await createUsers()

    //Lager produkter
    console.log('🛍️ Oppretter produkter...')
    const products = await createProducts(users, categories)

    //Lager lister per bruker
    console.log('📋 Oppretter brukerlister...')
    await createUserLists(users, products)

    //Send melding til konsolen at ting ble lagra
    console.log('✅ Databasen er ferdig seeded!')

    //vis brukerne, kategories og produkter
    return { users, categories, products }


    //Hvis ting gikk rart vis meling o error i konsollen
  } catch (error) {
    console.error('❌ Feil ved seeding av database:', error)
    throw error
  }
}

// Delete all documents
async function deleteAllData() {
  //definere hva vi vil slette
  const types = ['userList', 'product', 'user', 'subcategory', 'category']

  //En løkke som går gjennom hver dokumenttype
  for (const type of types) {

    //Dette lager en GROQ‑query som henter alle ID‑ene for dokumenter av denne typen.
    const query = `*[_type == "${type}"]._id`

    //Sanity kjører queryen → du får tilbake alle ID‑ene.
    const ids = await client.fetch(query)

    //Gå gjennom hver ID
    for (const id of ids) {
      //Slett dokumentet med den ID‑en og Vent (await) til slettingen er ferdig før du går videre
      await client.delete(id)
    }
    //På slutten gi informasjon i konsolen at ting ble sletta og hva ble sletta 
    //(kommer melding for hver element som ble sletta)
    console.log(`  ✓ Slettet alle ${type} dokumenter`)
  }
}

// Create categories and subcategories
async function createCategories() {

  //Opretter kategorier som liste (array)
  const categoryNames = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports']

  //Opretter underkategorier som objekt hvor nøkkel er kategori navn og verdi er liste med de underkategori
  const subcategoryNames = {
    Electronics: ['Computers', 'Mobile devices', 'Audio', 'Cables & Accessories'],
    Furniture: ['Living room', 'Bedroom', 'Kitchen', 'Office'],
    Clothing: ['Jackets', 'Dresses', 'Shoes', 'Sweaters'],
    Books: ['Fiction', 'Non-fiction', 'Comics', 'Textbooks'],
    Sports: ['Climbing', 'Cycling', 'Fitness', 'Winter sports']
  }

  //En tom beholder som skal fylles med alle kategoriene vi lager
  const categories = {}

  //En løkke som går gjennom hver kategori
  for (const catName of categoryNames) {

    //Oppretter en kategori i Sanity
    const category = await client.create({
      _type: 'category', //oprette category som type i Sanity
      title: catName //oprette titel fra kategori liste
    })

    //Lagrer kategorien i den tomt objektet "categories"
    categories[catName] = category

    //På slutt gi informasjon i konsollen
    console.log(`  ✓ Opprettet kategori: ${catName}`)

    //Nå lager vi underkategorier for hver kategorien
    for (const subName of subcategoryNames[catName]) {

      //Dette lager en underkategori i Sanity
      await client.create({
        _type: 'subcategory',
        title: subName,

        //underkategorien peker på foreldre kategorien
        category: {
          _type: 'reference', //dette feltet er en referanse
          _ref: category._id //dette er ID‑en til dokumentet du peker på
        }
      })
    }
  }

  //Returnerer alle kategoriene vi opprettet, slik at andre funksjoner kan bruke dem
  return categories
}

// Create users

//Definerer en asynkron funksjon som skal lage brukere i databasen
async function createUsers() {

  //Lager et tomt array som skal fylles med brukerne som opprettes
  const users = []
  
  //Kalle funksjon for fornavn‑lista, så rekkefølgen blir tilfeldig, og vi får ulike kombinasjoner hver gang
  const availableFirstNames = shuffle(firstNames)


  //Løkke som kjører 5 ganger → vi lager 5 brukere
  for (let i = 0; i < 5; i++) {

    //Tar fornavn id nummer fra den shuffla lista med navn
    const firstName = availableFirstNames[i]

    //Velger et tilfeldig etternavn
    const lastName = randomElement(lastNames)

    //Velger en tilfeldig by
    const city = randomElement(cities)

    //Oppretter et user‑dokument i Sanity
    const user = await client.create({ //await venter til brukeren faktisk er lagret.

      //dokumenttype "users"
      _type: 'user',

      //tilfeldig navn
      firstName,

      //tilfeldig etternavn
      lastName,

      //email er generert av fornavn + etternavn
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,

      //fast testpassord for alle
      password: 'TestPassword123!',

      //tilfeldig husnummer + tilfeldig gatenavn
      streetAddress: `${randomRange(1, 200)} ${randomElement(['Gaten', 'Veien', 'Stien', 'Allèen'])}`,

      //tilfeldig 4‑sifret nummer (alle tall mellom 0 og 9, min 1000, max 9999, som betyr at vi må få 4 tall)
      postalCode: `${randomRange(1000, 9999)}`,

      //tilfeldig byen
      city
    })

    //Legger den opprettede brukeren inn i users‑arrayet.
    users.push(user)

    //Skrive i terminalen at brukeren er opprettet.
    console.log(`  ✓ Opprettet bruker: ${firstName} ${lastName}`)
  }

  //Når løkka er ferdig → returnerer alle brukerne som ble laget.
  return users
}

// Create products
//Når funksjonen blir kalt: sender vi inn to ting: 
  //En liste med alle brukerne som ble laget tidligere og Et objekt med alle kategoriene som ble laget tidligere
async function createProducts(users, categories) {

  //lage tom liste som skal fylles med produkter
  const products = []

  //GROQ‑query som henter alle underkategorier
  const subcategoriesQuery = `*[_type == "subcategory"]{ _id, title, "categoryTitle": category->title }`

  //Kjører queryen mot Sanity og får tilbake alle underkategorier
  const subcategories = await client.fetch(subcategoriesQuery)


  // Distribute 3-12 products per user
  //Lager en liste der hver bruker får et tilfeldig antall produkter mellom 3 og 12
  const productsPerUser = users.map(() => randomRange(3, 12))

  //Summerer hvor mange produkter som totalt skal lages (brukes bare til info, ikke videre i koden)
  const totalProducts = productsPerUser.reduce((a, b) => a + b, 0)

  let productCount = 0

  //Løkke over alle brukere via indeks
  for (let userIdx = 0; userIdx < users.length; userIdx++) {

    //hente brukeren
    const user = users[userIdx]

    //Definere hvor mange produkter denne brukeren skal få
    //henter tallet som ble generert for akkurat denne brukeren i productsPerUser
    const numProducts = productsPerUser[userIdx]

    //lager produkter for denne brukeren
    for (let i = 0; i < numProducts; i++) {

      //Velger en tilfeldig underkategori.
      const subcategory = randomElement(subcategories)

      //Henter kategorinavnet til underkategorien.
      const categoryTitle = subcategory.categoryTitle

      //Henter en liste med passende produktnavn for den kategorien. Hvis ingen finnes → bruk 'Produkt'
      const titles = productTitles[categoryTitle] || ['Produkt']

      //Velger én tilfeldig tittel fra lista
      const title = randomElement(titles)

      //Tilfeldig om produktet er til salgs eller bytte
      const isForSale = Math.random() > 0.4 // 60% for sale, 40% for trade
      // dvs. 60% sjanse for true (sale), 40% for false (trade)

      //Lage liste med status
      const statuses = ['active', 'active', 'active', 'reserved', 'sold', 'archived']

      //Velger en tilfeldig status, men med større sjanse for active (fordi den står tre ganger i liste).
      const status = randomElement(statuses)

      //Oprette et produkt
      const product = await client.create({
        _type: 'product',
        
        //valgt tittel med anatll produkter
        title: `${title} #${productCount + 1}`,

        //generert tekst + tilfeldig tilstand
        description: `En fin brukt ${title.toLowerCase()}. Tilstand: ${randomElement(['Som ny', 'God', 'Nokså god', 'OK'])}`,

        //referanse til brukeren
        owner: {
          _type: 'reference',
          _ref: user._id
        },

        //referanse til underkategori
        subcategory: {
          _type: 'reference',
          _ref: subcategory._id
        },

        //status → fra statuses liste
        status,

        //listingType → 'sale' eller 'trade'
        listingType: isForSale ? 'sale' : 'trade',

        //Hvis isForSale === true → legg til price av tilfelig tall
        ...(isForSale && { price: `${randomRange(50, 2000)}` }),

        //Hvis isForSale === false → legg til bytteønske
        ...(!isForSale && { tradeWish: randomElement(tradeWishes) })
      })

      //Legger produktet i lista og øker total produkt antall
      products.push(product)
      productCount++
    }

    //Tekst hvor står mange produkter denne brukeren fikk
    console.log(`  ✓ Opprettet ${numProducts} produkter for ${user.firstName} ${user.lastName}`)
  }

  //Returnerer alle produktene som ble laget
  return products
}

// Create user lists
async function createUserLists(users, products) {
  for (const user of users) {

    //Filtrerer ut produkter som tilhører denne brukeren
    const userProducts = products.filter(
      p => p.owner._ref === user._id
    )

    //Filtrerer ut produkter som tilhører andre brukere, siden vi vil hente produkter fra andre brukerne ikke til den innloget brukeren
    const otherUserProducts = products.filter(
      p => p.owner._ref !== user._id
    )

    // Create 1-4 lists per user
    const numLists = randomRange(1, 4)

    //Løkke som lager hver enkelt liste
    for (let i = 0; i < numLists; i++) {

      // Each list has 2-7 products, but NO products from the user's own products
      //Tilfeldig antall produkter i lista mellom 2 og 7
      const numProductsInList = randomRange(2, 7)

      //Shuffler produktene til andre brukere og tar de første numProductsInList.
      const listProducts = shuffle(otherUserProducts).slice(0, numProductsInList)

      //Oppretter en userList:
      const list = await client.create({
        _type: 'userList',
        title: `${user.firstName}s ${randomElement(['favoritter', 'ønskelist', 'interessant', 'relevante', 'kuratert liste'])}`,
        isPublic: Math.random() > 0.3, // 70% public, dvs. 70% sjanse for true

        //referanse til brukeren
        owner: {
          _type: 'reference',
          _ref: user._id
        },

        //array av referanser til produkter
        products: listProducts.map((p, idx) => ({
          _key: `product-${idx}`,
          _type: 'reference',
          _ref: p._id //peker til produktet
        }))
      })

      console.log(`  ✓ Opprettet liste "${list.title}" for ${user.firstName} med ${listProducts.length} produkter`)
    }
  }
}

// Execute immediately when file is run directly
//Kjør med en gang når den filen blir aktivert
seedDatabase().catch(error => {
  console.error('Database seeding failed:', error)
  process.exit(1)
})

// Export the seedDatabase function to be called from React component
// Eksporter seedDatabase-funksjonen som skal kalles fra React-komponenten
export default seedDatabase
