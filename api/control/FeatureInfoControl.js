import { Control } from './Control';
import './featureInfoControl.css';
import { SelectControl } from './SelectControl';
import Select from 'ol/interaction/Select';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { platformModifierKeyOnly, shiftKeyOnly, primaryAction, click } from 'ol/events/condition';

export default class FeatureInfoControl extends Control {
    constructor(map) {
        super(map);
        //this.selectControl = new SelectControl(map);

        this.selectControl = new Select({
            condition: click,
            //toggleCondition: shiftKeyOnly,
            style: this.getStyle
        });


        this.infoElement = document.createElement("pre");
        this.infoElement.id = "quick-feature-info";
        document.body.appendChild(this.infoElement);
        this.function = this.showInfo.bind(this);
        this.event = "pointermove"; //singleclick
    }

    enable(enabled) {
        this.infoElement.innerText = '';
        this.infoElement.style.opacity = 0;
        this.selectControl.setActive(enabled);
        if (enabled) {
            //this.map.on("pointermove", this.function);
            this.map.on("click", this.function);

            this.map.addInteraction(this.selectControl);

        } else {
            //this.map.un("pointermove", this.function);
            this.map.un("click", this.function);
            this.map.removeInteraction(this.selectControl);
        }

    }

    showInfo(event) {
        var features = this.map.getFeaturesAtPixel(event.pixel);
        if (!features) {
            this.infoElement.innerText = '';
            this.infoElement.style.opacity = 0;
            return;
        }


        this.selectedFeatures = this.selectControl.getFeatures();
        this.selectedFeatures.clear();


        var info = `Elementos: ${features.length} <br>`;
        features.forEach((feature) => {
            var properties = feature.clone().getProperties();
            delete properties["geometry"];

            for (var attributeName in properties) {
                info += `<b>${attributeName}:</b> ${properties[attributeName]}<br>`
            }

            info += `<hr class='feature-separator'>`;

            this.selectedFeatures.push(feature);

        })


        //alert(this.selectedFeatures.getLength());
        this.infoElement.innerHTML = info;
        this.infoElement.style.opacity = 1;

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
}