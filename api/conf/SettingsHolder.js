import defaultMapConfig from '../conf/DefaultMapConfig.json';
import defaultLayerCatalog from '../conf/DefaultLayerCatalog.json';
import defaultToolConfig from '../conf/DefaultToolConfig.json';

class SettingsHolder {
    constructor() {
        this.locale = "es";
        this.settings = {};
    }

    setLocale(lang) {
        this.locale = lang;
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

    getLocalizedSetting(key) {
        const setting = this.getSetting(`${this.locale}.${key}`);
        return setting != undefined ? setting : "fas fa-question-circle"; //"####";
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

export default settingsHolder;