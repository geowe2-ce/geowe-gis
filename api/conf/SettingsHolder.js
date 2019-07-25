import defaultMapConfig from '../conf/DefaultMapConfig.json';
import defaultLayerCatalog from '../conf/DefaultLayerCatalog.json';
import defaultToolConfig from '../conf/DefaultToolConfig.json';

import es_es from '../i18n/es_es.json';

class SettingsHolder {
    constructor() {
        this.settings = {};
    }

    loadSettings(settings) {
        if (settings != undefined) {
            this.writeSettings(settings);
        }
    }

    loadURLSettings(settingsURL, onSettingsReady) {
        fetch(settingsURL).then((response) => {
            return response.json();
        }).then((json) => {
            this.loadSettings(json);
            onSettingsReady();
        });
    }

    writeSettings(jsonObj, parent) {
        var currentParent = parent != undefined ? parent : "";
        var previousParent = parent != undefined ? parent : "";

        for (var key in jsonObj) {
            if (typeof jsonObj[key] == "object" && !Array.isArray(jsonObj[key])) {
                currentParent += currentParent.length > 0 ? "." + key : key
                this.writeSettings(jsonObj[key], currentParent);
                currentParent = previousParent;
            } else {
                this.setSetting(currentParent + "." + key, jsonObj[key]);
            }
        }
    }

    getSetting(key) {
        var keys = key.split(".");
        var value;

        keys.forEach((key) => {
            if (value == undefined)
                value = this.settings[key];
            else
                value = value[key];
        });

        return value;
    }

    setSetting(key, value) {
        var keys = key.split(".");
        var targetKey = keys.pop();
        var child;

        keys.forEach((key) => {
            if (child == undefined) {
                if (this.settings[key] == undefined) {
                    this.settings[key] = {};
                }

                child = this.settings[key];
            } else {
                if (child[key] == undefined) {
                    child[key] = {};
                }

                child = child[key];
            }
        });

        child[targetKey] = value;
    }

    getSettings() {
        return this.settings;
    }
}

const settingsHolder = new SettingsHolder();
settingsHolder.loadSettings(defaultMapConfig);
settingsHolder.loadSettings(defaultLayerCatalog);
settingsHolder.loadSettings(defaultToolConfig);
settingsHolder.loadSettings(es_es);

export default settingsHolder;