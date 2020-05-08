var AUTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AU_model_tract.GeoJSON";

var brew = new classyBrew();
var values = [];


$(document).ready(function() {
  $.ajax(AUTract).done(function(data) {
    var parsedData = JSON.parse(data);
    for (var i = 0; i < parsedData.features.length; i++){
        if (parsedData.features[i].properties['ORIGINS_CNT'] == null) continue;
        values.push(parsedData.features[i].properties['ORIGINS_CNT']);
    };
    brew.setSeries(values);
    brew.setNumClasses(9);
    brew.setColorCode("YlGnBu");
    brew.classify("jenks"); //equal_interval, jenks, quantile
    featureGroup = L.geoJson(parsedData, {
      style: brewStyle,
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
