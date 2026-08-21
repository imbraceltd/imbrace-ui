import { TinyColor } from '@ctrl/tinycolor';
import { uniqueId } from 'lodash';
import type { Quill as TypeQuill, RangeStatic, SelectionChangeHandler, TextChangeHandler } from 'quill';
import type { FormEvent, MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type ReactQuill from 'react-quill';
import { Quill } from 'react-quill';

import { getBase64FromFile } from '../../utils';
import { useColorPicker } from '../ColorPicker';
import { useDialog } from '../Dialog';
import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';
import type { BlotsProps } from '.';
import { CLICK_EVENT } from '.';
import CtaButtonBlot from './blots/ctaButtonBlot';
import DataBoardVariableBlot from './blots/dataBoardVariableBlot';
import ImagePlaceHolderBlot from './blots/imagePlaceholderBlot';
import type OptOutBlot from './blots/optOutBlot';
import type { CTAButtonFormData } from './ctaButtonForm';
import CTAButtonForm, { CTAButtonFormSchema } from './ctaButtonForm';
import DataBoardVariableForm from './dataBoardVariableForm';
import styles from './index.module.scss';
import { linkPopper } from './linkPopper';

export type CustomFormatsType =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'link'
    | 'image'
    | 'ctaButton'
    | 'dataBoardVariable'
    | 'listBullet'
    | 'listOrdered'
    | 'unsubscribe'
    | 'align'
    | 'attachFile'
    | 'undo'
    | 'redo'
    | 'blockquote'
    | 'clearFormat'
    | 'indentIncrease'
    | 'indentDecrease'
    | 'font'
    | 'size'
    | 'color'
    | 'background'
    | 'imagePlaceHolder';

interface CustomFormatsProps {
    type: CustomFormatsType;
    reactQuillRef: RefObject<ReactQuill>;
    onAttachFile?: (uploadRef: RefObject<HTMLInputElement>) => (event: FormEvent<HTMLInputElement>) => void;
    onImageUpload?: (file: File) => Promise<{ url: string; id: string; name: string }>;
    onImageDelete?: (fileId: string) => Promise<unknown>;
    dataBoardVariableOptions?: BlotsProps['dataBoardVariable'];
    ctaButtonOptions?: BlotsProps['ctaButton'];
    unsubscribeLink?: string;
}

export function findCustomBlot<D>(quill: TypeQuill, type: CustomFormatsType, customRange?: RangeStatic) {
    const range = customRange || quill.getSelection();
    if (range) {
        const [leaf] = quill.getLeaf(range.index);

        if (leaf) {
            let node = leaf.domNode;
            while (node && node !== quill.root) {
                if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('data-custom-blot') === type) {
                    return leaf as D;
                }
                node = node.parentNode;
            }
        }
    }
    return false;
}

const FontOptions = [
    {
        text: 'Sans Serif',
        index: 'sans_serif',
        typographyProps: {
            style: {
                fontFamily: 'Helvetica, Arial, sans-serif',
            },
        },
    },
    {
        text: 'Serif',
        index: 'serif',
        typographyProps: {
            style: {
                fontFamily: 'Georgia, Times New Roman, serif',
            },
        },
    },
    {
        text: 'Monospace',
        index: 'monospace',
        typographyProps: {
            style: {
                fontFamily: 'Monaco, Courier New, monospace',
            },
        },
    },
];
const SizeOptions = [
    {
        text: '12px',
        index: 'small',
        typographyProps: {
            style: {
                fontSize: '12px',
            },
        },
    },
    {
        text: '16px',
        index: 'normal',
        typographyProps: {
            style: {
                fontSize: '16px',
            },
        },
    },
    {
        text: '24px',
        index: 'large',
        typographyProps: {
            style: {
                fontSize: '24px',
            },
        },
    },
    {
        text: '42px',
        index: 'huge',
        typographyProps: {
            style: {
                fontSize: '42px',
            },
        },
    },
];

