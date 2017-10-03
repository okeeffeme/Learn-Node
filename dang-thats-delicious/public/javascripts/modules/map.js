import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 59.91, lng: 10.73},
  zoom: 13
}

function loadPlaces(map, lat = 59.91, lng = 10.73) {
  axios.get(`/api/statues/near?lat=${lat}&lng=${lng}`)
  .then(res =>{
    const places = res.data;
    if(!places.length) {
      alert('No statues found.');
      return;
    }

    const infoWindow = new google.maps.InfoWindow();

    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      const position = { lat: placeLat, lng: placeLng };
      const marker = new google.maps.Marker({ map, position });
      marker.place = place;
      return marker;
    });

    //handle infoWindow
    markers.forEach(marker => marker.addListener('click', function() {
      const html = `
        <div class="popup">
          <a href="/statue/${this.place.slug}">
            <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.title}" />
            <p><strong>${this.place.title}</strong></p>
            <p>${this.place.artist}</p>
          </a>
        </div>
      `;
      infoWindow.setContent(html);
      infoWindow.open(map, this);
    }));

  });
};

function makeMap(mapDiv) {
  if(!mapDiv) return;
  //make map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);
  //Autocomplete for search input
  //const input = $('[name="geolocate"]');
  //const autocomplete = new google.maps.places.Autocomplete(input);
};

export default makeMap;
