import { SimpleButton } from "geowe-ui-js/api/button/SimpleButton";

export class Tool extends SimpleButton {
    constructor(options) {
        super(options.id, options.label, options.iconFont, function() {});

        /*if (options.map == undefined)
            throw new Exception("Can not create tool without map reference");

        this.element.addEventListener("click", (e) => this.onToolClicked());
        this.map = options.map;*/
    }

    /*onToolClicked() {
        alert("To be implemented");
    }*/
}

function pepe() {

}