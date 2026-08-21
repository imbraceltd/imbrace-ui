import './blots/optOutBlot';
import './blots/ctaButtonBlot';
import './blots/imagePlaceholderBlot';

import type { ContainerBlot } from 'parchment';
import type { Blot } from 'parchment/dist/typings/blot/abstract/blot';
import type { Quill as TypeQuill } from 'quill';
import type { FormEvent, RefObject } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type ReactQuill from 'react-quill';
import ReactQuillEditor from 'react-quill';

import { useDialog } from '../Dialog';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import type { Attachment, FileStatus } from '../Upload/types';
import type { BlotsProps, TextEditorProps } from '.';
import { DefaultCustomFormats, FORMATS } from '.';
import { CLICK_EVENT } from '.';
import type CtaButtonBlot from './blots/ctaButtonBlot';
import DataBoardVariableBlot from './blots/dataBoardVariableBlot';
import CTAButtonForm, { type CTAButtonFormData, CTAButtonFormSchema } from './ctaButtonForm';
import type { CustomFormatsType } from './customFormats';
import CustomFormats, { findCustomBlot } from './customFormats';
import DataBoardVariableForm from './dataBoardVariableForm';
import FileItem from './fileItem';
import styles from './index.module.scss';

const CustomToolbar = memo(
    (props: {
        reactQuillRef: RefObject<ReactQuill>;
        onAttachFile?: (uploadRef: RefObject<HTMLInputElement>) => (event: FormEvent<HTMLInputElement>) => Promise<void>;
        onImageUpload?: (file: File) => Promise<{ url: string; id: string; name: string }>;
        onImageDelete?: (fileId: string) => Promise<unknown>;
        formats?: Record<CustomFormatsType, boolean | undefined>;
        dataBoardVariableOptions?: BlotsProps['dataBoardVariable'];
        ctaButtonOptions?: BlotsProps['ctaButton'];
        unsubscribeLink?: string;
    }) => {
        const { reactQuillRef, onAttachFile, formats = DefaultCustomFormats, onImageUpload, onImageDelete } = props;
        const [expand, setExpand] = useState(false);

        return (
            <div id="toolbar" className={`${styles.toolbar} ${expand ? styles.expand : ''}`}>
                <Space justify="between">
                    <Space size={12}>
                        <Space size={8}>
                            {formats.font && <CustomFormats reactQuillRef={reactQuillRef} type="font" />}
                            {formats.size && <CustomFormats reactQuillRef={reactQuillRef} type="size" />}
                        </Space>
                        <Space size={24}>
                            <Space size={8}>
                                {formats.bold && <CustomFormats reactQuillRef={reactQuillRef} type="bold" />}
                                {formats.italic && <CustomFormats reactQuillRef={reactQuillRef} type="italic" />}
                                {formats.underline && <CustomFormats reactQuillRef={reactQuillRef} type="underline" />}
                            </Space>
                            <Space size={8}>
                                {formats.dataBoardVariable && (
                                    <CustomFormats
                                        reactQuillRef={reactQuillRef}
                                        type="dataBoardVariable"
                                        dataBoardVariableOptions={props.dataBoardVariableOptions}
                                    />
                                )}
                                {formats.ctaButton && (
                                    <CustomFormats
                                        reactQuillRef={reactQuillRef}
                                        type="ctaButton"
                                        ctaButtonOptions={props.ctaButtonOptions}
                                    />
                                )}
                            </Space>
                            <Space size={8}>
                                {formats.listOrdered && <CustomFormats reactQuillRef={reactQuillRef} type="listOrdered" />}
                                {formats.listBullet && <CustomFormats reactQuillRef={reactQuillRef} type="listBullet" />}
                                {formats.align && <CustomFormats reactQuillRef={reactQuillRef} type="align" />}
                            </Space>
                        </Space>
                    </Space>
                    <Space size={8}>
                        {formats.undo && <CustomFormats reactQuillRef={reactQuillRef} type="undo" />}
                        {formats.redo && <CustomFormats reactQuillRef={reactQuillRef} type="redo" />}
                        <IconButton
                            size="xs"
                            variant="text"
                            type="secondary"
                            onClick={() => {
                                setExpand((prev) => !prev);
                            }}
                            sx={{
                                width: 32,
                                height: 32,
                                ...(expand && {
                                    borderRadius: '4px 4px 0px 0px',
                                    background: 'var(--color-secondary-2)',
                                }),
                            }}
                        >
                            <Icon name="moreVert" />
                        </IconButton>
                    </Space>
                </Space>
                <Space justify="end" size={24} style={{ display: expand ? 'flex' : 'none' }}>
                    <Space size={8}>
                        {formats.color && <CustomFormats reactQuillRef={reactQuillRef} type="color" />}
                        {formats.background && <CustomFormats reactQuillRef={reactQuillRef} type="background" />}
                    </Space>
                    <Space size={8}>
                        {formats.indentIncrease && <CustomFormats reactQuillRef={reactQuillRef} type="indentIncrease" />}
                        {formats.indentDecrease && <CustomFormats reactQuillRef={reactQuillRef} type="indentDecrease" />}
                        {formats.blockquote && <CustomFormats reactQuillRef={reactQuillRef} type="blockquote" />}
                    </Space>
                    <Space size={8}>
                        {formats.image && (
                            <CustomFormats
                                reactQuillRef={reactQuillRef}
                                type="image"
                                onImageUpload={onImageUpload}
                                onImageDelete={onImageDelete}
                            />
                        )}
                        {formats.link && <CustomFormats reactQuillRef={reactQuillRef} type="link" />}
                        {formats.attachFile && (
                            <CustomFormats reactQuillRef={reactQuillRef} type="attachFile" onAttachFile={onAttachFile} />
                        )}
                        {formats.unsubscribe && (
                            <CustomFormats reactQuillRef={reactQuillRef} type="unsubscribe" unsubscribeLink={props.unsubscribeLink} />
                        )}
                    </Space>

                    {formats.clearFormat && <CustomFormats reactQuillRef={reactQuillRef} type="clearFormat" />}
                </Space>
            </div>
        );
    },
);

