//Dokumentdefinisjon
const userList = {

  //internt navn i databasen *[_type == "userList"
  name: 'userList',

  //navnet som kommer til venstremenyen
  title: 'Brukerliste',
  
  //deklarer at det er dokumenttype (ikke felte, objekt osv.)
  type: 'document',
  fields: [
    
    //lage felt med liste navn
    { name: 'title', title: 'Listenavn', type: 'string', validation: r => r.required() },
    //name: 'title' → feltets navn i databasen
    //title: 'Listenavn' → tekst over felte
    //type: 'string' → vanlig tekstfelt
    //validation: r => r.required() → må fylles ut

    //Felte for å definere om list er privat eller public
    {
      //Internt navn på feltet
      name: 'isPublic',
      //vi bruker det i React: list.isPublic

      //tekst som kommer i felte, dvs. ved siden av en checkbox
      title: 'Offentlig liste',

      //selve checkbox
      type: 'boolean',


      //når vi lager en ny liste, er den automatisk offentlig
      initialValue: true 
      //isPublic = true
    },

    {
      //navn for felte
      name: 'owner',

      //tekst over felte
      title: 'Eier',

      //referere til user dokument
      type: 'reference',
      to: [{ type: 'user' }],

      //må fylles inn
      validation: r => r.required()
    },

    {
      //felte navn
      name: 'products',

      //tekst over felte
      title: 'Produkter',

      //datatypen er array
      type: 'array',

      //Definerer array
      of: [{ type: 'reference', to: [{ type: 'product' }] }]
      //of: Definerer hva slags ting som kan ligge i arrayen
      //type: 'reference' → hvert element i arrayen er en referanse
      //to: [{ type: 'product' }] → referansen peker på product‑dokumenter

    }
  ]
}

//sende videre
export default userList