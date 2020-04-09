var AUTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AU_model_tract.GeoJSON";

var brew = new classyBrew();
var values = [];

/*
function BrewColor(feature) {
    return d > 100000 ? '#481567FF' :
           d > 50000  ? '#453781FF' :
           d > 10000  ? '#33638DFF' :
           d > 1000  ? '#287D8EFF' :
           d > 500   ? '#20A387FF' :
           d > 100   ? '#3CBB75FF' :
           d > 10   ? '#95D840FF' :
                      '#DCE319FF';
} */

$.ajax(AUTract).done(function(data) {
     parsedData = JSON.parse(data);})

for (var i = 0; i < parsedData.features.length; i++){
    if (parsedData.features[i].properties['ORIGINS_CNT'] == null) continue;
    values.push(parsedData.features[i].properties['ORIGINS_CNT']);
};
brew.setSeries(values);
brew.setNumClasses(5);
brew.setColorCode("YlGnBu");
brew.classify("quantile"); //equal_interval, jenks, quantile

function AustinStyle(feature) {
    return {
        fillColor: brew.getColorInRange(feature.properties.ORIGINS_CNT),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


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
    }
}

function resetHighlight(e) {
    featureGroup.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
//        layer.myTag = "myGeoJSON",
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

$(document).ready(function() {
  $.ajax(AUTract).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: AustinStyle,
      onEachFeature: onEachFeature
  }).addTo(map)})});

/*
$(document).ready(function() {
  $.ajax(AUTract).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      onEachFeature: onEachFeature,
      style: AustinStyle}).bindPopup("Origins count: " + feature.properties.ORIGINS_CNT);
  }).addTo(map)}); */
