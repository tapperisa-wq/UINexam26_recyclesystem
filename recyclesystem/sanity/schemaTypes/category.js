//Schema for forklarer Sanity hvordan data skal se ut
//Hjelpers-mappe bruker den filen til å lage data
const category = {

  // internt navn i Sanity (*[_type == "category"])
  name: 'category',

  //Navnet som vises i Sanity Studio
  title: 'Kategori',

  //Forteller Sanity at dette er en dokumenttype
  type: 'document', 

  //Liste over alle feltene som finnes i en kategori.
  fields: [
    //Nå vi har bare en felte
    { name: 'title', title: 'Navn', type: 'string', validation: r => r.required() }
    //name: 'title' → dette er hva feltet heter i databasen
    //Title: 'Navn' → er labelen vi ser i Studio
    //type: 'string' → feltet er vanlig tekst
    //validation: r => r.required()  -> dette er Sanity sin måte å si: "Dette feltet må fylles ut."
  ]
}

export default category



