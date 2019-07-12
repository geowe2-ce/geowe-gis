import { ZoomTool } from '../../tool/base/ZoomTool';

export class ZoomToExtentTool extends ZoomTool {
    constructor(map) {
        super({ id: "zoomToExtentTool", map: map });
    }

    onToolClicked() {
        this.getControl().zoomToExtent();
    }
}