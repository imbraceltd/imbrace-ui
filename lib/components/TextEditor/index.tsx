import type { QueryFunction } from '@tanstack/react-query';
import type { HTMLAttributes } from 'react';
import { lazy, Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { isCSR } from '../../utils';
import type { Option } from '../Field';
import { Space } from '../Space';
import type { Attachment } from '../Upload/types';
import type DataBoardVariableBlot from './blots/dataBoardVariableBlot';

export interface BlotsProps {
    ctaButton?: {
        newTouchpointOnClick?: ({ setValue }: { setValue: (data: { id: string; url: string }) => void }) => void;
        request?: (params: { setValue: (url: string) => void; setCurrentType: (type: string) => void }) => QueryFunction<
            Option[],
            [
                'ctaButtonType',
                {
                    type?: string | undefined;
                },
            ],
            never
        >;
    };
    dataBoardVariable?: {
        boardId?: string;
        blotsValidation?: (blotsInstance: DataBoardVariableBlot[]) => Promise<void>;
        fieldsRequest?: QueryFunction<Option[], ['variable-fields', string | undefined], never>;
        boardsRequest?: QueryFunction<Option[], ['variable-boards'], never>;
        hideSource?: boolean;
    };
    unsubscribe?: {
        link?: string;
    };
}
export interface TextEditorProps {
    placeholder?: string;
    value?: {
        content?: string;
        files?: Attachment[];
    };
    onChange?: (value: { content?: string; files?: Attachment[] }) => void;
    onFilesChange?: (file: Attachment) => void;
    onUpload?: (file: File) => Promise<{ url: string; id: string; name: string }>;
    onDelete?: (fileId: string) => Promise<unknown>;
    fileValidation?: (file: File) => Promise<boolean | string>;

    onImageUpload?: (file: File) => Promise<{ url: string; id: string; name: string }>;
    onImageDelete?: (fileId: string) => Promise<unknown>;
    onGetInfo?: (fileId: string) => Promise<{ url?: string; id: string; name?: string; size?: number }>;
    // formats?: Record<CustomFormatsType, boolean | undefined>;
    containerProps?: HTMLAttributes<HTMLDivElement>;
    showFileSize?: boolean;
    blotsProps?: BlotsProps;
}

export const DefaultCustomFormats = {
    bold: true,
    italic: true,
    underline: true,
    link: true,
    image: true,
    ctaButton: true,
    dataBoardVariable: true,
    listBullet: true,
    listOrdered: true,
    unsubscribe: true,
    align: true,
    attachFile: true,
    undo: true,
    redo: true,
    blockquote: true,
    clearFormat: true,
    indentIncrease: true,
    indentDecrease: true,
    font: true,
    size: true,
    color: true,
    background: true,
};

export const CLICK_EVENT = 'customBlotClickEvent';

export const FORMATS = [
    'bold',
    'italic',
    'underline',
    'link',
    'list',
    'unsubscribe',
    'align',
    'blockquote',
    'indent',
    'font',
    'size',
    'color',
    'background',
    'ctaButton',
    'dataBoardVariable',
    'image',
    'imagePlaceHolder',
    'table',
    'tr',
    'td',
    'tbody',
];

export const TextEditor = (props: TextEditorProps) => {
    const Editor = useMemo(() => {
        if (isCSR) {
            const component = lazy(() => import('./editor'));
            return component;
        }
        return () => null;
    }, []);

    if (!isCSR) {
        return null;
    }

    return (
        <Space size={12} style={{ width: '100%' }} direction="vertical">
            <ErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                    <Editor {...props} />
                </Suspense>
            </ErrorBoundary>
        </Space>
    );
};
