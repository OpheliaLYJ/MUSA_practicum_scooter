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
        fillOpacity: 0.2
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
  $('#button-resetMap').show();
//  console.log(e.target.getBounds()._northEast, e.target.getBounds()._southWest);
  map.fitBounds(e.target.getBounds().pad(Math.sqrt(2) / 8));

}


var city_pop = $('#tb-pop').text()
var city_pred = $('#tb-pred').text()
var city_white = $('#tb-white').text()
var city_jobs = $('#tb-jobs').text()
var city_mdinc = $('#tb-mdinc').text()
var city_mdvalue = $('#tb-mdvalue').text()

var resetApplication = function() {
  $('#tb-title').text("City Overview")
  $('#tb-pct').text("")
  $('#tb-pop').text(city_pop)
  $('#tb-pred').text(city_pred)
  $('#tb-white').text(city_white)
  $('#tb-jobs').text(city_jobs)
  $('#tb-mdinc').text(city_mdinc)
  $('#tb-mdvalue').text(city_mdvalue)

  $('#tb-tile-pop').text("")
  $('#tb-tile-pred').text("")
  $('#tb-tile-white').text("")
  $('#tb-tile-jobs').text("")
  $('#tb-tile-mdinc').text("")
  $('#tb-tile-mdvalue').text("")

  $('#button-reset').hide();
  selected = {}
  rest = _.filter(mapped, function(each) {
    if (selected) {
      return each.x !== selected.x || each.y !== selected.y
    }
    else {return true}
  })
  scatterChart.data.datasets = [{
      label:"No census tract selected",
      backgroundColor: 'rgb(197,27,138)',
      data: [selected]
  },{
      label: "Data",
      backgroundColor: 'rgb(252,197,192)',
      data: rest
  }]

  scatterChart.update({duration:0})
}

$('#button-reset').click(resetApplication);

function updateTable(e) {
  $('#tb-title').text("Census Tract Overview")
  $('#button-reset').show();
//  console.log(e.target.feature.properties["PREDICTED.CNT"])
  $('#tb-pct').text("Percentile")
  $('#tb-pop').text(e.target.feature.properties["TOTPOP"])
  $('#tb-pred').text(e.target.feature.properties["PREDICTED.CNT"])
  $('#tb-white').text((Math.round(e.target.feature.properties["PWHITE"] * 100) / 100).toFixed(2) + '%')
  $('#tb-jobs').text(e.target.feature.properties["JOBS_IN_TRACT"])
  $('#tb-mdinc').text('$' + e.target.feature.properties["MDHHINC"])
  $('#tb-mdvalue').text('$' + e.target.feature.properties["MEDVALUE"])

  $('#tb-tile-pop').text(e.target.feature.properties["TILE_POP"])
  $('#tb-tile-pred').text(e.target.feature.properties["TILE_PRED"])
  $('#tb-tile-white').text(e.target.feature.properties["TILE_WHITE"])
  $('#tb-tile-jobs').text(e.target.feature.properties["TILE_JOBS"])
  $('#tb-tile-mdinc').text(e.target.feature.properties["TILE_INC"])
  $('#tb-tile-mdvalue').text(e.target.feature.properties["TILE_VALUE"])

  selected = {x: e.target.feature.properties[var_display], y: e.target.feature.properties["PREDICTED.CNT"]}
  rest = _.filter(mapped, function(each) {
    if (selected) {
      return each.x !== selected.x || each.y !== selected.y
    }
    else {return true}
  })
  scatterChart.data.datasets = [{
      label:"Selected",
      backgroundColor: 'rgb(197,27,138)',
      data: [selected]
  },{
      label: "Other",
      backgroundColor: 'rgb(252,197,192)',
      data: rest
  }]

  scatterChart.update({duration:0})
}

function onEachFeature(feature, layer) {
    layer.myTag = "tract";
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function (event) {
          updateTable(event);
          zoomToFeature(event)
        }
    })
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

function create_chart(selected, rest) {
  scatterChart = new Chart(ctx, {
      type: 'scatter',
      data: {
          datasets: [{
              label:"No census tract selected",
              backgroundColor: 'rgb(197,27,138)',
              data: [selected]
          },{
              label: "Data",
              backgroundColor: 'rgb(252,197,192)',
              data: rest
          }]
      },
      options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
              xAxes: [{
                  gridLines: {
                    zeroLineWidth: 1.5,
                    zeroLineColor: "white",
                    lineWidth: 0.5,
                    borderDash: [2, 2],
                    color: "rgb(170, 170, 170)"},
                  type: 'linear',
                  position: 'bottom',
                  ticks: {
                    fontColor: "white"},
                  scaleLabel: {
                    display: true,
                    labelString: $("#selectVar option:selected").text(),
                    fontColor:"white"}
              }],
              yAxes:[{
                  gridLines: {
                    zeroLineWidth: 1,
                    zeroLineColor: "white",
                    lineWidth: 0.5,
                    borderDash: [2, 2],
                    color: "rgb(170, 170, 170)"},
                  type: 'linear',
                  ticks: {
  /*                  max: 45000,
                    min: 0,
                    stepSize: 5000, */
                    fontColor: "white"},
                  scaleLabel: {
                    display: true,
                    labelString: 'Predicted scooter trips',
                    fontColor:"white"}
              }]

          },
          legend: {
            labels: {fontColor: "white"}
          }
      }
  });
}

// When the user clicks on the button, open the modal
equityBtn.onclick = function() {
  equityModal.style.display = "block";
}
/*
equityBtn.onmouseout = function() {
  equityModal.style.display = "none";
} */


guideBtn.onclick = function() {
  guideModal.style.display = "block";
}
/*
// When the user clicks on <span> (x), close the modal
equitySpan.onclick = function() {
  equityModal.style.display = "none";
} */

guideSpan.onclick = function() {
  guideModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == equityModal) {
    equityModal.style.display = "none";
  }
  if (event.target == guideModal) {
    guideModal.style.display = "none";
  }
}
