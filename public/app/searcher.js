
/* globals google, document */

class Searcher {

  setLocation(lat, long) {
    this.location = new google.maps.LatLng(lat, long);
    return this;
  }

  getService() {
    return (this.service = this.service || new google.maps.places.PlacesService(this.map));
  }

  loadLocations(req) {
    if(!req.name) throw 'Request needs a name!';

    req.location = this.location = req.location || this.location;
    req.radius = req.radius || 5000;
    req.types = req.types && req.types.length ? req.types : ['food'];

    this.map = this.map || new google.maps.Map(document.getElementById('map'), {
      center: this.location,
      zoom: 15
    });

    return new Promise((res, rej) => {
      this.getService().nearbySearch(req, function(results, status) {
        if(status !== google.maps.places.PlacesServiceStatus.OK) {
          rej(results);
        }
        else {
          res(results);
        }
      });
    });
  }

}

module.exports = Searcher;
