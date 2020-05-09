var city_data = JCTract;

var resetMap = function(){
  map.setView(JCcenter, 12);
  $('#button-resetMap').hide();
}

$('#button-resetMap').click(resetMap);

var_display = "PREDICTED.CNT"
loadSlide()

document.getElementById("selectVar").onchange = function () {
  var_display = document.getElementById("selectVar").value;
  selected = {}
  console.log(var_display);
        removeTracts();
        loadSlide();
        resetApplication();
}
