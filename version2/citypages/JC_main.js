var map = L.map('map', {
  center: JCcenter,
  zoom: 12
});

/* fr.hot
var Stamen_TonerLite = L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map); */


/* terrain
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map); */

/* world topo
var Stamen_TonerLite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map); */

/*world grey canvas
var Stamen_TonerLite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map); */

//mapbox customize
//L.mapbox.accessToken = 'pk.eyJ1Ijoib3BoZWxpYWFhIiwiYSI6ImNrOHVsaWs3NDBjOTUzbXBheW9zY2wybmMifQ.J8OQVcuUxnoTI9gvkisyeQ';
//mapbox://styles/opheliaaa/ck9ylje8o0x5z1ipfpgpbji5p
//https://api.mapbox.com/styles/v1/opheliaaa/ck9ylje8o0x5z1ipfpgpbji5p.html?fresh=true&title=copy&access_token=pk.eyJ1Ijoib3BoZWxpYWFhIiwiYSI6ImNrOHVsaWs3NDBjOTUzbXBheW9zY2wybmMifQ.J8OQVcuUxnoTI9gvkisyeQ
/*
var mapbox_base = L.tileLayer('https://api.mapbox.com/styles/v1/opheliaaa/ck9ylje8o0x5z1ipfpgpbji5p/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3BoZWxpYWFhIiwiYSI6ImNrOHVsaWs3NDBjOTUzbXBheW9zY2wybmMifQ.J8OQVcuUxnoTI9gvkisyeQ', {
//  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
//  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
//  ext: 'png'
}).addTo(map); */

var featureGroup;
