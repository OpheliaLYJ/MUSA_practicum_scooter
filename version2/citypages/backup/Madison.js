//Load & process JSON dataset
var AUTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AU_model_tract.GeoJSON";
var CHTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/CH_model_tract.GeoJSON";
var DCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/DC_model_tract.GeoJSON";
var KCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/KC_model_tract.GeoJSON";
var LVTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/LV_model_tract.GeoJSON";
var MNPTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/MNP_model_tract.GeoJSON";
var PHTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/PH_model_tract.GeoJSON";
var MDTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/MD_model_tract.GeoJSON";

var AUcenter = [30.268901, -97.757853];
var CHcenter = [41.875709, -87.653920];
var DCcenter = [38.900307, -77.030205];
var KCcenter = [39.066655, -94.583235];
var LVcenter = [38.232967, -85.751524];
var MNPcenter = [44.975745, -93.262489];
var PHcenter = [39.995668, -75.137520];
var MDcenter = [43.095655, -89.410670];

var values;
var brew;
var info = L.control();
var legend;
var city;
var var_display;
var zipped
var mapped
var ctx = document.getElementById('myChart').getContext('2d')
var selected
var rest
var scatterChart
var city_data = MDTract;

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

var loadSlide = function() {
  // console.log("this city is " + city)
  // $('#title').text(slide.title);
  // $('#description').text(slide.description);
   //map.setView(DCcenter, 13);
  $(document).ready(function() {
    $.ajax(city_data).done(function(data) {
      var parsedData = JSON.parse(data);

      var x_var = _.map(parsedData.features, function(eachFeature) {return eachFeature.properties[var_display]})
      var trips = _.map(parsedData.features, function(eachFeature) {return eachFeature.properties["PREDICTED.CNT"]})

      zipped = _.zip(x_var, trips)
      mapped = _.map(zipped, function(arr) {
        return {x: arr[0], y: arr[1]}
      })

    //  select = {}

  //    selected = [_.head(mapped)] // [mapped[0]]
      rest = _.filter(mapped, function(each) {
        if (selected) {
          return each.x !== selected.x || each.y !== selected.y
        }
        else {return true}
      })

      if (scatterChart) scatterChart.destroy()
      create_chart(selected, rest)

  /*    if (var_display !== "PREDICTED.CNT") {
        create_chart(selected, rest)
      } else {
        selected = {}
        rest = []
        create_chart(selected, rest)
      } */

      values = [];
      for (var i = 0; i < parsedData.features.length; i++){
          if (parsedData.features[i].properties[var_display] == null) continue;
          values.push(parsedData.features[i].properties[var_display]);
      };
      brew = new classyBrew();
      brew.setSeries(values);
      brew.setNumClasses(5);
      if (var_display == "PREDICTED.CNT") {
        brew.setColorCode("YlGnBu");
      } else {brew.setColorCode("RdPu");}
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
      if(var_display == "PREDICTED.CNT" || var_display == "JOBS_IN_TRACT"
      || var_display == "MEDRENT" || var_display == "TOTHSEUNI"
    || var_display == "MEDVALUE" || var_display == "MDHHINC" || var_display == "TOTPOP") {
        this._div.innerHTML = '<h4>Value</h4>' +  (props ?
            '<b>' + props.GEOID + '</b><br />' + Math.round(props[var_display])
            : 'Hover over a census tract');
      } else {
        this._div.innerHTML = '<h4>Value</h4>' +  (props ?
            '<b>' + props.GEOID + '</b><br />' + (Math.round(props[var_display] * 100) / 100).toFixed(2)
            : 'Hover over a census tract');
      }
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

      // loop through variable intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          if (var_display == "PREDICTED.CNT" || var_display == "JOBS_IN_TRACT"
          || var_display == "MEDRENT" || var_display == "TOTHSEUNI"
          || var_display == "MEDVALUE" || var_display == "MDHHINC" || var_display == "TOTPOP") {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + brew.getColorInRange(grades[i]) + '"></i> ' +
                Math.round(grades[i]) + ((grades[i + 1]) ? '&ndash;' + Math.round(grades[i + 1]) : '+'));
          } else {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + brew.getColorInRange(grades[i]) + '"></i> ' +
                (Math.round(grades[i] * 100) / 100).toFixed(2) + ((grades[i + 1]) ? '&ndash;' +(Math.round(grades[i+1] * 100) / 100).toFixed(2) : '+'));
      //      (Math.round(grades[i] * 100) / 100).toFixed(2);
       }

      };
      div.innerHTML = labels.join('<br>');
      return div;
    };
    legend.addTo(map);
    });
  });
};

var_display = "PREDICTED.CNT"
loadSlide()


document.getElementById("selectVar").onchange = function () {
  var_display = document.getElementById("selectVar").value;
  selected = {}
  console.log(var_display);
  // for (var i = 0; i < slides.length; i++){
  //     if (city != slides[i].city) continue;
  //     else {
  //       console.log("found " + i)
  //       currentSlide = i;
        removeTracts();
        loadSlide();
//  };};
}

// Get the modal
var equityModal = document.getElementById("equity-Modal");
var guideModal = document.getElementById("guide-Modal");

// Get the button that opens the modal
var equityBtn = document.getElementById("button-equity");
var guideBtn = document.getElementById("button-guide");

// Get the <span> element that closes the modal
var equitySpan = document.getElementById("close-equity");
var guideSpan = document.getElementById("close-guide");
