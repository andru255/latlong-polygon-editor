var coordView = new CoordView();

// tabs
var lnkCoords = document.getElementById("coordsView");
var lnkSource = document.getElementById("sourceView");

// reset 
var btnCreatePolygon = document.getElementById("btnCreatePolygon"); 

// message container
var containerMessage = document.getElementById("messages");

// setup mapbox
var defaultCoords = [
    [40.1203004066151,-74.57656860351564], 
    [39.9636486317804,-74.75509643554689],
    [39.78764493660622,-74.62188720703126],
    [39.82562403725388,-74.34036254882814],
    [39.98680106959642,-74.28543090820314]
];

var defaultCoord = defaultCoords[0];
var token = "pk.eyJ1IjoiYW5kcnUyNTUiLCJhIjoiY2pzczZwbjFuMDNtdzN6cGdjdDI0NG83OCJ9.a0W5E0LVlMWaLx36LTr3Yg";
L.mapbox.accessToken = token;

//var map = L.mapbox.map("map", "mapbox.streets");
var featureGroup = L.featureGroup();
var polyline = L.polygon(defaultCoords);
featureGroup.addLayer(polyline);

function mapBoxSetup() {
    // initial centering
    map.setView(defaultCoord, 9);
    // tools
    featureGroup.addTo(map);
    var drawTool = new L.Control.Draw({
        edit: {
            featureGroup: featureGroup
        },
        draw: {
            polygon: true,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false
        }
    });
    drawTool.addTo(map);
    // adding a polyline
    polyline.addTo(map);
}

function coordArrayObjectToText(coordArrayObject) {
    return coordArrayObject.map((coordObject) => {
        return [coordObject.lat, ",", coordObject.lng, ";"].join("");
    }).join("");
}

function coordsToText(coords) {
    return coords.map((coord) => {
        return [coord[0], ",", coord[1], ";"].join("");
    }).join("");
}

function textToCoords(text) {
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

// Events
function showPolygonArea(e) {
    featureGroup.clearLayers();
    txtCoords.value = coordArrayObjectToText(e.layer.getLatLngs()[0]);
    featureGroup.addLayer(e.layer);
}

function showPolygonAreaEdited(e) {
    e.layers.eachLayer((layer)=> showPolygonArea({layer: layer}));
}

function makePolygon(evt) {
    featureGroup.clearLayers();
    var coords = textToCoords(txtCoords.value);
    polyline = L.polygon(coords);
    featureGroup.addLayer(polyline)
    evt.preventDefault();
}

function showMessage(text, timeout) {
    var validTimeout = timeout || 4;
    var childElement = document.createElement("div");
    childElement.className = "message";
    childElement.innerHTML = ["<p>", text ,"</p>"].join(" ");
    containerMessage.appendChild(childElement);
    setTimeout(() => {
        childElement.className += " slideup";
        childElement.remove();
    }, 1000 * validTimeout);
}

window.onload = function() {
    coordView.render(defaultCoords);
    //mapBoxSetup();
    txtCoords.value = coordsToText(defaultCoords);
    
    // map events
    //map.on("draw:created", showPolygonArea);
    //map.on("draw:edited", showPolygonAreaEdited);

    // 
    //btnCreatePolygon.addEventListener("click", makePolygon);
};