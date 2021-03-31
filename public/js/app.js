console.log('Client side js is executed here')


const weatherForm = document.querySelector('form') // here you select the form element in index.html
const search = document.querySelector('input')
messageOne = document.querySelector('#message-1') // here I set the paragraf with id="message-1" to be a variable called messageOne in my code
messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => { // I add an eventlistener to the form. When It is submitted, the callback function runs. Forms automatically refreshes after submitting the form - this is undesireable and we need to change that by adding the e-object and e.preventDefeault(). 
    e.preventDefault() 
    const location = search.value //here I create a new variable that extracts the value of the input field (search)
    const url = 'http://localhost:3000/weather?address=' + location // here I concatonate a url to be used below with fetch

    messageOne.textContent = 'loading' // here I can write a message which displays while the data is being fetched
    messageTwo.textContent = ''

    fetch(url).then((response) => { // use fetch to make a client side request to a server. First the data from the url is fetched. Then the data is passed on to the resoponse in the promise. After that the resonse is turned into json and passed onto the parameter 'data'. The data is then written in the console. You can see it in Chrome > developer tools > console
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = data.forecastData
            }   
        })
    })
})

