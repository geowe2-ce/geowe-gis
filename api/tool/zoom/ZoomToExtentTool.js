import { Tool } from "../base/Tool";

export class ZoomToExtentTool extends Tool {
    constructor(map) {
        super({ id: "zoomToExtentTool", iconFont: "fas fa-globe-americas", map: map });
    }

    onToolClicked() {
        alert("Canela");
    }
}