//Det er et Sanity‑schema som definerer hvordan en underkategori skal se ut i databasen
//Hjelpers-mappe bruker den filen til å lage data

const subcategory = {
  //*[_type == "subcategory"]
  name: 'subcategory',

  //Dette er navnet som vises i Sanity Studio i venstremenyen
  title: 'Underkategori',

  //Betyr at dette er en egen dokumenttype i databasen (ikke et felt, ikke et objekt)
  type: 'document',

  //Her definerer vi hvilke felter en underkategori skal ha
  fields: [
    { name: 'title', title: 'Navn', type: 'string', validation: r => r.required() },
    //name: internt navn til å identifisere dokumenttype
    //tile: navn over felte
    //type: tekst type for felte
    //må fylles inn

    {
      //feltnavnet
      name: 'category',

      //tekst over feltne
      title: 'Hovedkategori',

      //referer til category dokument
      type: 'reference',
      to: [{ type: 'category' }],
      
      validation: r => r.required()
    }
  ]
}

export default subcategory



