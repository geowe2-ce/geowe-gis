import Select from 'ol/interaction/Select';
import DragBox from 'ol/interaction/DragBox';
import { platformModifierKeyOnly, shiftKeyOnly, primaryAction, click } from 'ol/events/condition';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import MultiPoint from 'ol/geom/MultiPoint';
import Vector from 'ol/layer/Vector';
import { boundingExtent } from 'ol/extent';
import { Control } from './Control';

export class SelectControl extends Control {
    constructor(map) {
        super(map);

        this.selectControl = new Select({
            //layers: [this.vector],
            /*condition: click,
            toggleCondition: shiftKeyOnly,
            multi: true,*/
            style: this.getStyle
        });

        this.selectControl.on('select', (e) => {

            var feature = e.selected[0];
            this.selectedFeatures.clear();
            if (feature != undefined) {
                //var extent = feature.getGeometry().getExtent();

                var extent = boundingExtent([feature.getGeometry().getFirstCoordinate(), feature.getGeometry().getLastCoordinate()]);

                this.map.getLayers().forEach((layer) => {
                    if (layer instanceof Vector) {
                        layer.getSource().forEachFeatureIntersectingExtent(extent, (feature) => {
                            this.selectedFeatures.push(feature);
                        });
                    }
                });
            }

            //alert("entro: " + e.type);
            //alert(JSON.stringify(e));
            //this.selectedFeatures.clear();
            /* this_.selectedFeatures = this.getFeatures();
    
            if (this_.selectedFeatures != undefined && this_.selectedFeatures.getLength() > 0) {
                this_.onClickEvent(this.getFeatures().getArray());
            } else {
                this_.onClickEvent([]);
            }
            //alert("eleccion");*/
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

            this.map.getLayers().forEach((layer) => {
                if (layer instanceof Vector) {
                    layer.getSource().forEachFeatureIntersectingExtent(extent, (feature) => {
                        this.selectedFeatures.push(feature);
                    });
                }
            });




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