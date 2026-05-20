//index.js er “samlefilen” som forteller Sanity hvilke schemas som finnes i prosjektet
//uten denne filen Sanity ville ikke vite om de dokumenter

//Hente alle schema‑filer
//hver fil definerer en dokumenttype i Sanity
import category from "./category";
import product from "./product";
import subcategory from "./subcategory";
import user from "./user";
import userList from "./userList";

//Eksporterer alle schemas samlet
export const schemaTypes = [product, category, subcategory, user, userList]
//Sanity forventer at vi sender en liste som heter schemaTypes, siden denne listen inneholder alle dokumenttypene som skal vises i Sanity Studio
