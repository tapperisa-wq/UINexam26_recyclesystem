//den filen definerer hvordan et produkt‑dokument skal se ut 
//Hjelpers-mappe bruker den filen til å lage data

const product = {
  //internt navn i Sanity (*[_type == "product"])
  name: 'product',

  //Navnet som vises i Sanity Studio
  title: 'Produkt',
  
  //Forteller Sanity at dette er en dokumenttype
  type: 'document',

  //Liste over alle feltene som finnes i en produkt.
  fields: [
    //Nå vi har to felte
    { name: 'title', title: 'Tittel', type: 'string', validation: r => r.required() },
    { name: 'description', title: 'Beskrivelse', type: 'text' },
    //name: 'title' → dette er hva feltet heter i databasen
    //Title: 'Tittel' → er labelen vi ser i Studio
    //type: 'string' → feltet er vanlig tekst
    //validation: r => r.required()  -> dette er Sanity sin måte å si: "Dette feltet må fylles ut."

    //Felt: image
    {
      //feltnavnet
      name: 'image',

      //navnet som vises i Sanity Studio
      title: 'Bilde',

      //felt-type -> bilde
      type: 'image',

      //Med hotspot: Brukeren kan velge hva som er viktig i bildet slik at den viktig delen skal ikke bli kuttet
      options: { hotspot: true }
    },

    //Status felte
    {
      //feltnavn
      name: 'status',

      //navnet som vises i Sanity Studio
      title: 'Status',

      //felt-type -> tekst
      type: 'string',
      
      //gjør at vi kan får en liste med valg i Sanity Studio statuser
      options: {
        list: [
          { title: 'Aktiv', value: 'active' },
          { title: 'Reservert', value: 'reserved' },
          { title: 'Solgt', value: 'sold' },
          { title: 'Arkivert', value: 'archived' }
          //title → hva brukeren ser
          //value → hva som faktisk lagres i databasen (f.eks. "active")

        ],
        layout: 'radio'
        //layout: 'radio' → vises som knapper til å velge en alternativ

      },
      initialValue: 'active',
      //standardverdi når vi lager et nytt produkt er "active"
          
      validation: r => r.required()
      //Sanity sin måte å si: "Dette feltet må fylles ut."
    },

    {
      //felt-type
      name: 'owner',

      //Tekst over felte
      title: 'Eier',

      //felt-type
      //reference → peker til et annet dokument av typen user
      type: 'reference',
      to: [{ type: 'user' }],

      //Må fylles inn
      validation: r => r.required()
    },

    {
      //felt-type
      name: 'subcategory',

      //Det vi ser over felte
      title: 'Underkategori',

      //reference → peker til et annet dokument av typen subcategory
      type: 'reference',
      to: [{ type: 'subcategory' }],
      validation: r => r.required()
    },

    {
      //felt-type
      name: 'listingType',

      //Navn over felte
      title: 'Salgs- eller byttetype',
      type: 'string',

      //Brukeren velger om produktet er til å selge eller til å bytte
      options: {
        list: [
          { title: 'Til salgs', value: 'sale' },
          { title: 'Til bytte', value: 'trade' }
        ],

        //Knapper med et alternativ til å velge
        layout: 'radio'
      },
      validation: r => r.required()
    },

    {
      //type == price
      name: 'price',

      //Navn over felte
      title: 'Pris',

      //felt-type
      type: 'string',

      //hidden er en funksjon som bestemmer om feltet skal skjules i Sanity Studio
      hidden: ({ parent }) => parent?.listingType !== 'sale'
      //parent er hele dokumentet
      //Hvis produkt har ikke listingType 'sale' → skjul feltet dette felte (pris-felte)

    },

    {
      name: 'tradeWish',
      title: 'Ønskes byttet mot',

      //felt-type
      type: 'text',
      hidden: ({ parent }) => parent?.listingType !== 'trade'
      //parent er hele dokumet
      //Hvis produkt har ikke listingType 'tradeWish' → skjul feltet dette felte (bytteønske-felte)
    }
  ]
}

//sende videre
export default product


