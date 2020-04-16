// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
    onEachFeature : function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
  },    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
      fillColor: Color(feature.properties.mag),
        fillOpacity: 1.0,
        stroke: false,
    })
  }
  });
  
    // Creating a function to give magnitude color range and size
  function markerSize(magnitude) {
    return magnitude * 25000;
  }


  function Color(magnitude) {
    if (magnitude <= 1) {
        return "GreenYellow";
    } else if (magnitude <= 2) {
        return "Yellow";
    } else if (magnitude <= 3) {
        return "Orange";
    } else if (magnitude <= 4) {
        return "OrangeRed";
    } else if (magnitude <= 5) {
        return "Red";
    } else {
        return "DarkRed";
    };
  }
  
// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define street map, satellite map,and dark map layers

  var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers

  var baseMap = {
    "Street Level": street,
    "Satellite": satellite,
    "Dark Scale": dark
  };

  // Create overlay object to hold our overlay layer

  var overlayMap = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the map and layers to display on load

  var myMap = L.map("map", {
    center: [35.0,-97.0],
    zoom: 4,
    layers: [street, satellite, earthquakes]
  });

  // Add the control layer and legend to the map

  L.control.layers(baseMap, overlayMap, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5];
        color = ["GreenYellow", "Yellow", "Orange", "OrangeRed", "Red", "DarkRed"];
    
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color[i] + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);

}

