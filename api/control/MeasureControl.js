import Draw from 'ol/interaction/Draw';
import { LineString, Polygon } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import Vector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';
import { Control } from './Control';

export class MeasureControl extends Control {

    constructor(type, map) {
        super(map);

        this.staticTooltip = [];
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

        this.measureLayer.set('name', type + "MeasureLayer");
        map.addLayer(this.measureLayer);

        this.measureDraw = new Draw({
            source: this.source,
            type: type,
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
    }

    setDrawStrokeColor(color) {
        this.measureDraw.getOverlay().getStyle().getStroke().setColor(color);
    }

    setDrawFillColor(color) {
        this.measureDraw.getOverlay().getStyle().getFill().setColor(color);
    }

    setDrawTooltipBgColor(color) {
        this.drawTooltipBgColor = color;
    }

    setDrawTooltipTextColor(color) {
        this.drawTooltipTextColor = color;
    }

    setDrawedStrokeColor(color) {
        this.measureLayer.getStyle().getStroke().setColor(color);
    }

    setDrawedFillColor(color) {
        this.measureLayer.getStyle().getFill().setColor(color);
    }

    setDrawedTooltipBgColor(color) {
        this.drawedTooltipBgColor = color;
    }

    setDrawedTooltipTextColor(color) {
        this.drawedTooltipTextColor = color;
    }

    setKeepSingleMeasurement(state) {
        this.keepSingleMeasurement = state;
    }

    enableMeasure(enabled) {
        this.clear();
        this.tooltip();
        this.measureDraw.setActive(enabled);

        if (enabled)
            this.map.addInteraction(this.measureDraw);
        else {
            this.map.removeInteraction(this.measureDraw);
        }

    }

    tooltip() {
        var sketch;
        this.measureTooltipElement = undefined;
        this.measureTooltip = undefined;
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

        this.createMeasureTooltip();

        var listener;
        draw.on('drawstart', (evt) => {

            if (this.keepSingleMeasurement) {
                this.source.clear();
                this.clearStaticTooltip();
            }

            sketch = evt.feature;
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', (evt) => {
                var geom = evt.target;
                var output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                this.measureTooltipElement.innerHTML = output;
                this.measureTooltip.setPosition(tooltipCoord);
            });
        });

        draw.on('drawend', () => {
            this.measureTooltipElement.className = 'tooltip tooltip-static';
            this.measureTooltipElement.style.backgroundColor = this.drawedTooltipBgColor;
            this.measureTooltipElement.style.color = this.drawedTooltipTextColor;
            this.staticTooltip.push(this.measureTooltipElement);
            this.measureTooltip.setOffset([0, -7]);
            sketch = null;
            this.measureTooltipElement = null;
            this.createMeasureTooltip();
            unByKey(listener);
        });
    }

    createMeasureTooltip() {
        if (this.measureTooltipElement)
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);

        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltipElement.style.backgroundColor = this.drawTooltipBgColor;
        this.measureTooltipElement.style.color = this.drawTooltipTextColor;

        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });

        this.map.addOverlay(this.measureTooltip);
    }

    clearStaticTooltip() {
        var staticTooltip = document.getElementsByClassName("tooltip tooltip-static");

        if (staticTooltip) {
            for (var i = 0; i < staticTooltip.length; i++) {
                staticTooltip[i].remove();
            }
        }

        this.staticTooltip.forEach((tooltip) => tooltip.remove())
        this.staticTooltip = [];
    }

    clear() {
        this.source.clear();
        this.clearStaticTooltip();
        this.map.removeOverlay(this.measureTooltip);
    }
}