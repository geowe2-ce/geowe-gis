import { ToggleButtonTool } from "../base/ToggleButtonTool";

export class PanTool extends ToggleButtonTool {
    constructor(map) {
        super({ id: "panTool", map: map });
    }

    onToggle(isActive) {}
}