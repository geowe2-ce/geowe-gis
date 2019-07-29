import { Control } from './Control';
import './featureInfoControl.css';
import Select from 'ol/interaction/Select';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { click, pointerMove, altKeyOnly, never } from 'ol/events/condition.js';


export default class FeatureInfoControl extends Control {
    constructor(map) {
        super(map);

        this.selectControl = new Select({
            condition: never,
            style: this.getStyle
        });

        this.hoverControl = new Select({
            condition: never,
            style: this.getHighlightStyle
        });

        // this.infoElement = document.createElement("pre");
        // this.infoElement.id = "quick-feature-info";
        // document.body.appendChild(this.infoElement);
        this.function = this.onClick.bind(this);
        this.hoverFunction = this.onHover.bind(this);
    }

    enable(enabled) {
        this.hoverControl.setActive(enabled);
        this.selectControl.setActive(enabled);

        if (enabled) {
            this.map.addInteraction(this.selectControl);
            this.map.addInteraction(this.hoverControl);
            this.map.on("pointermove", this.hoverFunction);
            this.map.on("click", this.function);

        } else {
            this.map.un("pointermove", this.hoverFunction);
            this.map.un("click", this.function);
            this.clearSelectedFeatures();
            this.map.removeInteraction(this.selectControl);
            this.map.removeInteraction(this.hoverControl);
        }
    }

    onClick(event) {
        var features = this.map.getFeaturesAtPixel(event.pixel);
        this.clearSelectedFeatures();

        var featureData = { count: 0, layers: {} };
        if (!features) {
            this.notify(featureData);
            return;
        }

        featureData.count = features.length;

        features.forEach((feature) => {
            var properties = feature.clone().getProperties();
            delete properties["geometry"];

            if (featureData.layers[feature.layerName] == undefined) {
                featureData.layers[feature.layerName] = [];
            }

            featureData.layers[feature.layerName].push(properties);
            this.setSelectedFeature(feature);
        });

        this.notify(featureData);
    }

    onHover(event) {
        var features = this.map.getFeaturesAtPixel(event.pixel);

        this.hoverSelectedFeatures = this.hoverControl.getFeatures();
        if (this.hoverSelectedFeatures != undefined)
            this.hoverSelectedFeatures.clear();

        if (!features) {
            return;
        }

        features.forEach((feature) => {
            this.hoverSelectedFeatures.push(feature.clone());
        })
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

    getHighlightStyle() {

        return new Style({
            stroke: new Stroke({
                color: [255, 0, 0, 0.6],
                width: 2
            }),
            fill: new Fill({
                color: [255, 0, 0, 0.2]
            }),
            zIndex: 1
        });
    }

    clearSelectedFeatures() {
        this.selectedFeatures = this.selectControl.getFeatures();
        if (this.selectedFeatures != undefined)
            this.selectedFeatures.clear();
    }

    setSelectedFeature(feature) {
        this.selectedFeatures = this.selectControl.getFeatures();
        this.selectedFeatures.push(feature);
    }
}