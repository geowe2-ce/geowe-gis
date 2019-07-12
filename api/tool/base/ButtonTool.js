import { Tool } from "./Tool";
import { SimpleButton } from "geowe-ui-js/api/button/SimpleButton";

export class ButtonTool extends Tool {
    constructor(options) {
        super(new SimpleButton(options.id, options.label, options.iconFont, function() {}), options.map);

        this.getUIElement().addIcon(this.getSettingsHolder().getLocalizedSetting(`tool.${options.id}.iconFont`));
        this.getUIElement().label = " " + this.getSettingsHolder().getLocalizedSetting(`tool.${options.id}.label`);
        this.getUIElement().showLabel(true);
        this.getUIElement().getDOMObject().addEventListener("click", this.onToolClicked.bind(this));
    }

    onToolClicked() {
        alert("Not implemented yet");
    }
}