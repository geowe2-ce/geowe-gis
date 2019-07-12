import { ZoomTool } from '../../tool/base/ZoomTool';

export class ZoomInTool extends ZoomTool {
    constructor(map) {
        super({ id: "zoomInTool", map: map });
    }

    onToolClicked() {
        this.getControl().zoomIn();
    }
}