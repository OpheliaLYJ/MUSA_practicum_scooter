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
      if (var_display == "ORIGINS_CNT") {
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
      if(var_display == "ORIGINS_CNT" || var_display == "JOBS_IN_TRACT" || var_display == "MEDRENT") {
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
          if (var_display == "ORIGINS_CNT" || var_display == "JOBS_IN_TRACT" || var_display == "MEDRENT") {
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

loadSlide(slides[currentSlide])

document.getElementById("selectCity").value = "AU";
city = "AU";
var_display = "ORIGINS_CNT"

document.getElementById("selectCity").onchange = function () {
  city = document.getElementById("selectCity").value;
  var_display = document.getElementById("selectVar").value;
  for (var i = 0; i < slides.length; i++){
      if (city != slides[i].city) continue;
      else {
        console.log("found " + i)
        currentSlide = i;
        removeTracts();
        loadSlide(slides[currentSlide]);
  };};

  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
//          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
              label: 'My First dataset',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: values
          }]
      },

      // Configuration options go here
      options: {}
  });

};

document.getElementById("selectVar").onchange = function () {
  city = document.getElementById("selectCity").value;
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


// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 290 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#myChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(slides[currentSlide].data, function(data) {
  console.log(data.features[0].properties[var_display])
  console.log(typeof(data.features[0].properties[var_display]))

// X axis: scale and draw:
var x = d3.scaleLinear()
      .domain([0, ])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Y axis: scale and draw:
var y = d3.scaleLinear()
    .range([height, 0]);
y.domain([0, 0.5]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
    .call(d3.axisLeft(y));

// Compute kernel density estimation
var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
var density =  kde( _.map(function(d){
  console.log(d.features.properties.price);
  return d.features.properties.price; }) )

    // Plot the area
    svg.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
          .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
)

    });


/*
var color = "steelblue";
var chart_values;
chart_values = d3.range(1000).map(d3.random.normal(20, 5));


// A formatter for counts.
var formatCount = d3.format(",.0f");

var max = d3.max(chart_values);
var min = d3.min(chart_values);
var x = d3.scale.linear()
    .domain([min, max])
    .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (chart_values);

var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});
var colorScale = d3.scale.linear()
      .domain([yMin, yMax])
      .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
   .attr("class", "bar")
  .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", function(d) { return colorScale(d.y) });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

*/

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
