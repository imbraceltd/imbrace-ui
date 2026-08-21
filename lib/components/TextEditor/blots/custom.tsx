import { Quill } from 'react-quill';

const Parchment = Quill.import('parchment');

// const customFontFamilyAttributor = new Parchment.Attributor.Style('custom-family-attributor', 'font-family');
const customSizeAttributor = new Parchment.Attributor.Class('custom-size-attributor', 'ql-size');
// const customColorAttributor = new Parchment.Attributor.Style('custom-color-attributor', 'color');

const ListItemBlot = Quill.import('formats/list/item');

class CustomListItem extends ListItemBlot {
    // optimize(context: unknown) {
    //     super.optimize(context);

    //     if (this.children.length === 1) {
    //         const child = this.children.head;
    //         const attributes = child?.attributes?.attributes;
    //         console.log(attributes);
    //         if (attributes && attributes?.size) {
    //             const value = attributes.size.value(child.domNode);
    //             super.format('custom-size-attributor', value);
    //         } else {
    //             // super.format('custom-color-attributor', false);
    //             // super.format('custom-family-attributor', false);
    //             super.format('custom-size-attributor', false);
    //         }
    //     } else {
    //         if (this.attributes.attributes.hasOwnProperty('custom-size-attributor')) {
    //             super.format('custom-size-attributor', false);
    //         }
    //     }
    // }
    format(name: string, value: string) {
        console.log(name, value);
        if (name === this.statics.blotName && value) {
            this.domNode.setAttribute('data-list', value);
        } else {
            super.format(name, value);
        }
    }
}

// Quill.register(customColorAttributor, true);
// Quill.register(customFontFamilyAttributor, true);
Quill.register(customSizeAttributor, true);
Quill.register(CustomListItem, true);
