import { ToggleButtonTool } from "../base/ToggleButtonTool";
import { SelectControl } from "../../control/SelectControl";


export class SelectTool extends ToggleButtonTool {
    constructor(map) {
        super({ id: "selectTool", map: map });
        this.selectControl = new SelectControl(map);
    }

    onToggle(isActive) {
        this.selectControl.enable(isActive);
    }
}