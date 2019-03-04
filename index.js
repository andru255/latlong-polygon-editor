// fields
var txtCoords = document.getElementById("txtCoords");

// reset 
var lnkReset = document.getElementById("lnkReset"); 

// message container
var containerMessage = document.getElementById("messages");

// setup mapbox
var defaultCoords = [[40, -74.50], [40, -74.60]];
var defaultCoord = defaultCoords[0];
var token = "pk.eyJ1IjoiYW5kcnUyNTUiLCJhIjoiY2pzczZwbjFuMDNtdzN6cGdjdDI0NG83OCJ9.a0W5E0LVlMWaLx36LTr3Yg";
L.mapbox.accessToken = token;
var map = L.mapbox.map("map", "mapbox.streets");
var featureGroup = L.featureGroup();

function mapBoxSetup() {
    // initial centering
    map.setView(defaultCoord, 9);
    var polylineOptions = {
        color: '#000'
    };
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
            circle: true,
            marker: false
        }
    });
    drawTool.addTo(map);
    // adding a polyline
    var polyline = L.polyline(defaultCoords, polylineOptions);
    polyline.addTo(map);
}

function coordinatesSetup(coordinate) {
    // update textarea
    txtCoords.value = coordsToText(defaultCoords); // latitude
    console.log(textToCoords( txtCoords.value ));
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
    featureGroup.addLayer(e.layer);
}

function showPolygonAreaEdited(e) {
    e.layers.eachLayer((layer)=> showPolygonArea({layer: layer}));
}

function makeReset(evt) {
    evt.preventDefault();
}

function showMessage(text, timeout) {
    var validTimeout = timeout || 4;
    var childElement = document.createElement("div");
    childElement.className = "message";
    childElement.innerHTML = ["<p>", text ,"</p>"].join(" ");
    containerMessage.appendChild(childElement);
    var timer = setTimeout(() => {
        childElement.className += " slideup";
        childElement.remove();
    }, 1000 * validTimeout);
}

window.onload = function() {
    mapBoxSetup();
    coordinatesSetup(defaultCoords);

    // map events
    map.on("draw:created", showPolygonArea);
    map.on("draw:edited", showPolygonAreaEdited);

    // for reset
    lnkReset.addEventListener("click", makeReset);

    // adding events for inputs
    //txtLat.addEventListener("keyup", makeUpdatePositionByTextEditing);
    //txtLon.addEventListener("keyup", makeUpdatePositionByTextEditing);
};