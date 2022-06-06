// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;

// put this in your global variables
let geojsonPath = 'data/laborinthworld.geojson';
let geojson_data;
let geojson_layer;

let legend = L.control({position: 'bottomright'});
let info_panel = L.control();

//path to csv data
let path = 'data/laborinthdata.csv';
let markers = L.featureGroup();
let povertyMarkers = L.featureGroup(); 
let csvdata;

const wpRGB = [51, 255, 255];
const liRGB = [51, 255, 0];

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    getGeoJSON();
    readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
    map = L.map('map').setView([lat,lon], zl);

    var Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
    }).addTo(map);
}

// function to read csv data
function readCSV(){
    Papa.parse(path, {
        header: true,
        download: true,
        complete: function(data) {
            console.log(data);
            // put the data in a global variable
            csvdata = data;

            // map the data for the given date
            mapCSV();
        }
    });
}

function mapCSV(){

    // clear layers in case you are calling this function more than once
    markers.clearLayers();

    // loop through each entry
    csvdata.data.forEach(function(item,index){
        if(item.OverallFairLabor != undefined){
            // circle options
             let circleOptions = {
                radius: item.OverallFairLabor*2,　// call a function to determine radius size
                weight: 1,
                color: 'white',
                fillColor: 'navy',
                fillOpacity: 0.5
            }
            let marker = L.circleMarker([item.Latitude,item.Longitude], circleOptions)
            .on('mouseover',function(){
                this.bindPopup(`${item['Country']} <br> Labor Indicators Score: ${item['OverallFairLabor']}`).openPopup()
            }) // show data on hover
            markers.addLayer(marker)    
        }
        
        if(item.ExtremePoor != undefined){
            let Pmarker = L.marker([item.Latitude, item.Longitude])
            .on('click', function(){
                this.bindPopup(`${item['Country']} <br> Extreme Poverty Rate: ${item['ExtremePoor']} <br> Moderate Poverty Rate: ${item['ModeratePoor']} <br> Near Poverty Rate: ${item['NearPoor']}`).openPopup()
            })
            povertyMarkers.addLayer(Pmarker)
        } 
    });

    markers.addTo(map)
    povertyMarkers.addTo(map)

    let layers = {
        "All Working Poverty Rates": povertyMarkers,
        "Labor Index Score": markers,
        "Moderate Working Poverty Rates": geojson_layer
        
    }

    L.control.layers(null,layers).addTo(map)

    map.fitBounds(markers.getBounds())
}

// function to get the geojson data
    function getGeoJSON(){

    $.getJSON(geojsonPath,function(data){ 
        console.log(data)

        // put the data in a global variable
        geojson_data = data;

        // call the map function
        // add a field to be used
        mapGeoJSON('ModeratePoor')

    })
}

function mapGeoJSON(field){

   // clear layers in case it has been mapped already
    if (geojson_layer){
        geojson_layer.clearLayers()
    }
    
    // globalize the field to map. what does this mean?
    fieldtomap = field;

    // create an empty array
    let values = [];

    // based on the provided field, enter each value into the array
    geojson_data.features.forEach(function(item,index){
        values.push(item.properties[field])
    })
    
    // create the layer and add to map
    geojson_layer = L.geoJson(geojson_data, {
        style: getStyle, //call a function to style each feature
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);

    // fit to bounds
    map.fitBounds(geojson_layer.getBounds())

    //create Legend
    

    //create Info Panel
    createInfoPanel();
}

// style each feature
function getStyle(feature){
    return {
        stroke: true, // adds an outline
        color: 'white', // outline color
        weight: 1, // outline width
        fill: true,
        fillColor: getColor(feature.properties['ModeratePoor']), // instead of a single color, make it based on the population value!
        fillOpacity: 0.8
    }
}

// return the color for each feature based on population count
function getColor(d) {

    return d > 40 ? '#800026' :
           d > 30  ? '#BD0026' :
           d > 20  ? '#E31A1C' :
           d > 10  ? '#FC4E2A' :
           d > 0   ? '#FD8D3C' :
           '#FFFFFF';
}

// adding interaction 

// adding legend


// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// on mouse over, highlight the feature
function highlightFeature(e) {
    var layer = e.target;

    // style to use on mouse over
    layer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.7
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //  layer.bringToFront();
    // }

    info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
    geojson_layer.resetStyle(e.target);
    info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

    info_panel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info_panel.update = function (properties) {
        // if feature is highlighted
        if(properties){
            this._div.innerHTML = `<b><h3>${properties.Country}</h3></b><b>Moderate Poor Poverty Rates</b> : ${properties[fieldtomap]}<br><b>Labor Index</b> :${properties.OverallFairLabor}`;
        }
        // if feature is not highlighted
        else
        {
            this._div.innerHTML = 'Hover over a country';
        }
    };

    info_panel.addTo(map);
}

