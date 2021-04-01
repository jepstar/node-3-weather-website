const request = require('request') //to make a HTML request I use the NPM module called request.


const forecast = (latitude, longitude, callback) => {
    const urlForc =  'http://api.weatherstack.com/current?access_key=419b83e01a32c8723201db8a92c79b9e&query=' + latitude + ',' + longitude + '&units=f'

    request({ url: urlForc, json: true }, (error, response) => {
      if (error) {
          callback('Cannot connect to Weather Stack. Please, check your internet connection!', undefined)
      } else if (response.body.error) {
          callback('Unable to find location', undefined)
      } else {
          callback(undefined, response.body.current.weather_descriptions[0] + '. Its is currently ' + response.body.current.temperature + ', but it feels like ' +  response.body.current.feelslike + '. Wind speed: ' + response.body.current.wind_speed)
      }
    })
  } 

  module.exports = forecast