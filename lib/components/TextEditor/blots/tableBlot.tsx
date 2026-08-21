import { Quill } from 'react-quill';

const BlockEmbed = Quill.import('blots/block/embed');
// const Container = Quill.import('blots/container');
// const Block = Quill.import('blots/block');

class Td extends BlockEmbed {
    static blotName = 'td';

    static tagName = 'TD';

    static create(value: { attributes: NamedNodeMap; html: string }) {
        const node = super.create(value);
        console.log('create Td');
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        node.setAttribute('contenteditable', true);
        // node.innerHTML = value.html;
        return node;
    }

    static value(node: HTMLElement) {
        return {
            attributes: node.attributes,
            html: node.innerHTML,
        };
    }

    static deleteAt(index: number, length: number) {
        console.log('delete td');
        // Prevent the default deletion behavior under specific conditions
        // For example, prevent the cell from being deleted if it would cause the table to be removed
        if (this.text.length === 1 || length === this.text.length) {
            // Prevent the cell from being deleted; maybe insert a space or handle differently
            this.insertAt(index, ' '); // Insert a space to prevent deletion
        } else {
            // Default behavior
            super.deleteAt(index, length);
        }
    }
}
class Th extends BlockEmbed {
    static blotName = 'th';

    static tagName = 'TH';

    static create(value: { attributes: NamedNodeMap; html: string }) {
        const node = super.create(value);
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        node.innerHTML = value.html;
        return node;
    }

    static value(node: HTMLElement) {
        return {
            attributes: node.attributes,
            html: node.innerHTML,
        };
    }
}

class Tr extends BlockEmbed {
    static blotName = 'tr';

    static tagName = 'TR';

    static allowedChildren = [Td, Th];

    static create(value: { attributes: NamedNodeMap; html: string }) {
        const node = super.create(value);
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        // node.innerHTML = value.html;
        return node;
    }

    static value(node: HTMLElement) {
        return {
            attributes: node.attributes,
            html: node.innerHTML,
        };
    }
}

class Thead extends BlockEmbed {
    static blotName = 'thead';

    static tagName = 'THEAD';

    // static allowedChildren = [Tr, Td, Th];

    static create(value: { attributes: NamedNodeMap; html: string }) {
        const node = super.create(value);
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        node.innerHTML = value.html;
        return node;
    }

    static value(node: HTMLElement) {
        return {
            attributes: node.attributes,
            html: node.innerHTML,
        };
    }
}

class Tbody extends BlockEmbed {
    static blotName = 'tbody';

    static tagName = 'TBODY';

    // static allowedChildren = [Tr, Td];

    static create(value: { attributes: NamedNodeMap; html: string }) {
        console.log('create Tbody');
        const node = super.create(value);
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        // node.innerHTML = value.html;
        return node;
    }

    static value(node: HTMLElement) {
        return {
            attributes: node.attributes,
            html: node.innerHTML,
        };
    }
}
class Tfoot extends BlockEmbed {
    static blotName = 'tfoot';

    static tagName = 'TFOOT';

    // static allowedChildren = [Tr, Td];

    static create(value: { attributes: NamedNodeMap; html: string }) {
        const node = super.create(value);
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        node.innerHTML = value.html;
        return node;
    }

    static value(node: HTMLElement) {
        return {
            attributes: node.attributes,
            html: node.innerHTML,
        };
    }
}

class Table extends BlockEmbed {
    static blotName = 'table';

    static tagName = 'TABLE';

    static allowedChildren = [Tbody, Tfoot, Thead, Th, Tr, Td];

    static create(value: { attributes: NamedNodeMap; html: string }) {
        console.log('create table');
        const node = super.create('table');
        Array.from(value.attributes).forEach((attribute) => {
            node.setAttribute(attribute.nodeName, attribute.nodeValue);
        });
        // node.innerHTML = value.html;
        return node;
    }

    // static value(node: HTMLElement) {
    //     return {
    //         attributes: node.attributes,
    //         html: node.innerHTML,
    //     };
    // }

    // static deleteAt(index: number, length: number) {
    //     console.log('delete table');
    //     // Prevent the default deletion behavior under specific conditions
    //     // For example, prevent the cell from being deleted if it would cause the table to be removed
    //     if (this.text.length === 1 || length === this.text.length) {
    //         // Prevent the cell from being deleted; maybe insert a space or handle differently
    //         this.insertAt(index, ' '); // Insert a space to prevent deletion
    //     } else {
    //         // Default behavior
    //         super.deleteAt(index, length);
    //     }
    // }
}
Quill.register(Td, true);
Quill.register(Tr, true);
Quill.register(Th, true);
Quill.register(Thead, true);
Quill.register(Tbody, true);
Quill.register(Tfoot, true);
Quill.register(Table, true);

export default Table;
