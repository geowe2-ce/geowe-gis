import { ZoomTool } from '../../tool/base/ZoomTool';

export class ZoomOutTool extends ZoomTool {
    constructor(map) {
        super({ id: "zoomOutTool", map: map });
    }

    onToolClicked() {
        this.getControl().zoomOut();
    }
}