const UnSubscribeOptions = [
    {
        text: 'in English (US)',
        index: 'EN',
    },
    {
        text: 'in 繁體中文',
        index: '繁體',
    },
    {
        text: 'in 简体中文',
        index: '简体',
    },
];

const CustomFormats = memo((props: CustomFormatsProps) => {
    const { type, reactQuillRef, onAttachFile, onImageUpload, onImageDelete, dataBoardVariableOptions, ctaButtonOptions, unsubscribeLink } =
        props;
    const uploadRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const [{ dialogForm }, dialogHolder] = useDialog();
    const [{ colorPicker }, colorPickerHolder] = useColorPicker();

    const [active, setActive] = useState<boolean | string | number | CtaButtonBlot | DataBoardVariableBlot | OptOutBlot>(false);
    const [disabled, setDisabled] = useState(false);
    const savedRange = useRef<RangeStatic | null>({ index: 0, length: 0 });

    const restoreSelection = useCallback(() => {
        const quill = reactQuillRef?.current?.getEditor() as unknown as TypeQuill;
        const range = savedRange.current;

        if (range) {
            setTimeout(() => {
                quill.setSelection(range);
            }, 1);
        }
    }, [reactQuillRef]);

    const getFormats = useCallback(
        (range?: RangeStatic) => {
            const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;
            const formats = quill?.getFormat(range || { index: quill.getLength(), length: 0 });

            switch (type) {
                case 'listBullet':
                    setActive(formats?.list ? formats.list === 'bullet' : false);
                    break;
                case 'listOrdered':
                    setActive(formats?.list ? formats.list === 'ordered' : false);
                    break;
                case 'ctaButton':
                    setActive(findCustomBlot<CtaButtonBlot>(quill, 'ctaButton'));
                    break;
                case 'dataBoardVariable':
                    setActive(findCustomBlot<DataBoardVariableBlot>(quill, 'dataBoardVariable'));
                    break;
                case 'link':
                    setActive(formats?.link || false);
                    if (formats?.link && quill && range) {
                        // @ts-expect-error quill type
                        const quillContainer = quill.container.getBoundingClientRect();
                        // @ts-expect-error quill type
                        const [link, offset] = quill.scroll.descendant(Quill.import('formats/link'), range.index);

                        if (link != null) {
                            const linkRange = {
                                index: range.index - offset,
                                length: link.length(),
                            };
                            const bounds = quill.getBounds(linkRange.index, linkRange.length);

                            linkPopper({
                                anchorEl: {
                                    getBoundingClientRect: () => ({
                                        top: quillContainer.top + bounds.bottom,
                                        left: quillContainer.left + bounds.left,
                                        right: quillContainer.left + bounds.right,
                                        bottom: quillContainer.top + bounds.top,
                                        width: bounds.width,
                                        height: bounds.height,
                                    }),
                                } as HTMLElement,
                                defaultValues: {
                                    link: formats.link,
                                },
                                onDone: (newLink) => {
                                    quill.formatText(linkRange, 'link', newLink, 'silent');
                                },
                            });
                        }
                    }
                    break;
                case 'bold':
                case 'italic':
                case 'underline':
                case 'align':
                case 'blockquote':
                case 'font':
                case 'size':
                    setActive(formats?.[type] || false);
                    break;
                case 'color':
                case 'background': {
                    const color = new TinyColor(formats?.[type]);

                    setActive(color.isValid ? color.toHexString() : false);
                    break;
                }
                case 'clearFormat':
                case 'unsubscribe':
                case 'indentDecrease':
                case 'indentIncrease':
                default:
                    break;
            }
        },
        [reactQuillRef, type],
    );

    const onSelectionChange: SelectionChangeHandler = useCallback(
        (range) => {
            const quill = reactQuillRef?.current?.getEditor() as unknown as TypeQuill;

            if (range && quill) {
                savedRange.current = range;
                getFormats(range);
            }
        },
        [reactQuillRef, getFormats],
    );

    const onTextChange: TextChangeHandler = useCallback(
        (delta, oldDelta) => {
            const quill = reactQuillRef?.current?.getEditor() as unknown as TypeQuill;

            if (savedRange.current) {
                getFormats(savedRange.current);
            }

            switch (type) {
                case 'unsubscribe': {
                    const customBlots = quill.getContents().ops.filter((op) => typeof op.insert === 'object' && op.insert.unsubscribe);

                    const needDisabled = customBlots.length > 0;
                    if (disabled !== needDisabled) {
                        setDisabled(needDisabled);
                    }
                    break;
                }
                case 'redo': {
                    // @ts-expect-error quill type
                    const needDisabled = quill.history.stack.redo.length <= 0;
                    if (disabled !== needDisabled) {
                        setDisabled(needDisabled);
                    }
                    break;
                }
                case 'undo': {
                    // @ts-expect-error quill type
                    const needDisabled = quill.history.stack.undo.length <= 0;
                    if (disabled !== needDisabled) {
                        setDisabled(needDisabled);
                    }
                    break;
                }
                case 'image': {
                    const curr = quill.getContents();
                    const diff = curr.diff(oldDelta);

                    diff.ops.forEach((op) => {
                        if (op.insert && op.insert.hasOwnProperty('imagePlaceHolder')) {
                            if (
                                !curr.ops.find(
                                    (contentOp) =>
                                        op.insert &&
                                        op.insert.hasOwnProperty('imagePlaceHolder') &&
                                        op.attributes?.id === contentOp.attributes?.id,
                                )
                            ) {
                                if (op.attributes?.fileId) {
                                    onImageDelete?.(op.attributes.fileId as string);
                                }
                            }
                        }
                    });
                    break;
                }
                default:
                    break;
            }
        },
        [reactQuillRef, type, disabled, getFormats, onImageDelete],
    );

    const openDataBoardVariableDialog = useCallback(
        (blot?: DataBoardVariableBlot) => {
            const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;
            const range = quill.getSelection();
            const isEditMode = !!blot;

            dialogForm<{ name: string; fieldId: string; boardId: string }>({
                title: isEditMode ? t('text_editor_update_variable') : t('text_editor_variable_title'),
                content: (methods) => (
                    <DataBoardVariableForm
                        methods={methods}
                        fieldsRequest={dataBoardVariableOptions?.fieldsRequest}
                        boardsRequest={dataBoardVariableOptions?.boardsRequest}
                        disableBoard={!!dataBoardVariableOptions?.boardId}
                        hideSource={dataBoardVariableOptions?.hideSource}
                    />
                ),
                defaultValues: isEditMode
                    ? {
                          ...blot?.getValue(),
                          boardId: blot?.getValue().boardId || dataBoardVariableOptions?.boardId,
                      }
                    : {
                          boardId: dataBoardVariableOptions?.boardId,
                      },
                confirmText: isEditMode ? t('text_editor_update_variable') : t('text_editor_insert_variable'),
                confirmButtonProps: {
                    size: 's',
                    sx: {
                        height: 40,
                    },
                },
                showCloseButton: true,
                actionsAlign: 'flex-start',
                hideCancelButton: true,
                onConfirm: async (formData) => {
                    if (isEditMode) {
                        blot.updateValue({ ...formData });
                    } else {
                        quill.insertEmbed(range?.index || 0, 'dataBoardVariable', { ...formData });
                        quill.insertText((range?.index || 0) + 1, '\n');
                    }

                    return true;
                },
                onClose: () => {},
            });
        },
        [dialogForm, t, dataBoardVariableOptions, reactQuillRef],
    );

    const openCtaButtonDialog = useCallback(
        (blot?: CtaButtonBlot) => {
            const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;
            const range = quill.getSelection();
            const isEditMode = !!blot;

            dialogForm<CTAButtonFormData, ReturnType<typeof CTAButtonFormSchema>>({
                title: t('text_editor_cta_button_setting'),
                content: (methods) => (
                    <CTAButtonForm
                        methods={methods}
                        defaultValues={isEditMode ? blot.getValue() : undefined}
                        newTouchpointOnClick={ctaButtonOptions?.newTouchpointOnClick}
                        request={ctaButtonOptions?.request}
                    />
                ),
                defaultValues: isEditMode ? blot.getValue() : undefined,
                confirmText: isEditMode ? t('text_editor_update_button') : t('text_editor_insert_button'),
                confirmButtonProps: {
                    size: 's',
                    sx: {
                        height: 40,
                    },
                },
                showCloseButton: true,
                actionsAlign: 'flex-start',
                hideCancelButton: true,
                schema: CTAButtonFormSchema(t),
                onConfirm: async (formData) => {
                    if (isEditMode) {
                        blot.updateValue(formData);
                    } else {
                        quill.insertEmbed(range?.index || 0, 'ctaButton', formData);
                        quill.insertText((range?.index || 0) + 1, '\n');
                    }

                    return true;
                },
                onClose: () => {},
            });
        },
        [dialogForm, t, ctaButtonOptions, reactQuillRef],
    );

    const handler = useCallback(
        (e: ReactMouseEvent<HTMLElement, MouseEvent>, extraValue?: unknown) => {
            const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;
            if (quill) {
                let range = quill.getSelection();
                if (!range) {
                    quill.focus();
                    range = { index: quill.getLength(), length: 0 };
                }

                const format = quill.getFormat(range.index, range.length);
                switch (type) {
                    case 'align':
                        const alignment = extraValue as 'left' | 'center' | 'right' | 'justify';
                        if (savedRange.current) {
                            const [line] = quill.getLine(savedRange.current.index);
                            quill.formatLine(line.offset(quill.scroll), 1, 'align', alignment === 'left' ? false : alignment);

                            setActive(alignment);
                            restoreSelection();
                        }

                        break;
                    case 'bold':
                        quill.format('bold', !format.bold);
                        setActive(!format.bold);

                        break;
                    case 'italic':
                        quill.format('italic', !format.italic);
                        setActive(!format.italic);

                        break;
                    case 'underline':
                        quill.format('underline', !format.underline);
                        setActive(!format.underline);

                        break;
                    case 'blockquote':
                        quill.format('blockquote', !format.blockquote);
                        setActive(!format.blockquote);

                        break;
                    case 'listBullet':
                        quill.format('list', format.list !== 'bullet' ? 'bullet' : false);
                        setActive(format.list !== 'bullet');

                        break;
                    case 'listOrdered':
                        quill.format('list', format.list !== 'ordered' ? 'ordered' : false);
                        setActive(format.list !== 'ordered');

                        break;
                    case 'attachFile':
                        uploadRef?.current?.click();

                        break;
                    case 'image': {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();

                        input.onchange = async () => {
                            const file = input.files?.[0];
                            if (file && range) {
                                let base64;
                                try {
                                    base64 = await getBase64FromFile(file);
                                } catch (error) {
                                    console.log(error);
                                }

                                if (base64) {
                                    quill.insertEmbed(range.index, 'imagePlaceHolder', { url: base64, id: uniqueId('base64File') });
                                    quill.insertText((range?.index || 0) + 1, '\n');
                                }
                                const cursorPosition = range.index + 1;
                                try {
                                    const imgBlot = findCustomBlot<ImagePlaceHolderBlot>(quill, 'imagePlaceHolder', {
                                        ...range,
                                        index: range.index + 1,
                                    });
                                    if (imgBlot instanceof ImagePlaceHolderBlot) {
                                        if (onImageUpload) {
                                            const { url, id } = await onImageUpload(file);
                                            imgBlot.updateValue({ fileId: id, url });
                                        } else {
                                            imgBlot.updateValue({});
                                        }
                                    }
                                } catch (error) {
                                    console.log(error);
                                    if (base64) {
                                        quill.deleteText(cursorPosition - 1, 1);
                                    }
                                }
                            }
                        };

                        break;
                    }
                    case 'redo':
                        quill.history.redo();

                        break;
                    case 'undo':
                        quill.history.undo();

                        break;
                    case 'link':
                        if (range && range.length !== 0) {
                            const bounds = quill.getBounds(range.index, range.length);
                            // @ts-expect-error quill type
                            const quillContainer = quill.container.getBoundingClientRect();
                            linkPopper({
                                anchorEl: {
                                    getBoundingClientRect: () => ({
                                        top: quillContainer.top + bounds.bottom,
                                        left: quillContainer.left + bounds.left,
                                        right: quillContainer.left + bounds.right,
                                        bottom: quillContainer.top + bounds.top,
                                        width: bounds.width,
                                        height: bounds.height,
                                    }),
                                } as HTMLElement,
                                onDone: (link) => {
                                    quill.format('link', link, 'silent');
                                },
                            });
                        } else {
                            quill.format('link', false);
                        }
                        break;
                    case 'ctaButton':
                        if (active instanceof CtaButtonBlot) {
                            openCtaButtonDialog(active);
                        } else {
                            openCtaButtonDialog();
                        }

                        break;
                    case 'dataBoardVariable':
                        if (active instanceof DataBoardVariableBlot) {
                            openDataBoardVariableDialog(active);
                        } else {
                            openDataBoardVariableDialog();
                        }
                        break;
                    case 'unsubscribe':
                        const existingBlots = quill
                            .getContents()
                            .ops?.filter((op) => typeof op.insert === 'object' && op.insert.unsubscribe);

                        if (!existingBlots || !existingBlots.length) {
                            quill.insertEmbed(range?.index || 0, 'unsubscribe', {
                                link: unsubscribeLink,
                                language: extraValue
                            });
                            quill.insertText((range?.index || 0) + 1, '\n');
                        }

                        break;
                    case 'indentIncrease':
                        quill.format('indent', (format.indent || 0) + 1);

                        break;
                    case 'indentDecrease':
                        quill.format('indent', (format.indent || 0) - 1);

                        break;
                    case 'clearFormat':
                        quill.removeFormat(range.index, range.length);

                        break;
                    case 'font':
                        const fontFamily = extraValue as 'sans_serif' | 'serif' | 'monospace';
                        if (savedRange.current) {
                            quill.formatText(
                                savedRange.current.index,
                                savedRange.current.length,
                                'font',
                                fontFamily === 'sans_serif' ? false : fontFamily,
                            );
                            setActive(fontFamily === 'sans_serif' ? false : fontFamily);
                            restoreSelection();
                        }

                        break;
                    case 'size':
                        const fontSize = extraValue as 'small' | 'normal' | 'large' | 'huge';
                        if (savedRange.current) {
                            quill.formatText(
                                savedRange.current.index,
                                savedRange.current.length,
                                'size',
                                fontSize === 'normal' ? false : fontSize,
                            );
                            setActive(fontSize === 'normal' ? false : fontSize);
                            restoreSelection();
                        }

                        break;
                    case 'color':
                        colorPicker({
                            anchorEl: e.currentTarget,
                            value: (active as string) || '#000000',
                            onChange: (color) => {
                                const tinyColor = new TinyColor(color);
                                if (tinyColor.isValid && range) {
                                    quill.formatText(range.index, range.length, 'color', tinyColor.toHexString());
                                    setActive(tinyColor.toHexString());
                                }
                            },
                            onClose: () => {
                                restoreSelection();
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                            },
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                        });

                        break;
                    case 'background':
                        colorPicker({
                            anchorEl: e.currentTarget,
                            value: (active as string) || undefined,
                            onChange: (color) => {
                                const tinyColor = new TinyColor(color);
                                if (tinyColor.isValid && range) {
                                    quill.formatText(range.index, range.length, 'background', tinyColor.toHexString());
                                    setActive(tinyColor.toHexString());
                                }
                            },
                            onClose: () => {
                                restoreSelection();
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                            },
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                        });

                        break;
                    default:
                        break;
                }
            }
        },
        [
            reactQuillRef,
            type,
            active,
            restoreSelection,
            onImageUpload,
            colorPicker,
            unsubscribeLink,
            openDataBoardVariableDialog,
            openCtaButtonDialog,
        ],
    );

    useEffect(() => {
        const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;
        const delta = quill.getContents();
        onTextChange(delta, delta, 'api');

        quill?.on('selection-change', onSelectionChange);
        quill?.on('text-change', onTextChange);
        return () => {
            quill?.off('selection-change', onSelectionChange);
            quill?.off('text-change', onTextChange);
        };
    }, [reactQuillRef, onSelectionChange, onTextChange]);

    useEffect(() => {
        const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;
        document.addEventListener(CLICK_EVENT, ((event: CustomEvent<{ blotName: string }>) => {
            if (quill) {
                if (findCustomBlot(quill, event.detail.blotName as CustomFormatsType)) {
                    return;
                }
                const range = quill.getSelection();
                if (range && range.index !== 0) {
                    quill.setSelection(range?.index - 1, 0);
                }
            }
        }) as EventListener);
        return () => {
            document.removeEventListener(CLICK_EVENT, () => {});
        };
    }, [reactQuillRef, type]);

    const render = useCallback(() => {
        switch (type) {
            case 'font':
                return (
                    <Dropdown
                        text={
                            <Typography variant="BodyBold" style={{ color: active ? 'var(--color-primary-4)' : 'var(--color-light-7)' }}>
                                {typeof active === 'string'
                                    ? FontOptions.find((font) => font.index === active)?.text || 'Sans Serif'
                                    : 'Sans Serif'}
                            </Typography>
                        }
                        arrowColor="var(--color-light-4)"
                        variant={'text'}
                        hideOnSelect
                        className={`${active ? styles.active : ''}`}
                        buttonSx={{
                            height: 24,
                            padding: '4px',
                            textTransform: 'initial',
                        }}
                        anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'bottom',
                        }}
                        transformOrigin={{
                            horizontal: 'center',
                            vertical: 'top',
                        }}
                        options={FontOptions}
                        onSelect={(e, selectedIndex) => {
                            handler(e, selectedIndex);
                        }}
                    />
                );
            case 'size':
                return (
                    <Dropdown
                        text={
                            <Typography variant="BodyBold" style={{ color: active ? 'var(--color-primary-4)' : 'var(--color-light-7)' }}>
                                {typeof active === 'string' ? SizeOptions.find((size) => size.index === active)?.text || '16px' : '16px'}
                            </Typography>
                        }
                        arrowColor="var(--color-light-4)"
                        variant={'text'}
                        hideOnSelect
                        className={`${active ? styles.active : ''}`}
                        buttonSx={{
                            height: 24,
                            padding: '4px',
                            textTransform: 'initial',
                        }}
                        anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'bottom',
                        }}
                        transformOrigin={{
                            horizontal: 'center',
                            vertical: 'top',
                        }}
                        options={SizeOptions}
                        onSelect={(e, selectedIndex) => {
                            handler(e, selectedIndex);
                        }}
                    />
                );
            case 'align':
                return (
                    <Dropdown
                        icon={
                            <Icon
                                name={
                                    active === 'center'
                                        ? 'alignCenter'
                                        : active === 'right'
                                          ? 'alignRight'
                                          : active === 'justify'
                                            ? 'alignJustify'
                                            : 'alignLeft'
                                }
                            />
                        }
                        variant={'text'}
                        hideArrow
                        hideOnSelect
                        className={`${active ? styles.active : ''}`}
                        buttonSx={{
                            height: 24,
                            width: 24,
                            padding: '2px',
                        }}
                        anchorOrigin={{
                            horizontal: 'center',
                            vertical: 'bottom',
                        }}
                        transformOrigin={{
                            horizontal: 'center',
                            vertical: 'top',
                        }}
                        menuPaperProps={{
                            sx: {
                                padding: '0 !important',
                                '& .MuiList-root': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                },
                            },
                        }}
                        options={[
                            {
                                icon: <Icon name="alignLeft" style={{ fontSize: '20px' }} />,
                                index: 'left',
                                sx: {
                                    padding: '2px',
                                },
                            },
                            {
                                icon: <Icon name="alignCenter" style={{ fontSize: '20px' }} />,
                                index: 'center',
                                sx: {
                                    padding: '2px',
                                },
                            },
                            {
                                icon: <Icon name="alignRight" style={{ fontSize: '20px' }} />,
                                index: 'right',
                                sx: {
                                    padding: '2px',
                                },
                            },
                            {
                                icon: <Icon name="alignJustify" style={{ fontSize: '20px' }} />,
                                index: 'justify',
                                sx: {
                                    padding: '2px',
                                },
                            },
                        ]}
                        onSelect={(e, selectedIndex) => {
                            handler(e, selectedIndex);
                        }}
                    />
                );
            case 'bold':
            case 'italic':
            case 'underline':
            case 'listBullet':
            case 'clearFormat':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name={type} />
                    </IconButton>
                );
            case 'image':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="photoOutlined" />
                    </IconButton>
                );
            case 'dataBoardVariable':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="addVariable" />
                    </IconButton>
                );
            case 'attachFile':
                return (
                    <>
                        <IconButton
                            size="xs"
                            variant="text"
                            type="secondary"
                            className={`${active ? styles.active : ''}`}
                            onClick={(e) => {
                                handler(e);
                            }}
                        >
                            <Icon name={type} />
                        </IconButton>
                        <input ref={uploadRef} type="file" style={{ display: 'none' }} onInput={onAttachFile?.(uploadRef)} />
                    </>
                );
            case 'listOrdered':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name={'listNumber'} />
                    </IconButton>
                );
            case 'color':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="textColor" />
                    </IconButton>
                );
            case 'background':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="colorHighlight" />
                    </IconButton>
                );
            case 'indentIncrease':
            case 'indentDecrease':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name={type} />
                    </IconButton>
                );
            case 'blockquote':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="quote" />
                    </IconButton>
                );
            case 'link':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="linkSide" />
                    </IconButton>
                );
            case 'ctaButton':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        className={`${active ? styles.active : ''}`}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name="addButton" />
                    </IconButton>
                );
            case 'undo':
            case 'redo':
                return (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        disabled={disabled}
                        onClick={(e) => {
                            handler(e);
                        }}
                    >
                        <Icon name={type} />
                    </IconButton>
                );
            case 'unsubscribe':
                return (
                    <Tooltip title={t('text_editor_disable_unsubscribe')} disableHoverListener={!disabled} arrow placement="top">
                        <div>
                            <Dropdown
                                text={
                                    <IconButton
                                        size="xs"
                                        variant="text"
                                        type="secondary"
                                        className={`${active ? styles.active : ''}`}
                                        disabled={disabled}
                                    >
                                        <Icon name="unsubscribe" />
                                    </IconButton>
                                }
                                hideArrow
                                variant={'text'}
                                hideOnSelect
                                className={`${active ? styles.active : ''}`}
                                anchorOrigin={{
                                    horizontal: 'center',
                                    vertical: 'bottom',
                                }}
                                transformOrigin={{
                                    horizontal: 'center',
                                    vertical: 'top',
                                }}
                                options={UnSubscribeOptions}
                                onSelect={(e, selectedIndex) => {
                                    handler(e, selectedIndex);
                                }}
                            />
                        </div>
                    </Tooltip>
                );
            default:
                return null;
        }
    }, [type, handler, active, disabled, t, onAttachFile]);

    return (
        <>
            {dialogHolder}
            {colorPickerHolder}
            {render()}
        </>
    );
});

export default CustomFormats;