const Editor = (props: TextEditorProps) => {
    const {
        value,
        onChange,
        onUpload,
        onDelete,
        fileValidation,
        containerProps,
        onImageUpload,
        onImageDelete,
        showFileSize,
        onGetInfo,
        blotsProps,
        ...restProps
    } = props;
    const reactQuillRef = useRef<ReactQuill>(null);
    const { t } = useTranslation();
    const [files, setFiles] = useState<Attachment[]>(
        value?.files?.map((file) => ({
            ...file,
            ...(!('status' in file) && { status: file.url ? 'ok' : 'pending' }),
        })) || [],
    );
    const filesRef = useRef<Attachment[]>(
        value?.files?.map((file) => ({
            ...file,
            ...(!('status' in file) && { status: file.url ? 'ok' : 'pending' }),
        })) || [],
    );
    const [htmlContent, setHtmlContent] = useState<string | undefined>(value?.content);
    const [{ dialogForm }, dialogHolder] = useDialog();

    useEffect(() => {
        import('./blots/optOutBlot');
        import('./blots/ctaButtonBlot');
        import('./blots/imagePlaceholderBlot');
    }, []);

    useEffect(() => {
        setHtmlContent(value?.content);
        setFiles(
            value?.files?.map((file) => ({
                ...file,
                ...(!('status' in file) && { status: file.url ? 'ok' : 'pending' }),
            })) || [],
        );
        filesRef.current =
            value?.files?.map((file) => ({
                ...file,
                ...(!('status' in file) && { status: file.url ? 'ok' : 'pending' }),
            })) || [];
    }, [value]);

    useEffect(() => {
        if (blotsProps?.dataBoardVariable?.blotsValidation) {
            const quillEditor = reactQuillRef.current?.getEditor();
            const blotInstances: DataBoardVariableBlot[] = [];
            const currentBlot = quillEditor?.scroll;
            // Traverse the blot tree
            const traverseBlots = (blot: Blot | ContainerBlot) => {
                if (blot instanceof DataBoardVariableBlot) {
                    blotInstances.push(blot);
                }
                if ('children' in blot && blot.children) {
                    blot.children.forEach(traverseBlots);
                }
            };
            if (currentBlot) {
                traverseBlots(currentBlot as unknown as Blot);
            }
            const validateBlots = async () => {
                await blotsProps?.dataBoardVariable?.blotsValidation?.(blotInstances);
            };
            validateBlots();
        }
    }, [htmlContent, blotsProps?.dataBoardVariable]);

    const onAttachFile = useCallback(
        (uploadRef: RefObject<HTMLInputElement>) => async (event: FormEvent<HTMLInputElement>) => {
            const target = event.currentTarget;
            if (!target.files || target.files.length === 0) {
                return;
            }

            const file = target.files[0];
            if (uploadRef && uploadRef.current) {
                uploadRef.current.value = '';
                const inputEvent = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                uploadRef.current.dispatchEvent(inputEvent);
            }
            if (fileValidation) {
                try {
                    const validationResult = await fileValidation(file);

                    const isValid = typeof validationResult === 'string' ? false : validationResult;

                    setFiles((prev) => [
                        ...prev,
                        {
                            id: `${prev.length}`,
                            file,
                            name: file.name,
                            size: file.size,
                            isValid,
                            error: typeof validationResult === 'string' ? validationResult : undefined,
                            status: !isValid ? 'validationError' : 'pending',
                        },
                    ]);
                    filesRef.current = [
                        ...filesRef.current,
                        {
                            id: `${filesRef.current.length}`,
                            file,
                            name: file.name,
                            size: file.size,
                            isValid,
                            error: typeof validationResult === 'string' ? validationResult : undefined,
                            status: !isValid ? 'validationError' : 'pending',
                        },
                    ];

                    onChange?.({
                        content: htmlContent,
                        files: [
                            ...files,
                            {
                                id: `${files.length}`,
                                file,
                                name: file.name,
                                size: file.size,
                                isValid,
                                error: typeof validationResult === 'string' ? validationResult : undefined,
                                status: !isValid ? 'validationError' : 'pending',
                            },
                        ],
                    });
                } catch (error) {
                    setFiles((prev) => [
                        ...prev,
                        {
                            id: `${prev.length}`,
                            file,
                            name: file.name,
                            size: file.size,
                            isValid: false,
                            error: (error as Error).message,
                            status: 'validationError',
                        },
                    ]);
                    filesRef.current = [
                        ...filesRef.current,
                        {
                            id: `${filesRef.current.length}`,
                            file,
                            name: file.name,
                            size: file.size,
                            isValid: false,
                            error: (error as Error).message,
                            status: 'validationError',
                        },
                    ];
                    onChange?.({
                        content: htmlContent,
                        files: [
                            ...files,
                            {
                                id: `${files.length}`,
                                file,
                                name: file.name,
                                size: file.size,
                                isValid: false,
                                error: (error as Error).message,
                                status: 'validationError',
                            },
                        ],
                    });
                }
            } else {
                setFiles((prev) => [
                    ...prev,
                    {
                        id: `${prev.length}`,
                        file,
                        name: file.name,
                        size: file.size,
                        isValid: true,
                        status: 'pending',
                    },
                ]);
                filesRef.current = [
                    ...filesRef.current,
                    {
                        id: `${filesRef.current.length}`,
                        file,
                        name: file.name,
                        size: file.size,
                        isValid: true,
                        status: 'pending',
                    },
                ];
                onChange?.({
                    content: htmlContent,
                    files: [
                        ...files,
                        {
                            id: `${files.length}`,
                            file,
                            name: file.name,
                            size: file.size,
                            isValid: true,
                            status: 'pending',
                        },
                    ],
                });
            }
        },
        [fileValidation, files, htmlContent, onChange],
    );

    const removeAttachFile = useCallback(
        (attachmentId: string) => {
            const fileIndex = filesRef.current.findIndex((file) => file.id === attachmentId);
            if (fileIndex !== -1) {
                const newFiles = [...filesRef.current];
                newFiles.splice(fileIndex, 1);
                filesRef.current = newFiles;
                setFiles(newFiles);
                onChange?.({
                    content: htmlContent,
                    files: newFiles,
                });
            }
        },
        [onChange, htmlContent],
    );

    const onStatusChange = useCallback(
        (
            payload: { id: string; fileId?: string; status: FileStatus; error?: string; url?: string; size?: number; name?: string },
            silent = false,
        ) => {
            const { id, status, error, fileId, url, size, name } = payload;
            const fileIndex = filesRef.current.findIndex((file) => file.id === id);

            if (fileIndex !== -1) {
                const newFiles = [...filesRef.current];
                newFiles[fileIndex] = {
                    ...newFiles[fileIndex],
                    id: fileId ?? id,
                    status,
                    error,
                    fileId,
                    url,
                    size,
                    name: name || newFiles[fileIndex].name,
                };
                filesRef.current = newFiles;
                setFiles(newFiles);
                if (!silent) {
                    onChange?.({
                        content: htmlContent,
                        files: newFiles,
                    });
                }
            }
        },
        [htmlContent, onChange],
    );

    const openDataBoardVariableDialog = useCallback(
        (blot: DataBoardVariableBlot) => {
            dialogForm<{ name: string; fieldId: string; boardId: string }>({
                title: t('message_templates_edit_variable'),
                content: (methods) => (
                    <DataBoardVariableForm
                        methods={methods}
                        fieldsRequest={blotsProps?.dataBoardVariable?.fieldsRequest}
                        boardsRequest={blotsProps?.dataBoardVariable?.boardsRequest}
                        disableBoard={!!blotsProps?.dataBoardVariable?.boardId}
                        hideSource={blotsProps?.dataBoardVariable?.hideSource}
                    />
                ),
                defaultValues: blot.getValue(),
                confirmText: t('update'),
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
                    blot.updateValue(formData);
                    return true;
                },
                onClose: () => {},
            });
        },
        [dialogForm, blotsProps, t],
    );

    const openCtaButtonDialog = useCallback(
        (blot: CtaButtonBlot) => {
            dialogForm<CTAButtonFormData, ReturnType<typeof CTAButtonFormSchema>>({
                title: t('text_editor_cta_button_setting'),
                content: (methods) => (
                    <CTAButtonForm
                        methods={methods}
                        defaultValues={blot.getValue()}
                        newTouchpointOnClick={blotsProps?.ctaButton?.newTouchpointOnClick}
                        request={blotsProps?.ctaButton?.request}
                    />
                ),
                defaultValues: blot.getValue(),
                confirmText: t('text_editor_update_button'),
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
                    blot.updateValue(formData);
                    return true;
                },
                onClose: () => {},
            });
        },
        [dialogForm, blotsProps, t],
    );

    useEffect(() => {
        const quill = reactQuillRef.current?.getEditor() as unknown as TypeQuill;

        const handleCustomEvent = (event: CustomEvent) => {
            if (event.detail.blotName === 'ctaButton') {
                // const blot = event.detail.blot;
                const blot = findCustomBlot<CtaButtonBlot>(quill, 'ctaButton');
                if (blot) {
                    openCtaButtonDialog(blot);
                }
            }
            if (event.detail.blotName === 'dataBoardVariable') {
                const blot = findCustomBlot<DataBoardVariableBlot>(quill, 'dataBoardVariable');
                if (blot) {
                    openDataBoardVariableDialog(blot);
                }
            }
        };

        document.addEventListener(CLICK_EVENT, handleCustomEvent as EventListener);

        return () => {
            document.removeEventListener(CLICK_EVENT, handleCustomEvent as EventListener);
        };
    }, [reactQuillRef, openDataBoardVariableDialog, openCtaButtonDialog]);

    return (
        <>
            {dialogHolder}
            <div {...containerProps} className={`textEditorContainer ${styles.textEditor} ${containerProps?.className || ''}`}>
                <CustomToolbar
                    reactQuillRef={reactQuillRef}
                    onAttachFile={onAttachFile}
                    onImageUpload={onImageUpload}
                    onImageDelete={onImageDelete}
                    dataBoardVariableOptions={blotsProps?.dataBoardVariable}
                    ctaButtonOptions={blotsProps?.ctaButton}
                    unsubscribeLink={blotsProps?.unsubscribe?.link}
                />
                <ReactQuillEditor
                    {...restProps}
                    ref={reactQuillRef}
                    className={styles.editor}
                    modules={{
                        toolbar: {
                            container: '#toolbar',
                        },
                    }}
                    formats={FORMATS}
                    value={htmlContent}
                    onChange={(html) => {
                        setHtmlContent(html);
                        onChange?.({
                            content: html,
                            files:
                                value?.files?.map((file) => ({
                                    ...file,
                                    ...(!('status' in file) && { status: file.url ? 'ok' : 'pending' }),
                                })) || [],
                        });
                    }}
                />
            </div>
            <Space size={8} style={{ width: '100%' }} align="start" direction="vertical">
                {files.map((file) => (
                    <FileItem
                        key={file.id}
                        onUpload={onUpload}
                        onDelete={onDelete}
                        attachment={file}
                        onStatusChange={onStatusChange}
                        removeAttachFile={removeAttachFile}
                        showFileSize={showFileSize}
                        onGetInfo={onGetInfo}
                    />
                ))}
            </Space>
        </>
    );
};

export default Editor;
