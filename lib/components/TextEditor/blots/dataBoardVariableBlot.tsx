import { Quill } from 'react-quill';

import { CLICK_EVENT } from '..';

const Parchment = Quill.import('parchment');

class DataBoardVariableBlot extends Parchment.Embed {
    static blotName = 'dataBoardVariable';

    static tagName = 'SPAN';

    static className = 'imbrace-dataBoardVariable';

    static create(value: { boardId: string; fieldId: string; name: string }) {
        const node = super.create();
        node.setAttribute('data-name', value.name);
        node.setAttribute('data-board-id', value.boardId ?? '');
        node.setAttribute('data-field-id', value.fieldId ?? '');
        if (!value.boardId && !value.fieldId) {
            node.classList.toggle('placeholder', true);
        }

        node.setAttribute('data-custom-blot', this.blotName);
        node.setAttribute('contenteditable', 'false');
        node.textContent = `{{${value.name}}}`;

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

    getCurrentBoardId() {
        return this.domNode.dataset.boardId;
    }

    getCurrentFieldId() {
        return this.domNode.dataset.fieldId;
    }

    toggleInvalid(val: boolean) {
        this.domNode.classList.toggle('invalid', val);
    }

    changeCurrentBoardId(boardId: string) {
        const origBoardId = this.domNode.dataset.boardId;
        if (origBoardId) {
            if (origBoardId !== boardId && boardId) {
                this.toggleInvalid(true);
            }

            if (origBoardId === boardId) {
                this.toggleInvalid(false);
            }
        } else {
            this.domNode.setAttribute('data-board-id', boardId);
            this.domNode.classList.toggle('placeholder', false);
        }
    }

    updateValue(data: { boardId: string; fieldId: string; name: string }) {
        this.domNode.setAttribute('data-name', data.name);
        this.domNode.setAttribute('data-board-id', data.boardId ?? '');
        this.domNode.setAttribute('data-field-id', data.fieldId ?? '');
        this.domNode.textContent = `{{${data.name}}}`;
        this.domNode.classList.toggle('invalid', false);
        if (!data.boardId && !data.fieldId) {
            this.domNode.classList.toggle('placeholder', true);
        } else {
            this.domNode.classList.toggle('placeholder', false);
        }
    }

    getValue() {
        return {
            name: this.domNode.dataset.name as string,
            boardId: this.domNode.dataset.boardId as string,
            fieldId: this.domNode.dataset.fieldId as string,
        };
    }

    static formats(node: HTMLElement) {
        return {
            name: node.dataset.name,
            boardId: node.dataset.boardId,
            fieldId: node.dataset.fieldId,
        };
    }

    static value(node: HTMLElement) {
        return {
            name: node.dataset.name,
            boardId: node.dataset.boardId,
            fieldId: node.dataset.fieldId,
        };
    }
}

Quill.register(DataBoardVariableBlot);

export default DataBoardVariableBlot;