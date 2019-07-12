import { UIElement } from 'geowe-ui-js/api/base/UIElement';
import settingsHolder from '../../conf/SettingsHolder';

export class Tool extends UIElement {
    constructor(uiElement, map) {
        super(uiElement.getId(), "");

        if (map == undefined)
            throw "Can not create tool without map reference";

        this.map = map;
        this.uiElement = uiElement;
        this.element = uiElement.getDOMObject();
    }

    getMap() {
        return this.map;
    }

    getUIElement() {
        return this.uiElement;
    }

    getSettingsHolder() {
        return settingsHolder;
    }
}