import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 59.91, lng: 10.73},
  zoom: 15
}

function loadPlaces(map, lat = 59.91, lng = 10.73) {
  axios.get(`/api/statues/near?lat=${lat}&lng=${lng}`)
  .then(res =>{
    const statues = res.data;
    console.log(statues);
  })
};

function makeMap(mapDiv) {
  if(!mapDiv) return;
  //make map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
};

export default makeMap;
