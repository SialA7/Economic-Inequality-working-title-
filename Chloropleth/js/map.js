// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = 'data/laborinthdata.csv';
let markers = L.featureGroup();
let csvdata;

let colorMat = [['#205DD4', '#3f40a9', '#5d227e'],
				['#839AE2', '#7256aa', '#9640af'],
				['#E5D6F0', '#D592B8', '#C44E7F']];
let matX;
let matY;
 /* Labor rights scores already normalized: (0-3.33), (3.34-6.33), (6.34-10)
 	Working poverty: 
	 	Extremely poor: 0-79% (0-26), (27-53), (54-80)
		Moderately poor: 0-43% (0-14), (15-29), (30-44)
		Near poor: 0-45% (0-15), (16-30), (31-45)
		Overall working poverty (EP+MP +NP): (0-33)(34-66)(67-100)
		
	[[(0,0), (0,1), (0,2)],
	[(1,0), (1,1), (1,2)],
	[(2,0), (2,1), (2,2)]]*/

// geojson
let geojsonPath = 'data/laborinthworld.geojson';
let geojson_data;

let geojson_layerEP; //labor index + extreme poverty rates
let geojson_layerMP; //labor index + moderate poverty rates
let geojson_layerNP; // labor index + near poverty rates
let geojson_layerOP;


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
	let OPvalues = [];
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
		OPvalues.push(item.properties[extremePoverty] + item.properties[moderatePoverty] + item.properties[nearPoverty]);
		LIvalues.push(item.properties[laborIndex])
	})

	extrPov = extremePoverty;
	modPov = moderatePoverty;
	nPov = nearPoverty; 
	labInd = laborIndex;

	// create the layer and add to map
	
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

	geojson_layerOP = L.geoJson(geojson_data,{
		style: getStyleOP,
		onEachFeature: onEachFeatureOP
	})

	let layers = {
        "Extreme Poverty": geojson_layerEP,
		"Moderate Poverty": geojson_layerMP, 
		"Near Poverty": geojson_layerNP,
		//"Overall Working Poverty Rate" : geojson_layerOP
    }

	L.control.layers(null,layers).addTo(map)

	// fit to bounds
	map.fitBounds(geojson_layerEP.getBounds())

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

var CSIcon = L.Icon.extend({
    options: {
        iconUrl: 'images/person-icon3.png',
        iconSize: [40, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    }
});

var CSIcon2 = L.Icon.extend({
    options: {
        iconUrl: 'images/person-icon2.png',
        iconSize: [40, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    }
});

function mapCSV(){

	// loop through each entry
   csvdata.data.forEach(function(item,index){
		if(item.CaseStudy != "" && item.CaseStudy != undefined){
			let marker = L.marker([item.Latitude,item.Longitude], CSIcon)
			.on('mouseover', function(){
				marker.setIcon(new CSIcon2); 
			})
			.on('mouseout', function(){
				marker.setIcon(new CSIcon);
			})
			.on('click', function(){
				window.open(item.CaseStudy);
			})

			marker.setIcon(new CSIcon);
			markers.addLayer(marker);
		}
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
		if(feature.properties[extrPov] <= 26){
			matX = 0
		} else if (feature.properties[extrPov] <= 53){
			matX = 1
		} else if (feature.properties[extrPov] <= 100){
			matX = 2
		}

		if (feature.properties[labInd] <= 3.33){
			matY = 2
		} else if (feature.properties[labInd] <= 6.66){
			matY = 1
		} else if (feature.properties[labInd] <= 10){
			matY = 0
		}

		return{
			stroke: false,
			fill: true, 
			fillColor: colorMat[matY][matX],
			fillOpacity: 1
		}
	}
}

/* Labor rights scores already normalized: (0-3.33), (3.34-6.33), (6.34-10)
 	Working poverty: 
	 	Extremely poor: 0-79% (0-26), (27-53), (54-80)
		Moderately poor: 0-43% (0-14), (15-29), (30-44)
		Near poor: 0-45% (0-15), (16-30), (31-45)
		Overall working poverty (EP+MP +NP): (0-33)(34-66)(67-100)*/

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
		if(feature.properties[modPov] <= 14){
			matX = 0
		} else if (feature.properties[modPov] <= 29){
			matX = 1
		} else if (feature.properties[modPov] <= 44){
			matX = 2
		}

		if (feature.properties[labInd] <= 3.33){
			matY = 2
		} else if (feature.properties[labInd] <= 6.66){
			matY = 1
		} else if (feature.properties[labInd] <= 10){
			matY = 0
		}

		return{
			stroke: false,
			fill: true, 
			fillColor: colorMat[matY][matX],
			fillOpacity: 1
		}
	}
}

function getStyleNP(feature){
	if (feature.properties[extrPov] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#636363',
			fillOpacity: 1
		}
	}
	else {
		if(feature.properties[nPov] <= 15){
			matX = 0
		} else if (feature.properties[nPov] <= 30){
			matX = 1
		} else if (feature.properties[nPov] <= 100){
			matX = 2
		}

		if (feature.properties[labInd] <= 3.33){
			matY = 2
		} else if (feature.properties[labInd] <= 6.66){
			matY = 1
		} else if (feature.properties[labInd] <= 10){
			matY = 0
		}

		return{
			stroke: false,
			fill: true, 
			fillColor: colorMat[matY][matX],
			fillOpacity: 1
		}
	}
}

function getStyleOP(feature){
	if (feature.properties[extrPov] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#636363',
			fillOpacity: 1
		}
	}
	else {
		if(feature.properties[nPov] + feature.properties[modPov] + feature.properties[extrPov] <= 33){
			matX = 0
		} else if (feature.properties[nPov] + feature.properties[modPov] + feature.properties[extrPov] <= 66){
			matX = 1
		} else if (feature.properties[nPov] + feature.properties[modPov] + feature.properties[extrPov] <= 100){
			matX = 2
		}

		if (feature.properties[labInd] <= 3.33){
			matY = 2
		} else if (feature.properties[labInd] <= 6.66){
			matY = 1
		} else if (feature.properties[labInd] <= 10){
			matY = 0
		}

		return{
			stroke: false,
			fill: true, 
			fillColor: colorMat[matY][matX],
			fillOpacity: 1
		}
	}
}

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
					'<b> Legend: </b> <br> <img src= images/legend.png width = 150 height = 150> <br> <img src = images/legend2.png width = 100 height = 100>';
		
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

function onEachFeatureOP(feature, layer){
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightOP,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 3,
		stroke: true, 
		color: '#ffffff',
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted

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
function resetHighlightOP(e) {
	geojson_layerOP.resetStyle(e.target);
	info_panel.update()
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

