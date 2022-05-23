// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = 'data/laborinthdata.csv';
let markers = L.featureGroup();
let povertyMarkers = L.featureGroup(); 
let csvdata;

let brewEP = new classyBrew();
let brewMP = new classyBrew(); 
let brewNP = new classyBrew(); 
let brew2 = new classyBrew(); 

// geojson
let geojsonPath = 'data/laborinthworld.geojson';
let geojson_data;

let geojson_layer2;

let geojson_layerEP;
let geojson_layerMP; 
let geojson_layerNP; 


//legend
let legend = L.control({position: 'bottomright'});
let info_panel = L.control({position: "topright"});

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
	getGeoJSON();
});

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON('ExtremePoor', 'ModeratePoor', 'NearPoor', 'OverallFairLabor');
	})
}

// function to map a geojson file
function mapGeoJSON(extremePoverty, moderatePoverty, nearPoverty, laborIndex){

	let EPvalues = [];
	let MPvalues = [];
	let NPvalues = [];
	let LIvalues = [];

	geojson_data.features.forEach(function(item,index){
		if (item.properties[extremePoverty] == "" || item.properties[extremePoverty] == undefined){
			item.properties[extremePoverty] = -1
		}

		if (item.properties[moderatePoverty] == "" || item.properties[moderatePoverty] == undefined){
			item.properties[moderatePoverty] = -1
		}

		if (item.properties[nearPoverty] == "" || item.properties[nearPoverty] == undefined){
			item.properties[nearPoverty] = -1
		}

		if (item.properties[laborIndex] == "" || item.properties[laborIndex] == undefined){
			item.properties[laborIndex] = -1
		}

		EPvalues.push(item.properties[extremePoverty])
		MPvalues.push(item.properties[moderatePoverty])
		NPvalues.push(item.properties[nearPoverty])
		LIvalues.push(item.properties[laborIndex])
	})

	extrPov = extremePoverty;
	modPov = moderatePoverty;
	nPov = nearPoverty; 
	labInd = laborIndex;

	brewEP.setSeries(EPvalues);
	brewEP.setNumClasses(5);
	brewEP.setColorCode('Blues');
	brewEP.classify('quantiles');

	brewEP.setSeries(MPvalues);
	brewEP.setNumClasses(5);
	brewEP.setColorCode('Blues');
	brewEP.classify('quantiles');

	brewEP.setSeries(NPvalues);
	brewEP.setNumClasses(5);
	brewEP.setColorCode('Blues');
	brewEP.classify('quantiles');

	brew2.setSeries(LIvalues);
	brew2.setNumClasses(4);
	brew2.setColorCode('Reds')
	brew2.classify('quantiles');

	// create the layer and add to map
	geojson_layer2 = L.geoJson(geojson_data, {
		style: getStyle2, 
		onEachFeature: onEachFeature2
	}).addTo(map);
	
	geojson_layerEP = L.geoJson(geojson_data, {
		style: getStyleEP, 
		onEachFeature: onEachFeatureEP
	}).addTo(map);

	geojson_layerMP = L.geoJson(geojson_data, {
		style: getStyleMP, 
		onEachFeature: onEachFeatureMP
	});

	geojson_layerNP = L.geoJson(geojson_data, {
		style: getStyleNP, 
		onEachFeature: onEachFeatureNP
	});

	let layers = {
        "Extreme Poverty": geojson_layerEP,
		"Moderate Poverty": geojson_layerMP, 
		"Near Poverty": geojson_layerNP,
    }

	L.control.layers(null,layers).addTo(map)

	// fit to bounds
	map.fitBounds(geojson_layer2.getBounds())

	createLegend();
	createInfoPanel();
}


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
		/*if(casestudy = true){
			create infoPanel, 
			markers.addLayer(marker);
		}*/
	}); 

	markers.addTo(map)
}

// style each feature
function getStyleEP(feature){
	if (feature.properties[extrPov] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#636363',
			fillOpacity: 1
		}
	}
	else {
		return {
			stroke: false,
			fill: true,
			fillColor: brewEP.getColorInRange(feature.properties[extrPov]),
			fillOpacity: 0.4
		}
	}
}

function getStyleMP(feature){
	if (feature.properties[modPov] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#636363',
			fillOpacity: 1
		}
	}
	else {
		return {
			stroke: false,
			fill: true,
			fillColor: brewEP.getColorInRange(feature.properties[modPov]),
			fillOpacity: 0.4
		}
	}
}

function getStyleNP(feature){
	if (feature.properties[nPov] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#636363',
			fillOpacity: 1
		}
	}
	else {
		return {
			stroke: false,
			fill: true,
			fillColor: brewEP.getColorInRange(feature.properties[nPov]),
			fillOpacity: 0.4
		}
	}
}

function getStyle2(feature){
	if (feature.properties[extrPov] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#636363',
			fillOpacity: 1
		}
	}
	else {
		return {
			stroke: false,
			fill: true,
			fillColor: brew2.getColorInRange(feature.properties[labInd]),
			fillOpacity: 0.8
		}
	}
}


function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
					'Relationship: <br> <img src= images/legend.png width = 150 height = 150>';
		
			return div;
		};
		
		legend.addTo(map);
}

function createInfoPanel(){

	info_panel.onAdd = function(map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function(properties) {
		// if feature is highlighted
		if(properties){
			if (properties[extrPov] == -1){
				this._div.innerHTML = `<b>${properties.Country}</b><br>Working poverty rate unavailable <br>Labor Rights Index: ${properties[labInd]}`;
			}
			else {
				this._div.innerHTML = `<b>${properties.Country}</b><br> Extreme poverty rate: ${properties[extrPov]}% <br> Moderate poverty rate: ${properties[modPov]}% <br> Near poverty rate: ${properties[nPov]}% <br> Labor Rights Index: ${properties[labInd]}`;
			}
			
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}



// Function that defines what will happen on user interactions with each feature
function onEachFeatureEP(feature, layer) {
	layer.on({
		mouseover: highlightFeature, 
		mouseout: resetHighlightEP,
		click: zoomToFeature
	});
}

function onEachFeatureMP(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightMP,
		click: zoomToFeature
	});
}

function onEachFeatureNP(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightNP,
		click: zoomToFeature
	});
}

function onEachFeature2(feature, layer) {
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
		stroke: true, 
		color: '#ffffff',
		fillColor: '#000000', 
		fillOpacity: 0.6, 
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer2.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

function resetHighlightEP(e) {
	geojson_layerEP.resetStyle(e.target);
	info_panel.update() // resets infopanel
}
function resetHighlightMP(e) {
	geojson_layerMP.resetStyle(e.target);
	info_panel.update() // resets infopanel
}
function resetHighlightNP(e) {
	geojson_layerNP.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

