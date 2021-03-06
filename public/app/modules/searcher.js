
/* globals google, document */

class Searcher {

  constructor(location = {}) {
    const { lat, long } = location;
    if(lat && long)
      this.setLocation({lat, long});
  }

  setLocation({lat = '', long = ''}) {
    if(!lat || !long)
      throw 'Need to provide latitude and longitude values!';
    this.location = new google.maps.LatLng(lat, long);
    return this;
  }

  getService() {
    return (this.service = this.service || new google.maps.places.PlacesService(this.map));
  }

  loadLocations(req = {}) {
    req.location = this.location = req.location || this.location;
    req.radius = req.radius || 10000;
    req.type = req.type || 'restaurant';
    req.name = `${req.name || ''} -lodging`;

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
