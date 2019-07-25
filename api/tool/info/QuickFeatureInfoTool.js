import { ToggleButtonTool } from '../base/ToggleButtonTool';
import FeatureInfoControl from '../../control/FeatureInfoControl';


export class QuickFeatureInfoTool extends ToggleButtonTool {
    constructor(map) {
        super({ id: "quickFeatureInfoTool", map: map });
        this.featureInfoControl = new FeatureInfoControl(map);

    }

    onToggle(isActive) {
        this.featureInfoControl.enable(isActive);
    }
}