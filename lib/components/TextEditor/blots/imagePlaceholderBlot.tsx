import { Quill } from 'react-quill';

const Parchment = Quill.import('parchment');

class ImagePlaceHolderBlot extends Parchment.Embed {
    static blotName = 'imagePlaceHolder';

    static tagName = 'DIV';

    static className = 'imbrace-imagePlaceHolder';

    static create(value: { url: string; id: string; fileId?: string }) {
        const node = super.create();

        node.setAttribute('data-custom-blot', this.blotName);
        node.setAttribute('data-id', value.id);
        node.setAttribute('contenteditable', 'false');
        if (!value.fileId) {
            node.innerHTML =
                '<div class="loadingContainer"><span role="progressbar"><svg viewBox="22 22 44 44"><circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle></svg></span></div>';
        } else {
            node.setAttribute('data-file-id', value.fileId);
        }

        const img = document.createElement('img');
        img.setAttribute('crossOrigin', 'anonymous');
        img.setAttribute('src', value.url);

        if (!value.fileId) {
            img.setAttribute('class', 'uploading');
        }
        node.appendChild(img);
        return node;
    }

    updateValue(data: { url?: string; fileId?: string }) {
        if (data.fileId) {
            this.domNode.setAttribute('data-file-id', data.fileId);
        }
        this.domNode.querySelector('.loadingContainer')?.remove();
        const img = this.domNode.getElementsByTagName('img')[0];
        if (img && data.url) {
            img.setAttribute('class', '');
            img.setAttribute('src', data.url);
        }
    }

    getValue() {
        const img = this.domNode.getElementsByTagName('img')[0];
        return {
            id: this.domNode.dataset.id as string,
            fileId: this.domNode.dataset.fileId as string,
            url: img?.getAttribute('src'),
        };
    }

    static formats(node: HTMLElement) {
        const img = node.getElementsByTagName('img')[0];
        return {
            id: node.dataset.id as string,
            fileId: node.dataset.fileId,
            url: img?.getAttribute('src'),
        };
    }

    static value(node: HTMLElement) {
        const img = node.getElementsByTagName('img')[0];
        return {
            id: node.dataset.id as string,
            fileId: node.dataset.fileId,
            url: img?.getAttribute('src'),
        };
    }
}

Quill.register(ImagePlaceHolderBlot);

export default ImagePlaceHolderBlot;
