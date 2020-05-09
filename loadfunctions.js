//Load & process JSON dataset
//Load & process JSON dataset
var AUTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AU_model_tract.GeoJSON";
var CHTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/CH_model_tract.GeoJSON";
var DCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/DC_model_tract.GeoJSON";
var KCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/KC_model_tract.GeoJSON";
var LVTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/LV_model_tract.GeoJSON";
var MNPTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/MNP_model_tract.GeoJSON";

var AVTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/AV_trimmed.GeoJSON";
var PHTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/PH_trimmed.GeoJSON";
var MDTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/MD_trimmed.GeoJSON";
var HFTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/HF_trimmed.GeoJSON";
var HSTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/HS_trimmed.GeoJSON";
var HSTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/HS_trimmed.GeoJSON";
var JVTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/JV_trimmed.GeoJSON";
var JCTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/JC_trimmed.GeoJSON";
var OMTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/OM_trimmed.GeoJSON";
var RLTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/RL_trimmed.GeoJSON";
var SATract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/SA_trimmed.GeoJSON";
var SYTract = "https://raw.githubusercontent.com/OpheliaLYJ/MUSA_practicum_scooter/master/data/SY_trimmed.GeoJSON";


var AUcenter = [30.268901, -97.757853];
var CHcenter = [41.875709, -87.653920];
var DCcenter = [38.900307, -77.030205];
var KCcenter = [39.066655, -94.583235];
var LVcenter = [38.232967, -85.751524];
var MNPcenter = [44.975745, -93.262489];

var AVcenter = [35.56043987701201, -82.54337310791014];
var PHcenter = [39.995668, -75.137520];
var MDcenter = [43.094966325413374, -89.36519622802733];
var HFcenter = [41.77233588526917, -72.68400192260742];
var HScenter = [29.8382614512946, -95.36064147949217];
var JVcenter = [30.323100460201648, -81.62635803222656];
var JCcenter = [40.73268976628568, -74.0669059753418];
var OMcenter = [41.2824505509628, -96.16024017333984];
var RLcenter = [35.86401314517181, -78.60614776611327];
var SAcenter = [29.452752317036307, -98.50547790527344];
var SYcenter = [43.03577208929465, -76.1436653137207];

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

// Get the modal
var equityModal = document.getElementById("equity-Modal");
var guideModal = document.getElementById("guide-Modal");

// Get the button that opens the modal
var equityBtn = document.getElementById("button-equity");
var guideBtn = document.getElementById("button-guide");

// Get the <span> element that closes the modal
var equitySpan = document.getElementById("close-equity");
var guideSpan = document.getElementById("close-guide");


var loadSlide = function() {
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
        this._div.innerHTML = '<h4>' + $("#selectVar option:selected").text() + '</h4>' +  (props ?
            'Census Tract: ' + props.GEOID + '<br><b>Value: ' + Math.round(props[var_display]) + '</b>'
            : 'Hover over a census tract');
      } else {
        this._div.innerHTML = '<h4>' + $("#selectVar option:selected").text() + '</h4>' +  (props ?
            'Census Tract: ' + props.GEOID + '<br><b>Value: ' + (Math.round(props[var_display] * 100) / 100).toFixed(2) + '</b>'
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
      for (var i = 0; i < grades.length-1; i++) {
          if (var_display == "PREDICTED.CNT" || var_display == "JOBS_IN_TRACT"
          || var_display == "MEDRENT" || var_display == "TOTHSEUNI"
          || var_display == "MEDVALUE" || var_display == "MDHHINC" || var_display == "TOTPOP") {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + brew.getColorInRange(grades[i] + 1) + '"></i> ' +
                Math.round(grades[i]) + '&ndash;' + Math.round(grades[i + 1]));
          } else {
            div.innerHTML +=
            labels.push(
                '<i style="background:' + brew.getColorInRange(grades[i] + 0.1) + '"></i> ' +
                (Math.round(grades[i] * 100) / 100).toFixed(2) + '&ndash;' +(Math.round(grades[i+1] * 100) / 100).toFixed(2));
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
