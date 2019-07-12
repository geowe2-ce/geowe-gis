import { inherits } from 'ol/util';
import Draw from 'ol/interaction/Draw';
import { LineString, Polygon } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import Vector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';

import '../../../style/measure.css';
import { ToggleButtonTool } from '../base/ToggleButtonTool';

export class MeasureTool extends ToggleButtonTool {
    constructor(map) {
        super({ id: "measureTool", map: map });
        //this.zoomControl = new ZoomControl(map);
    }

    onToggle(isActive) {

    }
}


/*
var MeasureTool = function(params) {
    ToggleTool.call(this, params);

    this.type = params.type;
};

inherits(MeasureTool, ToggleTool);

MeasureTool.prototype.initialize = function(map) {
    this.source = new SourceVector();

    this.measureLayer = new Vector({
        source: this.source,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: '#8bc34a',
                width: 2
            }),
            image: new Circle({
                radius: 7,
                fill: new Fill({
                    color: '#8bc34a'
                })
            })
        })
    });

    this.measureLayer.set('name', this.type + "MeasureLayer");

    this.measureDraw = new Draw({
        source: this.source,
        type: this.type,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: '#8bc34a', //rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new Circle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });

    this.measureDraw.setActive(false);
    this.controls = [this.measureDraw];
    map.addLayer(this.measureLayer);
    this.map = map;
    this.tooltip();

    ToggleTool.prototype.initialize.call(this, map);
}

MeasureTool.prototype.getMap = function() {
    return this.map;
}

MeasureTool.prototype.setActive = function(enabled, fireEvents) {
    ToggleTool.prototype.setActive.call(this, enabled, fireEvents);

    this.source.clear();
    this.clearStaticTooltip();
}

MeasureTool.prototype.clearStaticTooltip = function() {
    var staticTooltip = document.getElementsByClassName("tooltip tooltip-static");
    
    if (staticTooltip) {

        for (var i = 0; i < staticTooltip.length; i++) {
            staticTooltip[i].remove();
        }
    }
}

MeasureTool.prototype.tooltip = function() {

    var map = this.getMap();
    var sketch;
    var helpTooltipElement;
    var helpTooltip;
    var measureTooltipElement;
    var measureTooltip;
    var continuePolygonMsg = 'Click to continue drawing the polygon';
    var continueLineMsg = 'Click to continue drawing the line';
    this.pointerMoveHandler = function(evt) {
        if (evt.dragging) {
            return;
        }       
    };

    this.pointermoveKey = map.on('pointermove', this.pointerMoveHandler);

    map.getViewport().addEventListener('mouseout', function() {
        helpTooltipElement.classList.add('hidden');
    });


    var draw = this.measureDraw;
    var formatLength = function(line) {
        var length = line.getLength(); //getLength(line);
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km / ' + (Math.round(length * 1) / 1) +
                ' m';
        } else {
            output = (Math.round(length * 1) / 1) +
                ' ' + 'm';
        }
        return output;
    };

    var formatArea = function(polygon) {
        var area = polygon.getArea(); //getArea(polygon);
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup> /' + (Math.round(area / 10000 * 10000) / 10000) +
                ' HA';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup> / ' + (Math.round((area / 10000) * 10000) / 10000) +
                ' HA';
        }
        return output;
    };


    createMeasureTooltip();
    createHelpTooltip();

    var listener;
    draw.on('drawstart',
        function(evt) {

            this.source.clear();
            this.clearStaticTooltip();


            // set sketch
            sketch = evt.feature;

            
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function(evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }.bind(this));

    draw.on('drawend',
        function() {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;

            createMeasureTooltip();
            unByKey(listener);
        }, this);

    function createHelpTooltip() {


        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
    }

    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
    }

}*/