import settingsHolder from '../conf/SettingsHolder';

export class Control {
    constructor(map) {
        this.map = map;
        this.view = this.map.getView();
    }

    getSettingsHolder() {
        return settingsHolder;
    }
}