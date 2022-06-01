// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = 'data/laborinthdata.csv';
let markers = L.featureGroup();
let povertyMarkers = L.featureGroup(); 
let csvdata;

const colorMat = [
	['#C869F5', '#A96EFF', '#7F6FE8'],
	['#DEABF5', '#B8B0E8', '#6E81FF'],
	['#F5F5F5', '#ABC9F5', '#69A1F5']
];

let brew1 = new classyBrew();
let brew2 = new classyBrew(); 

// geojson
let geojsonPath = 'data/laborinthworld.geojson';
let geojson_data;
let geojson_layer1;
let geojson_layer2;

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
		mapGeoJSON('ExtremePoor', 'OverallFairLabor')
	})
}

// function to map a geojson file
function mapGeoJSON(field1, field2){

	let WPvalues = [];
	let LIvalues = [];

	geojson_data.features.forEach(function(item,index){
		if (item.properties[field1] == "" || item.properties[field1] == undefined){
			item.properties[field1] = -1
		}

		if (item.properties[field2] == "" || item.properties[field2] == undefined){
			item.properties[field2] = -1
		}

		console.log(item.properties[field1])
		WPvalues.push(item.properties[field1])
		LIvalues.push(item.properties[field2])
	})

	fieldtomap1 = field1;
	fieldtomap2 = field2;

	brew1.setSeries(WPvalues);
	brew1.setNumClasses(3);
	brew1.setColorCode('Blues');
	brew1.classify('quantiles');

	brew2.setSeries(LIvalues);
	brew2.setNumClasses(4);
	brew2.setColorCode('Reds')
	brew2.classify('quantiles');

	// create the layer and add to map
	geojson_layer1 = L.geoJson(geojson_data, {
		style: getStyle1, 
		onEachFeature: onEachFeature
	}).addTo(map);

	geojson_layer2 = L.geoJson(geojson_data, {
		style: getStyle2, 
		onEachFeature: onEachFeature
	}).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer1.getBounds())

	//createLegend();
	createInfoPanel();
}


// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
        
        if(item.ExtremePoor != undefined && item.ExtremePoor != ""){
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
        "Working Poverty": povertyMarkers,
        "Fair Labor": markers
    }

    L.control.layers(null,layers).addTo(map)

	map.fitBounds(markers.getBounds())
}

// style each feature
function getStyle1(feature){
	if (feature.properties['ExtremePoor'] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#000000',
			fillOpacity: 1
		}
	}
	else {
		return {
			stroke: false,
			fill: true,
			fillColor: brew1.getColorInRange(feature.properties[fieldtomap1]),
			fillOpacity: 0.8
		}
	}
}

function getStyle2(feature){
	if (feature.properties['ExtremePoor'] == -1){
		return {
			stroke: false, 
			fill: true, 
			fillColor: '#000000',
			fillOpacity: 1
		}
	}
	else {
		return {
			stroke: false,
			fill: true,
			fillColor: brew2.getColorInRange(feature.properties[fieldtomap2]),
			fillOpacity: 0.4
		}
	}
}

function getColor(field){
	if (field != undefined && field != ""){
		let x = Math.round((WorkingPoverty/10)*(1/3));
		let y = Math.round(OverallFairLabor*(1/3));
		
		if (colorMat[x] != undefined){
			return colorMat[x][y];
		}
	}
	else {
		return '#000000';
	}

}

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = [brew1.getBreaks(), brew2.getBreaks]
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			for (j=0; j<breaks[j].length; j++){
				from = breaks[i][j];
				to = breaks[i+1][j+1];
				if(to) {
					labels.push(
						'<i style="background:' + brew1.getColorInRange(from) + '"></i> ' +
						'<i style="background:' + brew2.getColorInRange(from) + '"></i> ' +
						from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
					}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
			}
		};
		
		legend.addTo(map);
}

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
		stroke: true, 
		color: '#ffffff',
		fillColor: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer1.resetStyle(e.target);
	geojson_layer2.resetStyle(e.target);
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
			this._div.innerHTML = `<b>${properties.Country}</b><br>Rate of Extreme Poverty: ${properties[fieldtomap1]}% <br>Labor Rights Index: ${properties[fieldtomap2]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(map);
}