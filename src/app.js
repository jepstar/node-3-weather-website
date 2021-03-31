const path = require('path') // path is a core module. It means that the you do not have to install it through NPM. Noramlly you write the core modules firs like here. But you do not have to
const express = require('express') // the express library is a single function as opposed to an object which most other libraries are. We call it to create a new express aplication. 
const app = express() // a new variable to store our express aplication 
const hbs = require('hbs') // you have to require hbs to use partials
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname) // prints the path to the directory name. Directory name har at gøre med hvilken mappe som er root directory for your project.
console.log(path.join(__dirname, '../public')) // path.join er en funktion som sammensætter de forskellige dele af en path for os. vi skriver selv de forskellige dele som skal sammensættes til en path. dirname er den aktuelle mappe som dokumentet er i (src) De to .. går to skridt tilbage. Dvs i det her tilfælde til web-server. /public går ind i mappen public i web-server (hvis du ville gå to mapper op så skulle du skrive ../.. så ville du være i nymappe)

// define paths for express config.
const publicDirectoryPath = path.join(__dirname, '../public') // here i make a const with a path to the public folder directory using path.join
const viewsPath = path.join(__dirname, '../templates/views') // here I make a const with a path to the folder called template. 
const partialsPath = path.join(__dirname, '../templates/partials') // here I create a path for the partials I wanna use 

// setup handelbars engine and views location
app.set('view engine', 'hbs') // here I set up a view engine for express in order to view dynamic templates. I have previously installed the npm module hbs which allows express to use handlebars.js. It's a view engine for showing dynamic web pages. When you set this view enginem, express expects that the documents live in a folder called views in the root directory of the project - that's going to be the default folder it opens the dynamic documents from (the root directory of the project is web-server). If the requested file isn't found in the static folder (defined above) then it will automaticly go to views and look for a dynamic file with the name. I have deleted index.html from the  static folder and made an index.hbs in the views folder
app.set('views', viewsPath) // here I set the path to the views folder to be /templates instead. 
hbs.registerPartials(partialsPath) // Here I configure which path the partials can be found in

//setup static directory to serve  
app.use(express.static(publicDirectoryPath)) // here I use express to serve up a directory. We use this to serve static files from a default folder (here public). app.use is a way to customize our server. Here I use it to serve up a path. Express.static is a function. we call it and it puts its return value into 'use' from app.use. This line of code does so that when someone go to the root of our server it goes to the path provided (public folder and serves up chosen file from that folder). index.tml filen  bliver loaded automatisk hvis der ikke  givet en specifik path til et dokuent (kun mappen public).  Therefore I have commented out the code below which used to be my landing route. This line of code changes it so that if I add /about.html or /help.html to the address localhost:3000 in the browser it opens the html files  

app.get('', (req, res) => { // this is the way you set up a route for a dynamic document. In this case, if there is a request for the path '' which is the root because the path is empty, it will render the index file in the views folder (i.e. where the dynamic files are placed)
    res.render('index', { // remember not to use any file extension to the name when you render dynamic pages 
        title: 'Weather', // det andet argument som jeg giver til funktioenen er et objekt. The propperties of the object will be the dynamic content that can be displayed in the actual template.
        name: 'Jesper Bruun'
    }) 
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Jesper Bruun'
    })
})

app.get('/help', (req, res)=> {
    res.render('help', {
        helpInfo: 'Here you can get help!',
        questions: 'Common questions here!',
        title: 'Help!',
        name: 'Jesper Bruun Pedersen'
    })
})

app.get('/weather', (req, res) => { // sets up a route that uses the query string and the value of 'address' written in the query string to start a http request using 'geocode' and 'forecast' to get data and send it back as an object to the browser using res (express)
     if (!req.query.address) {
         return res.send({
             error: 'You must provide an address!'
            })
        } 
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => { // her kalder jeg geocode(). Den funktion som jeg bruger som callback giver jeg parameterne error og derefter et dekonstrueret objekt af det data jeg får tilbage i data. Jeg dekonstruerer det objekt jeg får tilbage i callback funktionen så det kun er patameterene longitude, latitude og location som jeg får tilbage fra objektet. Hvis det ikke går som planlagt returneres error ellers det dekonstruerede objekt med de parametre jeg skal bruge fra det. I have given the deconstructed object the default value of an empty object = {} This way the callback function works.  Funktionen er defineret i /utils/geocode.js. Det første parameter er en variabel som indeholder process.argv[2] (dvs input fra terminalen). Det andet er et callback
        if (error) { 
            return res.send({ error }) // hvis der er en fejl sker dette
        }   
        forecast(latitude, longitude, (error, forecastData) => { // Callback chaining: her kalder jeg forecast function defineret i forecast.js. Det er en callback function som er indlejret i en anden callback function. Effekten er at eksekverer kode i en specifil rækkefølge. Først kalder jeg geocode som vender laver en http forespørgsel og vender tilbage med et svar som er et objekt indeholdt i variablen data. data indeholder properties med latitude og longitude. Dem bruger jeg så som argumenter i funktionen forecast som jeg efterfølgende kalder. Den laver så en ny http forespørgsel hvor den bruger den data (latititude og longitude til at lave en ny http forespørgsel som igen vender tilbage med data til callback funktionen fra forecast callback functionen)
            if (error) {
                    return res.send({ error }) // hvis der er en fejl sker dette
            }
            res.send({
                address: req.query.address,
                location: location,
                forecastData: forecastData,
                latitude: latitude,
                longitude: longitude
            })
        }) 
    })   
})



app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({ // when you use return, the code stops executing after this statement. I.e. it doesn't try and sende the second resoponse below. You can't send two responses
            errorMessage: 'you must provide a search term!'
        })
    } 
    console.log(req.query)
    res.send({
    products: []
    })

})
   


 app.get('/help/*', (req, res) => { // here I set up a more specific 404 page. If a document in the help folder cant be found this message will be send
    res.render('404', { // I render the dynamic page 404 from views.
        title: '404', 
        message: 'help article not found' // I customize the dynamic message that is injected into 404 in this object
    })
 })

 app.get('*', (req, res) => { // here I set up a 404 page. It has to be at the end because express stops looking when it finds a match. * means every path that hasn't been found in the document.
     res.render('404', {
         message: 'Page not found!',
         title: '404'
     })
 })

 // app.com (root directory)
 // app.com/help
 // app.com/about
 // app.com/weather

app.listen(3000, () => { // i app listen funktionen indtaster jeg portnummer som det første argument, og (valgfrit) indtaster jeg en callback funktion som det andet argument - funktionen skrive her at serveren kører. beskeden kommer ikke frem i browseren til clienten men den kan bruges for at se at det virker bag scenen?
    console.log('server is up on port 3000')
})