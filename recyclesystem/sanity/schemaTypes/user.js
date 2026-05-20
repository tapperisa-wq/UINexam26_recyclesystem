const user = {

  //internt navn *[_type == "user"]
  name: 'user',

  //Navnet som kommer på venstre side i menyen i Sanity
  title: 'Bruker',

  //dokumenttype (ikke et felt, ikke en referanse, ikke et objekt)
  type: 'document',

  //Dette er alle feltene en bruker skal ha
  fields: [
    { name: 'firstName', title: 'Fornavn', type: 'string', validation: r => r.required() },
    { name: 'lastName', title: 'Etternavn', type: 'string', validation: r => r.required() },
    { name: 'streetAddress', title: 'Gateadresse', type: 'string' },
    { name: 'postalCode', title: 'Postnummer', type: 'string' },
    { name: 'city', title: 'Poststed', type: 'string' },
    { name: 'email', title: 'E-post', type: 'string', validation: r => r.required().email() },
    { name: 'password', title: 'Passord', type: 'string', validation: r => r.required() }
    //name: navnet for felte
    //title: navn over felte
    //type: felte type
    //validation: r => r.required(): Sanity måte for å si at alt må fylles inn

  ]
}

//sende videre
export default user