const request = require('request') //to make a HTML request I use the NPM module called request. 

const geocode = (address, callback) => { // her definere jeg en funktion som kan bruges til at søge på et sted og få latitude, longitude og location tilbage.
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoiamVzcGVyciIsImEiOiJja200cWxrbGowNzM5MnZtdG9hcmE2bmhpIn0.GVYM6Cwajl4A2i0_K-tysw&limit=1' // her fjerner jeg den del af url som indeholder søgeordet. I stedet indsættes en variabel som kan indskrives som argument når man vil bruge funktionen

    request({ url: url, json: true }, (error, response) => { // her bruger jeg resquest modulet fra NPM til lave en http request 
        if (error) {
            callback('Unable to connect to location services!', undefined) // hvis der kommer en error så sender du de her to argumenter til din callback function
        } else if (response.body.features.length === 0) { //hvis response.body er tom dvs at byen ikke findes så sendes nedenstående
            callback('No results for your search!', undefined) //her kommunikere jeg tilbage til callback funktionen og giver indhold til de to parametre error eller data alt afhængigt af om søgningen lykkes eller ej
        } else {
            callback(undefined, { // hvis der ikke er nogen fejl så sætter jeg error til undefined i callback funktionen. Jeg sætter derefter data til at være et objekt hvis værdier er nogle udvalgte informationer fra det json data jeg har fået som response på mit http request
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}

module.exports = geocode