var coordView = new CoordView();
var sourceView = new SourceView();

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
var map = L.mapbox.map("map", "mapbox.streets");
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

// Events
function showPolygonArea(e) {
    featureGroup.clearLayers();
    sourceView.coordArrayObjectToText(e.layer.getLatLngs()[0]);
    featureGroup.addLayer(e.layer);
}

function showPolygonAreaEdited(e) {
    e.layers.eachLayer((layer)=> showPolygonArea({layer: layer}));
}

function updatePolygon(coords) {
    featureGroup.clearLayers();
    polyline = L.polygon(coords);
    featureGroup.addLayer(polyline);
    // Update sourceView textarea
    sourceView.coordsToText(coords);
    // Update coordView fields
    coords.forEach(element => {
        
    });
}

window.onload = function() {
    coordView.init(defaultCoords);
    sourceView.init(defaultCoords);
    mapBoxSetup();

    // map events
    map.on("draw:created", showPolygonArea);
    map.on("draw:edited", showPolygonAreaEdited);

    // coordview events
    coordView.on("removeRow", updatePolygon);
    coordView.on("editRow", updatePolygon);

    // sourceView events
    sourceView.on("submit", updatePolygon);
};