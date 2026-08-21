import { Quill } from 'react-quill';

import { CLICK_EVENT } from '..';

const BlockEmbed = Quill.import('blots/block/embed');

class CtaButtonBlot extends BlockEmbed {
    static blotName = 'ctaButton';

    static tagName = 'DIV';

    static className = 'imbrace-ctaButton';

    static create(value: { text: string; href: string; touchpoint_id?: string | null }) {
        const node = super.create() as HTMLDivElement;

        const anchor = document.createElement('a');
        anchor.textContent = value.text;
        anchor.setAttribute('href', value.href);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
        anchor.setAttribute('title', value.text);
        anchor.setAttribute(
            'style',
            'padding: 10px 36px; background: #156df2; border-radius: 8px; font-size: 14px; font-weight: 800; text-transform: uppercase; color: white; text-decoration: none; display: inline-block;',
        );
        node.setAttribute('data-text', value.text);
        node.setAttribute('data-href', value.href);
        if (value.touchpoint_id) {
            node.setAttribute('data-touchpoint_id', value.touchpoint_id);
        }

        node.setAttribute('data-custom-blot', this.blotName);
        node.appendChild(anchor);
        node.setAttribute('contenteditable', 'false');

        node.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            node.dispatchEvent(
                new CustomEvent(CLICK_EVENT, {
                    bubbles: true,
                    detail: {
                        blotName: this.blotName,
                    },
                }),
            );
        });
        return node;
    }

    updateValue(data: { text: string; href: string; touchpoint_id?: string | null }) {
        this.domNode.setAttribute('data-text', data.text);
        this.domNode.setAttribute('data-href', data.href);
        if (data.touchpoint_id) {
            this.domNode.setAttribute('data-touchpoint_id', data.touchpoint_id);
        } else {
            this.domNode.removeAttribute('data-touchpoint_id');
        }
        const anchor = this.domNode.querySelector('a');
        if (anchor) {
            anchor.textContent = data.text;
            anchor.setAttribute('title', data.text);
            anchor.setAttribute('href', data.href);
            if (data.touchpoint_id) {
                anchor.setAttribute('data-touchpoint_id', data.touchpoint_id);
            } else {
                this.domNode.removeAttribute('data-touchpoint_id');
            }
        }
    }

    getValue() {
        return {
            href: this.domNode.dataset.href as string,
            text: this.domNode.dataset.text as string,
            touchpoint_id: this.domNode.dataset.touchpoint_id as string,
        };
    }

    static formats(node: HTMLElement) {
        return {
            href: node.dataset.href,
            text: node.dataset.text,
            touchpoint_id: node.dataset.touchpoint_id,
        };
    }

    static value(node: HTMLElement) {
        return {
            href: node.dataset.href,
            text: node.dataset.text,
            touchpoint_id: node.dataset.touchpoint_id,
        };
    }
}

Quill.register(CtaButtonBlot);

export default CtaButtonBlot;
