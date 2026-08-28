# Moment 3.1 DT207G


Detta repository innehåller kod för ett REST API byggt med **Node.js**, **Express** och **MongoDB**. APIet är byggt för att hantera arbetserfarenheter så som tidigare arbetsplatser, positioner och anställningsperioder. Grundläggande funktionalitet för CRUD (Create, Read, Update, Delete) är implementerad.

## Installation och databas

APIet använder **MongoDB** som NoSQL-databas med **Mongoose** som ODM (Object Document Mapper).

### Steg för installation:

1. **Klona repositoryt:**

git clone [https://github.com/umavanmoriel/Moment3.1_DT207G.git](https://github.com/umavanmoriel/Moment3.1_DT207G.git)

2. **Installera nödvändiga npm-paket: express, cors, mongoose, nodemon 

npm install

3. **Starta MongoDB (i en separat terminal)**

mongod --dbpath ~/data/db

4. **Starta servern (i en annan terminal)**

cd ~/Moment3.1_DT207G
node server.js


### Databasstruktur

| Collection-namn | Fält |
|-----------------|------|
| **experience** | `company` (String) - Företagsnamn |
| | `position` (String) - Anställningstitel |
| | `startDate` (Date) - Startdatum för anställning |
| | `endDate` (Date) - Slutdatum för anställning (valfritt) |
| | `location` (String) - Plats/ort (valfritt) |


## Användning

Nedan finns beskrivet hur man når APIet på olika vis:

| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| **GET** | `/experience` | Hämtar alla tillgängliga erfarenheter. |
| **POST** | `/experience` | Lagrar en ny erfarenhet. Kräver att ett erfarenhet - objekt skickas med i body. |
| **PUT** | `/experience/:id` | Uppdaterar en existerande erfarenhet med angivet ID. Kräver att ett erfarenhet - objekt skickas med i body. |
| **DELETE** | `/experience/:id` | Raderar en erfarenhet med angivet ID. |

###Ett objekt returneras/skickas som JSON med följande struktur:

{
  "company": "Google",
  "position": "Software Engineer",
  "startDate": "2020-01-01",
  "endDate": "2022-12-31",
  "location": "Stockholm"
}
