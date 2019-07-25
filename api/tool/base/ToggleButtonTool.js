import { Tool } from "./Tool";
import { ToggleButton } from "geowe-ui-js/api/button/ToggleButton";

const DEFAULT_CURSOR = "grab";
export class ToggleButtonTool extends Tool {
    constructor(options) {
        super(new ToggleButton(options.id, options.label, options.iconFont, function() {}), options.map);

        this.cursor = this.getSettingsHolder().getSetting(`tool.${options.id}.cursor`);
        this.getUIElement().addIcon(this.getSettingsHolder().getSetting(`tool.${options.id}.iconFont`));

        const label = this.getSettingsHolder().getSetting(`tool.${options.id}.label`);
        this.getUIElement().label = label == undefined ? "" : " " + label;
        this.getUIElement().showLabel(label == undefined);

        this.getUIElement().setActive = (notifyEvent) => {
            ToggleButton.prototype.setActive.call(this.getUIElement(), notifyEvent);
            this.onToggle(true);
            this.enableCursor(this.cursor);
        }

        this.getUIElement().setInactive = (notifyEvent) => {
            ToggleButton.prototype.setInactive.call(this.getUIElement(), notifyEvent);
            this.onToggle(false);
            this.enableCursor(DEFAULT_CURSOR);
        }

        this.getUIElement().addListener(this);
    }

    onStateChanged(toggleButton) {
        if (toggleButton.isActive() && this.cursor != undefined) {
            this.enableCursor(this.cursor)
        } else {
            this.enableCursor(DEFAULT_CURSOR);
        }

        this.onToggle(toggleButton.isActive());
    }

    onToggle(isActive) {
        alert("Not implemented yet!");
    }

    enableCursor(cursor) {
        this.getMap().on('pointermove', (e) => {
            if (e.dragging) {
                return;
            }

            this.getMap().getTarget().style.cursor = cursor;
        });
    }
}