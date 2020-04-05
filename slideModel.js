//Load & process JSON dataset
var AUCentroid = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AU_model_centorid.GeoJSON";

var AUcenter = [30.268901, -97.757853];
var DCcenter = [38.900307, -77.030205];

$(document).ready(function() {
  $.ajax(AUCentroid).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      onEachFeature: function (feature, layer) { //add a tag (easy to remove)
            layer.myTag = "myGeoJSON"},
//      filter: myFilter, //apply filter
      pointToLayer: function (feature, latlng) { //convert point to layer
        return L.circleMarker(latlng, {radius: feature.properties.ORIGINS_CNT/5000})
        .bindPopup("Origins count: " + feature.properties.ORIGINS_CNT);
    }
  }).addTo(map)})});


var slides = [
  //morning trips
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description1",
  city: 'Austin', color: "#fed352", zoom: 13, center: AUcenter, data: AUCentroid},
  //morning trips
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description2",
  city: 'Louisville', color: "#e46c4d", zoom: 13, center: AUcenter, data: AUCentroid},
  //afternoon trips
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description3",
  city: 'Washington D.C.', color: "#02bbca", zoom: 13, center: AUcenter, data: AUCentroid},
  //afternoon trips
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description4",
  city: 'Chicago', color: "#175a94", zoom: 13, center: AUcenter, data: AUCentroid},
  //long trips (longer than 1.5mile)
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description5",
  city: 'Minneapolis', color: "#99d45d", zoom: 13, center: AUcenter, data: AUCentroid},
  //long trips (longer than 30 minutes)
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description6",
  city: 'Kansas City', color: "#9979c1", zoom: 13, center: AUcenter, data: AUCentroid}
];

var loadSlide = function(slide) {
  $('#title').text(slide.title);
  $('#description').text(slide.description);
  map.setView(slide.center, slide.zoom);
//  $('#sidebar').css("background-color", slide.color);
//  $('#filter').text(slide.filter);
//  document.getElementById('myScript').src = slide.source;
};

//loadSlide(slides[0]);

var currentSlide = 0;
if (currentSlide != 0){
  $('#lastButton').show()
}else{$('#lastButton').hide()};

var next = function(){
  currentSlide = currentSlide + 1;
  if (currentSlide != slides.length - 1){
    $('#nextButton').show();
  }else{
    $('#nextButton').hide();
  }
  loadSlide(slides[currentSlide]);
  removeMarkers();

  $(document).ready(function() {
    $.ajax(slides[currentSlide].data).done(function(data) {
      var parsedData = JSON.parse(data);
      map.on('zoomend', function zoomendEvent(ev) {
        var currentZoomLevel = ev.target.getZoom(),
    mapDiv = map.getContainer(),
    minZoomToShowPtLayer = 11; // or whatever

  if (currentZoomLevel >= minZoomToShowPtLayer) {
    mapDiv.classList.add('hide-point-layer');
  } else {
    mapDiv.classList.remove('hide-point-layer');
  }
});
      featureGroup = L.geoJson(parsedData, {
        onEachFeature: function (feature, layer) { //add a tag (easy to remove)
              layer.myTag = "myGeoJSON"},
//        filter: window[slides[currentSlide].filter], //apply filter
        pointToLayer: function (feature, latlng) { //convert point to layer
          return L.circleMarker(latlng, {radius: feature.properties.ORIGINS_CNT/5000, color: slides[currentSlide].color})
//          .bindPopup("Start time: " + feature.properties.START_TIME + "<br>End time: " + feature.properties.END_TIME);
      }
      }).addTo(map);
//      featureGroup.eachLayer(addDuration);
    });
  });
};

var previous = function(){
  currentSlide = currentSlide - 1;
  if (currentSlide == 0){
    $('#lastButton').hide();

//    loadSlide(slides[0]);
  }else{
    $('#lastButton').show();
  };
  loadSlide(slides[currentSlide]);
  removeMarkers();
  $(document).ready(function() {

    $.ajax(slides[currentSlide].data).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
        onEachFeature: function (feature, layer) { //add a tag (easy to remove)
              layer.myTag = "myGeoJSON";
            },
//        filter: window[slides[currentSlide].filter], //apply filter
        pointToLayer: function (feature, latlng) { //convert point to layer
          return L.circleMarker(latlng, {radius: feature.properties.ORIGINS_CNT/5000, color: slides[currentSlide].color})
//          .bindPopup("Start time: " + feature.properties.START_TIME + "<br>End time: " + feature.properties.END_TIME);
      }
      }).addTo(map);
    });
  });
};

$('#nextButton').click(function(e) {
  next();
  if (currentSlide != 0){
    $('#lastButton').show()
  }else{$('#lastButton').hide()};
});

$('#lastButton').click(function(e) {
  previous();
  if (currentSlide != slides.length){
    $('#nextButton').show()} else{$('#nextButton').hide()}
});
