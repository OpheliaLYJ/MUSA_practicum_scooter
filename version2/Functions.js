/*
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
}; */


//Remove layers
var removeMarkers = function() {
  map.eachLayer(function(layer) {
    if ( layer.myTag &&  layer.myTag === "myGeoJSON") {
            map.removeLayer(layer)}
          });
};

var removeTracts = function() {
  map.eachLayer(function(layer) {
    if ( layer.myTag &&  layer.myTag === "tract") {
            map.removeLayer(layer)}
          });
};


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    };
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    featureGroup.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.myTag = "tract";
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    })
    layer.bindPopup('<p>'+"Predicted scooter trips count: " + feature.properties["PREDICTED.CNT"]
  + '<br>' + "Number of jobs: " + feature.properties.JOBS_IN_TRACT
  + '<br>' + "Percentage of white resident: " + feature.properties.PWHITE
  + '</p>');
};

function brewStyle(feature) {
    return {
        fillColor: brew.getColorInRange(feature.properties[var_display]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function dropdown_fuction() {
  document.getElementById("cityDropdown").classList.toggle("show");
}
