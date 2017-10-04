import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 59.91, lng: 10.73},
  zoom: 13,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"},{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"administrative.neighborhood","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}]
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
      const marker = new google.maps.Marker({
        map,
        position,
        icon: "./images/icons/marker.png"
      });
      marker.place = place;
      return marker;
    });

    //handle infoWindow
    markers.forEach(marker => marker.addListener('click', function() {
      const html = `
        <div id="iw-container">
          <a href="/statue/${this.place.slug}">
          <div class="iw-content" style="background:url(/uploads/${this.place.photo || 'store.png'});background-size:cover;">
            <p>
              <strong>${this.place.title}</strong>
            <br/>${this.place.artist}</p>
          </div>
          </a>
        </div>
      `;
      infoWindow.setContent(html);
      infoWindow.open(map, this);

      // *
        // START INFOWINDOW CUSTOMIZE.
        // The google.maps.event.addListener() event expects
        // the creation of the infoWindow HTML structure 'domready'
        // and before the opening of the infoWindow, defined styles are applied.
        // *

          // Reference to the DIV that wraps the bottom of infoWindow
          var iwOuter = $('.gm-style-iw');

          /* Since this div is in a position prior to .gm-div style-iw.
           * We use jQuery and create a iwBackground variable,
           * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
          */
          iwOuter.previousSibling.className += "Working_class";
          var iwBkgChildren = document.querySelector('.Working_class').children; // [<div class="child1">]

          // Removes background shadow DIV
      //    children.item(1).style.display = "none";

          // Removes white background DIV
        //  iwBkgChildren.item(3).style.background = "green";

          // Moves the infoWindow 115px to the right.
        //  hold.display.left = "20px";

          // Moves the shadow of the arrow 165px to the left margin.
        //  iwBkgChildren.item(0).setAttribute('style', 'width: 0px; height: 0px;border-right: 10px solid transparent;border-left: 10px solid transparent;border-top: 24px solid rgba(0, 0, 0, 0.1);position: absolute;left: 165px;top: 130px;');
          // Moves the arrow 165px to the left margin.
        //  iwBkgChildren.item(2).setAttribute('style', 'border-top-width: 24px;position: absolute;left: 165px;top: 127px;');

          // Changes the desired tail shadow color.
        //  iwBkgChildren.item(2).find('div').children().css({'box-shadow': 'rgba(178, 178, 178, 0.6) 0px 1px 6px', 'z-index' : '1'});

          // Reference to the div that groups the close button elements.
        //  var iwCloseBtn = iwOuter.next();

          // Apply the desired effect to the close button
        //  iwCloseBtn.css({opacity: '1', right: '40px', top: '5px', border: '7px solid #fff', 'border-radius': '13px', 'box-shadow': '0 0 5px #bbb'});

          // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
        //  iwCloseBtn.mouseout(function(){
        //    $(this).css({opacity: '1'});
        //  });

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
