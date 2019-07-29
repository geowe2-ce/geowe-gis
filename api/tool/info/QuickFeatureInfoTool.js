import { ToggleButtonTool } from '../base/ToggleButtonTool';
import FeatureInfoControl from '../../control/FeatureInfoControl';


export class QuickFeatureInfoTool extends ToggleButtonTool {
    constructor(map) {
        super({ id: "quickFeatureInfoTool", map: map });
        this.featureInfoControl = new FeatureInfoControl(map);
        this.featureInfoControl.addListener(this);
    }

    onToggle(isActive) {
        this.featureInfoControl.enable(isActive);
    }

    onControlTriggered(layerInfo) {
        this.showInfo(layerInfo);
    }

    showInfo(layerInfo) {
        var uiElement = document.getElementById("quick-feature-info");
        if (uiElement == undefined) {
            uiElement = document.createElement("pre");
            uiElement.id = "quick-feature-info";
            document.body.appendChild(uiElement);
        }

        uiElement.innerText = '';
        uiElement.style.opacity = 0;

        if (layerInfo.count == 0) return;

        var info = `<b style="color:#61DC3B">Elementos seleccionados: ${layerInfo.count}</b> <br><br>`;
        info += `<hr class='feature-separator'><hr class='feature-separator'>`;

        for (var layerName in layerInfo.layers) {
            var layerData = layerInfo.layers[layerName];

            info += `<b style='color:yellow;'>[${layerName}]</b><br><br>`;
            info += `<hr class='feature-separator'>`;
            layerData.forEach((feature) => {
                for (var attributeName in feature) {
                    info += `<b>${attributeName}:</b> ${feature[attributeName]}<br>`;
                }

                info += `<hr class='feature-separator'>`;
            })
        }

        uiElement.innerHTML = info;
        uiElement.style.opacity = 1;
    }
}