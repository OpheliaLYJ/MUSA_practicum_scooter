var map = L.map('map', {
  center: AUcenter,
  zoom: 13
});

//Load & process JSON dataset
var AUTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AU_model_tract.GeoJSON";
var CHTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/CH_model_tract.GeoJSON";
var DCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/DC_model_tract.GeoJSON";
var KCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/KC_model_tract.GeoJSON";
var LVTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/LV_model_tract.GeoJSON";
var MNPTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/MNP_model_tract.GeoJSON";

var AUcenter = [30.268901, -97.757853];
var CHcenter = [41.875709, -87.653920];
var DCcenter = [38.900307, -77.030205];
var KCcenter = [39.066655, -94.583235];
var LVcenter = [38.232967, -85.751524];
var MNPcenter = [44.975745, -93.262489];

var values;
var brew;
var info = L.control();
var legend;
var currentSlide = 0;
var city;
var var_display;

var slides = [
  //morning trips
  { title: "Scooter trip origins in each census tract, Austin, July - September, 2019", description: "Description1",
  city: 'AU', color: "#fed352", zoom: 13, center: AUcenter, data: AUTract, divide: 5000},
  //morning trips
  { title: "Scooter trip origins in each census tract, Chicago, July - September, 2019", description: "Description2",
  city: 'CH', color: "#e46c4d", zoom: 13, center: CHcenter, data: CHTract, divide: 1000},
  //afternoon trips
  { title: "Scooter trip origins in each census tract, Washington D.C., July - September, 2019", description: "Description3",
  city: 'DC', color: "#02bbca", zoom: 13, center: DCcenter, data: DCTract, divide: 3000},
  //afternoon trips
  { title: "Scooter trip origins in each census tract, Kansas City, July - September, 2019", description: "Description4",
  city: 'KC', color: "#175a94", zoom: 13, center: KCcenter, data: KCTract, divide: 3000},
  //long trips (longer than 1.5mile)
  { title: "Scooter trip origins in each census tract, Louisville, July - September, 2019", description: "Description5",
  city: 'LV', color: "#99d45d", zoom: 13, center: LVcenter, data: LVTract, divide: 5000},
  //long trips (longer than 30 minutes)
  { title: "Scooter trip origins in each census tract, Minneapolis, July - September, 2019", description: "Description6",
  city: 'MNP', color: "#9979c1", zoom: 13, center: MNPcenter, data: MNPTract, divide: 1000}
];

var loadSlide = function(slide) {
  console.log("this city is " + city)
  $('#title').text(slide.title);
  $('#description').text(slide.description);
  map.setView(slide.center, slide.zoom);
  $(document).ready(function() {
    $.ajax(slide.data).done(function(data) {
      var parsedData = JSON.parse(data);
      values = [];
      for (var i = 0; i < parsedData.features.length; i++){
          if (parsedData.features[i].properties[var_display] == null) continue;
          values.push(parsedData.features[i].properties[var_display]);
      };
      /*
      for (var i = 0; i < parsedData.features.length; i++){
          if (parsedData.features[i].properties['ORIGINS_CNT'] == null) continue;
          values.push(parsedData.features[i].properties['ORIGINS_CNT']);
      }; */
      brew = new classyBrew();
      brew.setSeries(values);
      brew.setNumClasses(9);
      brew.setColorCode("YlGnBu");
      brew.classify("jenks"); //equal_interval, jenks, quantile
      featureGroup = L.geoJson(parsedData, {
        style: brewStyle,
        onEachFeature: onEachFeature
    }).addTo(map);

    //Add info control
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Value</h4>' +  (props ?
            '<b>' + props.GEOID + '</b><br />' + Math.round(props.ORIGINS_CNT)
            : 'Hover over a census tract');
    };
    info.addTo(map);

    //Remove existing legend
    if (legend) {
      console.log("legend exists on previous page");
        map.removeControl(legend);}
    //Add custom legend
    legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = brew.breaks,
          labels = [];

      // loop through origin_cnt intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          labels.push(
              '<i style="background:' + brew.getColorInRange(grades[i]) + '"></i> ' +
              Math.round(grades[i]) + (grades[i + 1] ? '&ndash;' + Math.round(grades[i + 1]) : '+'));
      };
      div.innerHTML = labels.join('<br>');
      return div;
    };
    legend.addTo(map);
    });
  });
};

loadSlide(slides[currentSlide])

document.getElementById("selectCity").value = "AU";
city = "AU";
var_display = "ORIGINS_CNT"
document.getElementById("selectCity").onchange = function () {
  city = document.getElementById("selectCity").value;
};

document.getElementById("selectVar").onchange = function () {
  var_display = document.getElementById("selectVar").value;
  console.log(var_display);
  for (var i = 0; i < slides.length; i++){
      if (city != slides[i].city) continue;
      else {
        console.log("found " + i)
        currentSlide = i;
        removeTracts();
        loadSlide(slides[currentSlide]);
  };};
}
