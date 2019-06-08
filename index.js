//var gpxData = require('./data/gpx/fells_loop.gpx');
var gpxData = require('./data/gpx/Problem.gpx');

import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GPX from 'ol/format/GPX.js';
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer.js';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style.js';
import VectorSource from 'ol/source/Vector.js';
import OSM from 'ol/source/OSM.js';

var raster = new TileLayer({
    source: new OSM()
});

var GPX_DATA_URL = 'https://raw.githubusercontent.com/gwaldron/osgearth/master/data/fells_loop.gpx';

GPX_DATA_URL = "./data/gpx/fells_loop.gpx";
var style = {
    // 'Point': new Style({
    //     image: new CircleStyle({
    //         fill: new Fill({
    //             color: 'rgba(255,255,0,0.4)'
    //         }),
    //         radius: 5,
    //         stroke: new Stroke({
    //             color: '#ff0',
    //             width: 1
    //         })
    //     })
    // }),
    'LineString': new Style({
        stroke: new Stroke({
            color: '#f00',
            width: 3
        })
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({
            color: '#0f0',
            width: 3
        })
    })
};

var vector = new VectorLayer({
    source: new VectorSource({
        url: gpxData,
        format: new GPX()
    }),
    style: function(feature) {
        return style[feature.getGeometry().getType()];
    }
});

//var MAP_CENTER = [-7916041.528716288, 5228379.045749711];
var MAP_CENTER = [12.9716, 77.5946]

var map = new Map({
    layers: [raster, vector],
    target: document.getElementById('map'),
    view: new View({
        center: MAP_CENTER.reverse(),
        zoom: 8
    })
});

var displayFeatureInfo = function(pixel) {
    var features = [];
    map.forEachFeatureAtPixel(pixel, function(feature) {
        features.push(feature);
    });
    if (features.length > 0) {
        var info = [];
        var i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
            info.push(features[i].get('desc'));
        }
        document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
        map.getTarget().style.cursor = 'pointer';
    } else {
        document.getElementById('info').innerHTML = '&nbsp;';
        map.getTarget().style.cursor = '';
    }
};

map.on('pointermove', function(evt) {
    if (evt.dragging) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

map.on('click', function(evt) {
    displayFeatureInfo(evt.pixel);
});