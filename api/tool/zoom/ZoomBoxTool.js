import { ToggleButtonTool } from '../../tool/base/ToggleButtonTool';
import { ZoomControl } from '../../control/ZoomControl';


export class ZoomBoxTool extends ToggleButtonTool {
    constructor(map) {
        super({ id: "zoomBoxTool", map: map });
        this.zoomControl = new ZoomControl(map);
    }

    onToggle(isActive) {
        this.zoomControl.enableZoomBox(isActive);
    }
}