import { ButtonTool } from '../base/ButtonTool';
import { ZoomControl } from '../../control/ZoomControl';

export class ZoomTool extends ButtonTool {
    constructor(options) {
        super(options);
        this.zoomControl = new ZoomControl(options.map);
    }

    getControl() {
        return this.zoomControl;
    }
}