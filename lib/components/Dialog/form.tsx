import { zodResolver } from '@hookform/resolvers/zod';
import MuiDialog from '@mui/material/Dialog';
import type { SxProps, Theme } from '@mui/material/styles';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { DefaultValues, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { useDialog } from '../../main';
import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Typography } from '../Typography';
import type { DialogProps } from '.';
import { DialogActions, DialogContent } from '.';

export interface DialogFormProps<F extends FieldValues, S extends z.ZodType<F>>
    extends Omit<DialogProps, 'showDontAskedAgain' | 'onConfirm' | 'content' | 'confirmButtonProps'> {
    /**
     * onClose
     */
    onClose: () => void;
    /**
     * onConfirm
     * @param formData
     * @returns true -> will trigger onClose
     *          false -> do nothing after onConfirm
     */
    onConfirm: (formData: F, methods: UseFormReturn<F, any>) => Promise<boolean | void>;
    /**
     * Dialog content
     * @param methods hook from methods
     * @default
     */
    content: (methods: UseFormReturn<F, any>, onClose: () => void) => ReactNode;
    defaultValues?: DefaultValues<F>;
    showUnsavedDialog?: boolean;
    confirmButtonProps?: ButtonProps | ((formData?: F) => ButtonProps);
    paperSx?: SxProps<Theme>;
    paperOnClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
    schema?: S;
    disableEnforceFocus?: boolean;
    disableAutoFocus?: boolean;
}

export interface DialogFormHOCProps<F extends FieldValues = FieldValues, S extends z.ZodType<F> = z.ZodType<F>>
    extends Omit<DialogFormProps<F, S>, 'open'> {
    backdropClosable?: boolean;
}

const FormAction = ({
    methods,
    onSubmit,
    onClose,
    loading,
    actionsAlign,
    hideCancelButton,
    cancelText,
    cancelButtonProps,
    confirmText,
    confirmButtonProps,
}: {
    methods: UseFormReturn<any, any, any>;
    onSubmit: () => void;
    onClose: () => void;
    loading: boolean;
    actionsAlign: 'center' | 'flex-end' | 'flex-start';
    hideCancelButton?: boolean;
    cancelText?: string;
    cancelButtonProps?: ButtonProps;
    confirmText?: string;
    confirmButtonProps?: ButtonProps | ((formData?: any) => ButtonProps);
}) => {
    const { t } = useTranslation();
    const { isDirty, isValid, errors } = methods.formState;

    return (
        <DialogActions align={actionsAlign}>
            {!hideCancelButton && (
                <Button
                    onClick={() => {
                        onClose();
                    }}
                    variant="outlined"
                    size="s"
                    text={cancelText || t('cancel')}
                    {...cancelButtonProps}
                />
            )}
            <Button
                key="submitButton"
                loading={loading}
                disabled={!isDirty || !isValid || Object.keys(errors).length !== 0}
                onClick={onSubmit}
                variant="contained"
                size="s"
                text={confirmText || t('delete')}
                {...(typeof confirmButtonProps === 'function' ? confirmButtonProps(methods.watch()) : confirmButtonProps)}
            />
        </DialogActions>
    );
};

