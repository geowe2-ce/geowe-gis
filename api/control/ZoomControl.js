import { extend } from 'ol/extent';
import { Vector } from 'ol/layer';
import { always } from 'ol/events/condition';
import DragZoom from 'ol/interaction/DragZoom';

import { Control } from './Control';

export class ZoomControl extends Control {
    constructor(map) {
        super(map);

        this.defaultExtent = this.getSettingsHolder().getSetting("map.extent");
        this.dragZoom = new DragZoom({
            duration: 200,
            condition: always
        });
    }

    changeZoom(inc) {
        const zoom = this.view.getZoom();
        this.view.setZoom(zoom + inc);
    }

    zoomIn() {
        this.changeZoom(0.5);
    }

    zoomOut() {
        this.changeZoom(-0.5);
    }

    zoomToExtent() {
        var size = this.map.getSize();
        this.view.fit(this.getMaxExtent(), size);
    }

    enableZoomBox(enabled) {
        this.dragZoom.setActive(enabled);

        if (enabled)
            this.map.addInteraction(this.dragZoom);
        else
            this.map.removeInteraction(this.dragZoom);
    }

    getMaxExtent() {
        var maxExtent = undefined;
        const layers = this.map.getLayers();

        layers.forEach((layer) => {
            if (layer instanceof Vector) {
                const layerExtent = layer.getSource().getExtent();

                if (maxExtent == undefined)
                    maxExtent = layerExtent;
                else {
                    maxExtent = extend(maxExtent, layerExtent);
                }
            }
        });

        if (maxExtent == undefined)
            maxExtent = this.defaultExtent;

        return maxExtent;
    }
}