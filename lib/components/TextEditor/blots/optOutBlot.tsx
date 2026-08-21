import { Quill } from 'react-quill';

import { CLICK_EVENT } from '..';
const BlockEmbed = Quill.import('blots/block/embed');

class OptOutBlot extends BlockEmbed {
    static blotName = 'unsubscribe';

    static tagName = 'DIV';

    static className = 'imbrace-unsubscribe';

    static getUnsubscribeText(language: string) {
        switch(language) {
            case 'EN':
                return {
                    message: 'No longer want to receive any email from the organization? ',
                    link: 'opt-out'
                };
            case '繁體':
                return {
                    message: '不想再收到來自組織的任何電子郵件？ ',
                    link: '取消訂閱'
                };
            case '简体':
                return {
                    message: '不想再收到来自组织的任何电子邮件？ ',  
                    link: '退订'
                };
            default:
                return {
                    message: 'No longer want to receive any email from the organization? ',
                    link: 'opt-out'
                };
        }
    }

    static create(value: { link?: string; language?: string }) {
        const node = super.create() as HTMLDivElement;
        const anchor = document.createElement('a');
        const text = this.getUnsubscribeText(value?.language || 'EN'); 
        anchor.textContent = text.link;
        anchor.setAttribute('href', `${value?.link ?? ''}`);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
        anchor.setAttribute('title', text.link);
        anchor.setAttribute('style', 'color: #333;');
        node.textContent = text.message;
        node.setAttribute('style', 'text-align: center; color: #333; font-size: 14px; line-height: 20px;');
        node.setAttribute('data-custom-blot', this.blotName);
        node.setAttribute('data-language', value?.language || 'EN');
        node.appendChild(anchor);
        node.setAttribute('contenteditable', 'false');

        node.addEventListener('click', () => {
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

    getValue() {
        return {
            link: (this.domNode as HTMLElement).querySelector('a')?.getAttribute('href'),
            language: (this.domNode as HTMLElement).getAttribute('data-language')
        };
    }

    static formats(node: HTMLElement) {
        return {
            link: node.querySelector('a')?.getAttribute('href'),
            language: node.getAttribute('data-language')
        };
    }

    static value(node: HTMLElement) {
        return {
            link: node.querySelector('a')?.getAttribute('href'),
            language: node.getAttribute('data-language')
        };
    }
}

Quill.register(OptOutBlot);

export default OptOutBlot;