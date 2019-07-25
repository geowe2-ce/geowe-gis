import { Tool } from "./Tool";
import { SimpleButton } from "geowe-ui-js/api/button/SimpleButton";

export class ButtonTool extends Tool {
    constructor(options) {
        super(new SimpleButton(options.id, options.label, options.iconFont, function() {}), options.map);

        this.getUIElement().addIcon(this.getSettingsHolder().getSetting(`tool.${options.id}.iconFont`));
        const label = this.getSettingsHolder().getSetting(`tool.${options.id}.label`);
        this.getUIElement().label = label == undefined ? "" : " " + label;
        this.getUIElement().showLabel(label == undefined);

        this.getUIElement().getDOMObject().addEventListener("click", this.onToolClicked.bind(this));
    }

    onToolClicked() {
        alert("Not implemented yet");
    }
}