import Select from 'ol/interaction/Select';
import DragBox from 'ol/interaction/DragBox';
import { platformModifierKeyOnly, shiftKeyOnly, primaryAction, click } from 'ol/events/condition';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import MultiPoint from 'ol/geom/MultiPoint';
import Vector from 'ol/layer/Vector';
import { boundingExtent } from 'ol/extent';
import { Control } from './Control';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import spatialEngine from '../spatial/SpatialEngine';
import { VectorTile } from 'ol/layer.js';

export class SelectControl extends Control {
    constructor(map) {
        super(map);

        this.selectControl = new Select({
            layers: undefined,
            toggleCondition: shiftKeyOnly,
            style: this.getStyle
        });

        this.selectControl.on('select', (e) => {

            var feature = e.selected[0];

            if (feature != undefined && feature.vectorType == "vector-tile") {

                var extent = undefined;
                var point = undefined;
                var geom = feature.getGeometry();

                if (geom instanceof Polygon) {
                    this.selectedFeatures.pop();
                    point = geom.getInteriorPoint();
                    //point = spatialEngine.getCentroid(geom);

                } else if (geom instanceof LineString) {
                    this.selectedFeatures.pop();
                    geom = spatialEngine.bufferGeometry(geom, 5);
                    point = geom.getInteriorPoint();
                }

                if (point != undefined) {
                    extent = spatialEngine.bufferGeometry(point, 50).getExtent();
                    this.setSelectedFeaturesByExtent(extent);
                }
            }
        });


        this.dragBoxControl = new DragBox({
            //condition: primaryAction,
            condition: platformModifierKeyOnly,
            style: this.getStyle
        });

        this.dragBoxControl.on('boxstart', () => {
            this.selectedFeatures.clear();
            //this.onBoxStartEvent();
        });

        this.dragBoxControl.on('boxend', () => {
            var extent = this.dragBoxControl.getGeometry().getExtent();
            this.setSelectedFeaturesByExtent(extent);
        });
    }

    setSelectedFeaturesByExtent(extent) {
        this.map.getLayers().forEach((layer) => {
            if (layer instanceof Vector) {
                layer.getSource().forEachFeatureIntersectingExtent(extent, (feature) => {
                    this.selectedFeatures.push(feature);
                });
            }
        });
    }

    getStyle() {
        var selectStyle = new Style({
            fill: new Fill({
                color: [249, 231, 159, 0.7]
            }),
            stroke: new Stroke({
                width: 6,
                color: [237, 212, 0, 0.8]
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: [237, 212, 0, 0.8]
                        //color: [249, 231, 159, 0.7]
                }),
                stroke: new Stroke({
                    width: 6,
                    color: [237, 212, 0, 0.8]
                }),
            })
        });

        return selectStyle;
    }

    enable(enabled) {
        this.selectedFeatures = this.selectControl.getFeatures();
        this.selectedFeatures.clear();
        this.selectControl.setActive(enabled);
        this.dragBoxControl.setActive(enabled);
        if (enabled) {
            this.map.addInteraction(this.selectControl);
            this.map.addInteraction(this.dragBoxControl);
        } else {
            this.map.removeInteraction(this.selectControl);
            this.map.removeInteraction(this.dragBoxControl);
        }
    }

}