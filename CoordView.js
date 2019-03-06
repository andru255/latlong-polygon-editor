// elements
var tmplForm = document.getElementById("coordinateForm");
var divTmplForm = document.createElement("div");
divTmplForm.innerHTML = tmplForm.innerHTML;

var coordsContainer = document.getElementById("coordsContainer");
var btnAdd = document.getElementById("addFormCoord");

function CoordView(callbacks) {
  this.index = 0;
  this.templateDataCollector = {};
  var that = this;
  this.callbacks = {
    removeRow: (data) => {},
    editRow: (data) => {}
  };
}

CoordView.prototype.init = function(defaultCoords) {
  // load default coords
  defaultCoords.forEach((coord) => {
     this.createForm(coordsContainer, coord);
  });

  btnAdd.addEventListener("click", (evt) => {
    this.createForm(coordsContainer);
    evt.preventDefault();
  });
};

CoordView.prototype.on = function(name, fn) {
  this.callbacks[name] = fn;
}

CoordView.prototype._prepareDataIn = function(tmpl, coord) {
  var latitude = coord[0] || "";
  var longitude = coord[1] || "";

  tmpl.data = {
    index: this.index,
    formId: "frm_" + this.index,
    latitude: latitude,
    longitude: longitude
  };

  var el = tmpl.getElementsByTagName("form")[0];
  el.setAttribute("id", tmpl.data.formId);

  var fieldLat = tmpl.getElementsByClassName("latitude")[0];
  fieldLat.value = latitude;

  var fieldLng = tmpl.getElementsByClassName("longitude")[0];
  fieldLng.value = longitude;

  this.templateDataCollector[this.index] = tmpl.data;
  this.index++;
}

CoordView.prototype._onRemoveEventInRow = function(btnRemove, tmpl) {
  btnRemove.addEventListener("click", (evt) => {
    var el = document.getElementById(tmpl.data.formId);
    el.remove();
    delete this.templateDataCollector[tmpl.data.index];
    this.callbacks.removeRow(this._dataToCoords());
    evt.preventDefault();
  });
}

CoordView.prototype._bindKeyUpEvent = function(input, tmpl) {
  var fieldLat = tmpl.getElementsByClassName("latitude")[0];
  var fieldLng = tmpl.getElementsByClassName("longitude")[0];
  var regexValidCoord = /^\-?[0-9]{1,2}(.[0-9]+)?$/;

  input.addEventListener("keyup", (evt) => {
     var data = tmpl.data;
     if ( regexValidCoord.test(fieldLat.value) && regexValidCoord.test(fieldLng.value) ) {
        data.latitude = parseFloat(fieldLat.value);
        data.longitude = parseFloat(fieldLng.value);
        tmpl.data = data;
        this.templateDataCollector[tmpl.data.index] = tmpl.data;
        this.callbacks.editRow(this._dataToCoords());
        return;
     }
     data.latitude = undefined;
     data.longitude = undefined;
     tmpl.data = data;
     this.callbacks.editRow(this._dataToCoords());
  });
}

CoordView.prototype.createForm = function(container, coord) {
  var tmpl = divTmplForm.cloneNode(true);
  this._prepareDataIn(tmpl, coord || []);
  this._bindKeyUpEvent(tmpl.getElementsByClassName("latitude")[0], tmpl);
  this._bindKeyUpEvent(tmpl.getElementsByClassName("longitude")[0], tmpl);
  this._onRemoveEventInRow(tmpl.getElementsByClassName("btn-remove-coord")[0], tmpl);
  container.appendChild(tmpl.getElementsByTagName("form")[0]);
}

CoordView.prototype._dataToCoords = function() {
  var result = [];
  for ( var key in this.templateDataCollector ) {
    let item = this.templateDataCollector[key];
    if ( typeof item.latitude !== "undefined"  || typeof item.latitude !== "undefined") {
      result.push([item.latitude, item.longitude]);
    }
  }
  return result;
}