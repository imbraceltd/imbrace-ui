import MuiDialog from '@mui/material/Dialog';
import type { SxProps, Theme } from '@mui/material/styles';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DefaultValues, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useDialog } from '../../main';
import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Typography } from '../Typography';
import type { DialogProps } from '.';
import { DialogActions, DialogContent } from '.';

export interface DialogStepFormProps<F extends FieldValues>
    extends Omit<DialogProps, 'title' | 'showDontAskedAgain' | 'onConfirm' | 'content' | 'confirmButtonProps' | 'confirmText' | 'paperSx'> {
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
    onConfirm: (formData: F, methods: UseFormReturn<F, any>, step: number) => Promise<boolean>;
    /**
     * Dialog content
     * @param methods hook from methods
     * @param step current step
     * @default
     */
    content: (methods: UseFormReturn<F, any>, onPrev?: () => void) => ReactNode[];
    defaultValues?: DefaultValues<F>;
    showUnsavedDialog?: boolean;
    confirmButtonProps?: ButtonProps | ((step: number, formData?: F) => ButtonProps);
    confirmText: string | string[];
    currentStep?: number;
    title?: string | string[];
    paperSx?: SxProps<Theme> | SxProps<Theme>[];
    paperOnClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
    disabled?: (data: { currentStep: number; methods: UseFormReturn<F, any> }) => boolean;
    disableEnforceFocus?: boolean;
    disableAutoFocus?: boolean;
}

export interface DialogStepFormHOCProps<F extends FieldValues = FieldValues> extends Omit<DialogStepFormProps<F>, 'open'> {
    backdropClosable?: boolean;
}

export const DialogStepForm = <F extends FieldValues>(props: DialogStepFormProps<F>) => {
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
        currentStep,
        paperSx,
        paperOnClick,
        disabled,
        ...restProps
    } = props;
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [controlledStep, setControlledStep] = useState(currentStep ?? 0);
    const [{ dialog }, dialogHolder] = useDialog();

    useEffect(() => {
        setControlledStep(currentStep ?? 0);
    }, [currentStep]);

    const methods = useForm<F>({
        mode: 'all',
        defaultValues,
    });
    const { formState, watch } = methods;
    const { isValid, isDirty } = formState;

    const totalSteps = useMemo(() => {
        return content(methods)?.length - 1 || 0;
    }, [content, methods]);

    const onClick = async () => {
        await methods.handleSubmit(onSubmit)();
    };

    const onCloseHandler = (
        event: Record<string, never> | ReactMouseEvent<HTMLButtonElement, MouseEvent>,
        reason: 'backdropClick' | 'escapeKeyDown',
    ) => {
        event.stopPropagation?.();
        if (showUnsavedDialog && methods.formState.isDirty) {
            dialog({
                title: t('crm_unsave_prompt_title'),
                content: t('crm_unsave_prompt_content'),
                actionsAlign: 'flex-end',
                confirmText: t('crm_unsave_prompt_confirm_text'),
                cancelText: t('crm_unsave_prompt_cancel_text'),
                onConfirm: async () => {
                    await methods.handleSubmit(onSubmit)();
                    onClose();
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
    };

    const onPrev = () => {
        setControlledStep((prev) => {
            if (prev !== 0) {
                return prev - 1;
            }
            return 0;
        });
    };

    const onSubmit: SubmitHandler<F> = useCallback(
        async (formData) => {
            setLoading(true);
            try {
                const result = await onConfirm(formData, methods, controlledStep);

                if (result) {
                    if (controlledStep !== totalSteps) {
                        setControlledStep((prev) => prev + 1);
                    } else {
                        onClose();
                    }
                }
                setLoading(false);
            } catch (err) {
                console.log('dialogForm onSubmit err: ', err);
                setLoading(false);
            }
        },
        [methods, onClose, onConfirm, controlledStep, totalSteps],
    );

    return (
        <MuiDialog
            onClose={onCloseHandler}
            PaperProps={{
                sx: {
                    width: 500,
                    justifyContent: 'center',
                    ...(Array.isArray(paperSx) ? paperSx[controlledStep] : paperSx),
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
            {dialogHolder}
            <Space align="start" justify="between" style={{ marginBottom: '16px', padding: '32px 32px 0 32px' }}>
                <div>
                    <Typography style={{ color: 'var(--color-light-7)' }} variant="Heading2">
                        {Array.isArray(title) ? title[controlledStep] : title}
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
                    <div>{content(methods, onPrev)?.[controlledStep]}</div>
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
                            disabled={
                                disabled
                                    ? disabled({
                                          currentStep: controlledStep,
                                          methods,
                                      })
                                    : !isDirty || !isValid
                            }
                            onClick={onClick}
                            variant="contained"
                            size="s"
                            text={Array.isArray(confirmText) ? confirmText[controlledStep] : confirmText}
                            {...(typeof confirmButtonProps === 'function'
                                ? confirmButtonProps(controlledStep, watch())
                                : confirmButtonProps)}
                        />
                    </DialogActions>
                </form>
            </DialogContent>
        </MuiDialog>
    );
};

export const DialogStepFormHOC = <F extends FieldValues>({
    onClose,
    onConfirm,
    onBackdropClose,
    backdropClosable = true,
    ...restProps
}: DialogStepFormHOCProps<F>) => {
    const [open, setOpen] = useState(true);
    return (
        <DialogStepForm
            open={open}
            onClose={() => {
                onClose();
                setOpen(false);
            }}
            onConfirm={async (formData, methods, step) => {
                const result = await onConfirm(formData, methods, step);

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

export default DialogStepForm;
