//This function calculate trip durations (in minute) for scooter trips
var addDuration = function(layer) {
  layer.feature.properties.DURATION = moment(layer.feature.properties.END_TIME, 'dd/mm/yyyy hh:mm').diff(
    moment(layer.feature.properties.START_TIME, 'dd/mm/yyyy hh:mm'), 'minutes', true);
  console.log(layer.feature)
};

//This function filter the trips with
var myFilter = function(feature) {
    return feature.properties.TRIP_LENGTH !== ' '
};

//This function defines the style of the marker
var Austin_circle = {
  radius: 5,
  fillColor: "#fed352",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};


//This function filter the trips taking place in morning peak hours (7-9)
var morning = function(feature) {
  var morningBegin = moment('1/6/2019 6:59', 'dd/mm/yyyy hh:mm');
  var morningEnd = moment('1/6/2019 9:01', 'dd/mm/yyyy hh:mm');
  return moment(feature.properties.START_TIME, 'dd/mm/yyyy hh:mm').isBetween(morningBegin, morningEnd);
};


//This function filter the trips with distance longer than 1.5 mile
var longTrip = function(feature) {
  return feature.properties.TRIP_LENGTH > 1.5;
};


//Remove layers
var removeMarkers = function() {
  map.eachLayer(function(layer) {
    if ( layer.myTag &&  layer.myTag === "myGeoJSON") {
            map.removeLayer(layer)}
          });
};

var AustinColor = function (d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}
