// elements
var tmplForm = document.getElementById("coordinateForm");
var divTmplForm = document.createElement("div");
divTmplForm.innerHTML = tmplForm.innerHTML;

var coordsContainer = document.getElementById("coordsContainer");
var btnAdd = document.getElementById("addFormCoord");

function CoordView() {
  this.index = 0;
  this.coords = [];
}

CoordView.prototype._prepareDataIn = function(tmpl, coord) {
  tmpl.data = {
    formId: "frm_" + this.index
  };
  var el = tmpl.getElementsByTagName("form")[0];
  el.setAttribute("id", tmpl.data.formId);

  var fieldLat = tmpl.getElementsByClassName("latitude")[0];
  fieldLat.value = coord[0] || "";

  var fieldLng = tmpl.getElementsByClassName("longitude")[0];
  fieldLng.value = coord[1] || "";

  this.index++;
}

CoordView.prototype._onRemoveEventInRow = function(btnRemove, tmpl) {
  btnRemove.addEventListener("click", (evt) => {
    var el = document.getElementById(tmpl.data.formId);
    el.remove();
    evt.preventDefault();
  });
}

CoordView.prototype.createForm = function(container, coord) {
    var tmpl = divTmplForm.cloneNode(true);
    this._prepareDataIn(tmpl, coord || []);
    this._onRemoveEventInRow(tmpl.getElementsByClassName("btn-remove-coord")[0], tmpl);
    container.appendChild(tmpl.getElementsByTagName("form")[0]);
}

CoordView.prototype.render = function(defaultCoords) {
  // load default coords
  defaultCoords.forEach((coord) => {
     this.createForm(coordsContainer, coord);
  });

  btnAdd.addEventListener("click", (evt) => {
    this.createForm(coordsContainer);
    evt.preventDefault();
  });
};