export const DialogForm = <F extends FieldValues, S extends z.ZodType<F> = z.ZodType<F>>(props: DialogFormProps<F, S>) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState<boolean>(false);
    const {
        title,
        content,
        onClose,
        onConfirm,
        cancelText,
        confirmText,
        onBackdropClose,
        actionsAlign = 'flex-end',
        hideCancelButton,
        confirmButtonProps,
        cancelButtonProps,
        showCloseButton,
        defaultValues,
        showUnsavedDialog = false,
        paperSx,
        paperOnClick,
        schema,
        ...restProps
    } = props;

    const [{ dialog }, dialogsHolder] = useDialog();

    const methods = useForm<F>({
        mode: 'all',
        defaultValues,
        resolver: schema ? zodResolver(schema, { async: true }, { mode: 'async' }) : undefined,
    });

    const onClick = async () => {
        await methods.handleSubmit(onSubmit)();
    };

    const onSubmit: SubmitHandler<F> = useCallback(
        async (formData) => {
            setLoading(true);
            try {
                const result = await onConfirm(formData, methods);
                if (result) {
                    onClose();
                }
                setLoading(false);
            } catch (err) {
                console.log('dialogForm onSubmit err: ', err);
                setLoading(false);
            }
        },
        [methods, onClose, onConfirm],
    );

    const onCloseHandler = useCallback(
        (event?: Record<string, never> | ReactMouseEvent<HTMLDivElement, MouseEvent>, reason?: 'backdropClick' | 'escapeKeyDown') => {
            event?.stopPropagation?.();
            if (showUnsavedDialog && methods.formState.isDirty) {
                dialog({
                    title: t('crm_unsave_prompt_title'),
                    content: t('crm_unsave_prompt_content'),
                    actionsAlign: 'flex-end',
                    confirmText: t('crm_unsave_prompt_confirm_text'),
                    cancelText: t('crm_unsave_prompt_cancel_text'),
                    onConfirm: async () => {
                        await methods.handleSubmit(onSubmit)();
                        return false;
                    },
                    onClose: () => {
                        onClose();
                    },
                });
                return;
            }
            if (reason === 'backdropClick' && onBackdropClose) {
                onBackdropClose();
                return;
            }
            onClose();
        },
        [methods, onBackdropClose, onClose, onSubmit, showUnsavedDialog, t, dialog],
    );

    // useEffect(() => {
    //     methods.trigger();
    // }, [methods]);

    const children = useMemo(() => {
        return content(methods, onCloseHandler);
    }, [methods, content, onCloseHandler]);

    return (
        <MuiDialog
            onClose={onCloseHandler}
            PaperProps={{
                sx: {
                    width: 500,
                    justifyContent: 'center',
                    ...paperSx,
                },
                onClick: paperOnClick,
            }}
            scroll="paper"
            disablePortal
            onContextMenu={(e) => {
                e.stopPropagation();
            }}
            onContextMenuCapture={(e) => {
                e.stopPropagation();
            }}
            closeAfterTransition
            {...restProps}
        >
            {dialogsHolder}
            <Space align="start" justify="between" style={{ marginBottom: '16px', padding: '32px 32px 0 32px' }}>
                <div>
                    <Typography style={{ color: 'var(--color-light-7)' }} variant="Heading2">
                        {title}
                    </Typography>
                </div>

                {showCloseButton && (
                    <IconButton size="xs" variant="text" type="secondary" onClick={() => onClose()}>
                        <Icon name="close" />
                    </IconButton>
                )}
            </Space>
            <DialogContent>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div>{children}</div>

                    <FormAction
                        methods={methods}
                        loading={loading}
                        actionsAlign={actionsAlign}
                        hideCancelButton={hideCancelButton}
                        confirmButtonProps={confirmButtonProps}
                        cancelButtonProps={cancelButtonProps}
                        confirmText={confirmText}
                        cancelText={cancelText}
                        onSubmit={onClick}
                        onClose={onClose}
                    />
                </form>
            </DialogContent>
        </MuiDialog>
    );
};

export const DialogFormHOC = <F extends FieldValues, S extends z.ZodType<F>>({
    onClose,
    onConfirm,
    onBackdropClose,
    backdropClosable = true,
    ...restProps
}: DialogFormHOCProps<F, S>) => {
    const [open, setOpen] = useState(true);

    return (
        <DialogForm
            open={open}
            onClose={() => {
                onClose();
                setOpen(false);
            }}
            onConfirm={async (formData, methods) => {
                const result = await onConfirm(formData, methods);

                return result;
            }}
            onBackdropClose={() => {
                if (!backdropClosable) {
                    return;
                }
                if (onBackdropClose) {
                    onBackdropClose();
                }
                setOpen(false);
            }}
            {...restProps}
        />
    );
};

export default DialogForm;
