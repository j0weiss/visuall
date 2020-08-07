const axios = require('axios');

export default (request, response) => {
  const { lat, long } = request.query;

  axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`)
    .then(responseData => {
      response
        .status(200)
        .send(JSON.stringify({
          city: responseData.data.address.city || responseData.data.address.village
        }));
    })
    .catch(error => {
      console.error(error);
    });
};
