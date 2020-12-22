// set var for site address
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// center coordinates, Los Angeles
// Los Angeles, CA is in an earthquake prone area
var centercoor = [34.052235, -118.243683];

// Features
d3.json(geoData, data => {
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            "<h3 align='center'>" +
            feature.properties.place +
            "</h3><hr><p><b>Date and Time:</b> " +
            new Date(feature.properties.time) +
            "</p>" +
            "</h3><p><b>Magnitude:</b> " +
            feature.properties.mag +
            "</p>"
        );
    }

    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
            var geojsonMarkerOptions = {
                radius: 5 * feature.properties.mag,
                fillColor: getColor(feature.properties.mag),
                color: "none",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });

    createMap(earthquakes);
}

// Map layers
function createMap(earthquakes) {
    var lightMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.light",
            accessToken: API_KEY
        }
    );

    var darkMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.dark",
            accessToken: API_KEY
        }
    );

    var satelliteMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.satellite",
            accessToken: API_KEY
        }
    );

    var outdoorsMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.outdoors",
            accessToken: API_KEY
        }
    );

    //Base Maps

    var baseMaps = {
        "Light Map": lightMap,
        "Dark Map": darkMap,
        "Satellite Map": satelliteMap,
        "Outdoors Map": outdoorsMap
    };

    //Overlay Maps
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //Creating and Centering Map
    var map = L.map("map", {
        center: centercoor,
        zoom: 4,
        layers: [lightMap, earthquakes]
    });

    //Controls for layers
    L.control.layers(baseMaps, overlayMaps, { collapsed: false}).addTo(map);

    // Map Legend
    var legend = L.control({ position:"bottomright" });

    legend.onAdd = map => {
        var div = L.DomUtil.create("div", "legend"),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
        div.innerHTML += "<b>Scale</b><br><hr>";
        grades.forEach(i => {
            div.innerHTML +=
                '<i style="background:' +
                getColor(grades[i] + 1) +
                '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] +
                (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        });
        return div;
    };

    legend.addTo(map);
}

// Colors definition by Earthquake magnitudes
function getColor(color) {
    return color <= 1
        ? "#00FF00" // green
        : color <= 2
        ? "#C2FF00" // light green
        : color <= 3
        ? "#FFFF00" // yellow
        : color <= 4
        ? "#FFC100" // light orange
        : color <= 5
        ? "#FF7B00" // darker orange
        : color >= 5
        ? "#FF0000" // red
        : "#FF0000";
}
