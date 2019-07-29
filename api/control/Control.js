import settingsHolder from '../conf/SettingsHolder';

export class Control {
    constructor(map) {
        this.map = map;
        this.view = this.map.getView();
        this.listeners = [];
    }

    getSettingsHolder() {
        return settingsHolder;
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    notify(data) {
        this.listeners.forEach((listener) => {
            listener.onControlTriggered(data);
        });
    }
}