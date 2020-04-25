//
// var AUcenter = [30.268901, -97.757853];
// var CHcenter = [41.875709, -87.653920];
// var DCcenter = [38.900307, -77.030205];
// var KCcenter = [39.066655, -94.583235];
// var LVcenter = [38.232967, -85.751524];
// var MNPcenter = [44.975745, -93.262489];
//
// var map = L.map('map', {
//   center: LVcenter,
//   zoom: 12
// });
//
// var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 20,
//   ext: 'png'
// }).addTo(map);
//
// var featureGroup;
//
// function Action() {
//             alert('HELLO');
//         }

// function toBottom() {
//   console.log("click success");
//   document.body.scrollTop = 0;
//   document.documentElement.scrollTop = 0;
// }


jQuery(document).ready(function() {

  var toBottom = $('#aboutUs');
  var toTop = $('#toTop');

  toBottom.on('click', function(e) {
    console.log("click success")
    e.preventDefault();
    $('html, body, ui-view, div').animate({scrollTop: 1200}, '300');
  });

  toTop.on('click', function(e) {
    console.log("click success")
    e.preventDefault();
    $('html, body, ui-view, div').animate({scrollTop: 0}, '300');
  });

});
