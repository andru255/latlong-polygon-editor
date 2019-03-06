// create from source 
var btnCreatePolygon = document.getElementById("btnCreatePolygon"); 

function SourceView() {
  this.txtCoords = document.getElementById("txtCoords");
  this.callbacks = {
    submit: (coords) => {}
  };
}

SourceView.prototype.init = function(defaultCoords) {
    this.coordsToText(defaultCoords);
    btnCreatePolygon.addEventListener("click", (evt) => {
      var coords = this.textToCoords();
      this.callbacks.submit(coords);
    });
}

SourceView.prototype.on = function(name, fn) {
    this.callbacks[name] = fn;
}

SourceView.prototype.coordArrayObjectToText = function(coordArrayObject) {
    this.txtCoords.value = coordArrayObject.map((coordObject) => {
        return [coordObject.lat, ",", coordObject.lng, ";"].join("");
    }).join("");
}

SourceView.prototype.coordsToText =  function(coords) {
    this.txtCoords.value = coords.map((coord) => {
        return [coord[0], ",", coord[1], ";"].join("");
    }).join("");
}

SourceView.prototype.textToCoords = function() {
    var text = this.txtCoords.value;
    var result = text.match(/(-?[0-9.])+/g);
    var output = [];
    if ( result == null) {
        return []; 
    }
    if ( result.length % 2 != 0 ) {
        return [];
    } 
    return result.reduce((prevValue, currentValue, index) => {
        if (index % 2 === 0) {
            output.push(result.slice(index, index + 2));
        }
        return output;
    }, []);
}
