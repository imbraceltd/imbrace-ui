import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import type { SxProps, Theme } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
import MuiTypography from '@mui/material/Typography';
import uniqueId from 'lodash/uniqueId';
import type { ChangeEvent, MouseEvent as ReactMouseEvent, ReactElement, ReactNode } from 'react';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Typography } from '../Typography';
import type { DialogWindowHOCProps } from './dialogWindow';
import { DialogWindowHOC } from './dialogWindow';
import { DialogFormHOC, type DialogFormHOCProps } from './form';
import type { DialogStepFormHOCProps } from './stepForm';
import { DialogStepFormHOC } from './stepForm';

export const DialogContent = styled(MuiDialogContent)(() => ({
    padding: '0 32px 32px 32px',
    '& .MuiDialogContentText-root': {
        fontSize: '14px',
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: '16px',
        color: 'var(--color-light-5)',
        textAlign: 'left',
    },
}));

export const DialogActions = styled(MuiDialogActions, { shouldForwardProp: (propName) => propName !== 'align' })(
    ({ align }: { align?: 'center' | 'flex-end' | 'flex-start' }) => ({
        padding: 0,
        marginTop: '24px',
        width: '100%',
        display: 'flex',
        justifyContent: align ?? 'center',
    }),
);

export interface DialogProps {
    /**
     * open
     * @default
     */
    open: boolean;
    /**
     * Dialog title
     * @default
     */
    title: string | ReactNode;
    /**
     * Dialog content
     * @default
     */
    content:
        | string
        | ReactNode
        | ((data: {
              onClose?: (dontAskAgain?: boolean) => void;
              onConfirm?: (dontAskAgain?: boolean) => Promise<boolean | void> | void;
          }) => ReactNode);
    /**
     * onClose
     * @param dontAskAgain boolean
     */
    onClose?: (dontAskAgain?: boolean) => Promise<void> | void;
    /**
     * onConfirm
     * @param dontAskedAgain boolean
     * @returns true -> will trigger onClose
     *          false -> do nothing after onConfirm
     */
    onConfirm?: (dontAskAgain?: boolean) => Promise<boolean | void> | void;
    /**
     * onAdditionalClick
     * @param dontAskedAgain boolean
     * @returns true -> will trigger onClose
     *          false -> do nothing after onAdditionalClick
     */
    onAdditionalClick?: (dontAskAgain?: boolean) => Promise<boolean | void> | void;
    /**
     * Cancel button text
     * @default
     */
    cancelText?: string;
    /**
     * Confirm button text
     * @default
     */
    confirmText?: string;
    /**
     * Additional button text
     * @default
     */
    additionalText?: string;
    /**
     * Show Dont Asked Again checkbox
     * @default
     */
    showDontAskedAgain?: boolean;
    /**
     * Show close button
     * @default
     */
    showCloseButton?: boolean;
    /**
     * Buttons align
     * @default
     */
    actionsAlign?: 'center' | 'flex-end' | 'flex-start';
    /**
     * onBackdropClose
     * @param dontAskedAgain boolean
     */
    onBackdropClose?: () => void;
    disabledConfirmText?: boolean;
    /**
     * Hide confirm button
     */
    hideConfirmButton?: boolean;
    /**
     * Hide cancel button
     */
    hideCancelButton?: boolean;
    /**
     * Hide additional button
     */
    hideAdditionalButton?: boolean;
    /**
     * Confirm button props
     */
    confirmButtonProps?: ButtonProps;
    /**
     * Cancel button props
     */
    cancelButtonProps?: ButtonProps;
    /**
     * Additional button props
     */
    additionalButtonProps?: ButtonProps;
    paperSx?: SxProps<Theme>;
    paperOnClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
    backdropClosable?: boolean;
    disableEnforceFocus?: boolean;
    disableAutoFocus?: boolean;
}

interface DialogHOCProps extends Omit<DialogProps, 'open'> {
    backdropClosable?: boolean;
}

export const Dialog = (props: DialogProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [cancelLoading, setCancelLoading] = useState<boolean>(false);
    const [dontAskedAgain, setDontAskedAgain] = useState<boolean>(false);
    const {
        title,
        content,
        onClose,
        onConfirm,
        onAdditionalClick,
        cancelText,
        confirmText,
        additionalText,
        showDontAskedAgain,
        onBackdropClose,
        actionsAlign = 'flex-end',
        hideConfirmButton,
        hideCancelButton,
        hideAdditionalButton = true,
        confirmButtonProps,
        cancelButtonProps,
        additionalButtonProps,
        showCloseButton,
        paperSx,
        paperOnClick,
        backdropClosable,
        ...restProps
    } = props;

    const onClick = async () => {
        try {
            setLoading(true);
            const shouldClose = await onConfirm?.(dontAskedAgain);
            if (shouldClose) {
                onClose?.();
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const onCloseHandler = async (
        event: Record<string, never> | ReactMouseEvent<HTMLButtonElement, MouseEvent>,
        reason?: 'backdropClick' | 'escapeKeyDown',
    ) => {
        event.stopPropagation?.();
        try {
            if (!backdropClosable && reason === 'backdropClick') {
                return;
            }
            setCancelLoading(true);
            if (backdropClosable && reason === 'backdropClick' && onBackdropClose) {
                onBackdropClose();
                setCancelLoading(false);
                return;
            }
            await onClose?.(dontAskedAgain);
            setCancelLoading(false);
        } catch (error) {
            setCancelLoading(false);
        }
    };

    const handleChangeDontAskedAgain = (event: ChangeEvent<HTMLInputElement>) => {
        setDontAskedAgain(event.target.checked);
    };

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
            <Space align="start" justify="between" style={{ marginBottom: '16px', padding: '32px 32px 0 32px' }}>
                <div>
                    <Typography style={{ color: 'var(--color-light-7)' }} variant="Heading2">
                        {title}
                    </Typography>
                </div>

                {showCloseButton && (
                    <IconButton
                        size="xs"
                        variant="text"
                        type="secondary"
                        sx={{
                            margin: '-2px 0',
                        }}
                        onClick={() => onClose?.(dontAskedAgain)}
                    >
                        <Icon name="close" />
                    </IconButton>
                )}
            </Space>
            <DialogContent>
                {typeof content === 'function' ? content({ onClose, onConfirm }) : <DialogContentText>{content}</DialogContentText>}
                {showDontAskedAgain && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '12px',
                            mt: '12px',
                            alignItems: 'center',
                        }}
                    >
                        <Checkbox
                            id="dontask"
                            onChange={handleChangeDontAskedAgain}
                            disableRipple
                            sx={{
                                color: '#e0e0e0',
                                width: 16,
                                height: 16,
                            }}
                        />
                        <MuiTypography
                            htmlFor="dontask"
                            component="label"
                            style={{
                                cursor: 'pointer',
                                color: 'var(--color-light-7)',
                                fontSize: '0.875rem',
                            }}
                        >
                            {t('delete_dont_ask_again')}
                        </MuiTypography>
                    </Box>
                )}
                {(!hideCancelButton || !hideConfirmButton || !hideAdditionalButton) && (
                    <DialogActions align={actionsAlign}>
                        {!hideCancelButton && (
                            <Button
                                onClick={(e) => {
                                    onCloseHandler?.(e);
                                }}
                                variant="outlined"
                                size="s"
                                loading={cancelLoading}
                                text={cancelText || t('cancel')}
                                {...cancelButtonProps}
                            />
                        )}
                        {!hideConfirmButton && (
                            <Button
                                key="submitButton"
                                loading={loading}
                                onClick={onClick}
                                variant="contained"
                                size="s"
                                text={confirmText || t('delete')}
                                {...confirmButtonProps}
                            />
                        )}
                        {!hideAdditionalButton && (
                            <Button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const shouldClose = await onAdditionalClick?.(dontAskedAgain);
                                        if (shouldClose) {
                                            onClose?.();
                                        }
                                        setLoading(false);
                                    } catch (error) {
                                        setLoading(false);
                                    }
                                }}
                                variant="outlined"
                                size="s"
                                text={additionalText || t('cancel')}
                                loading={loading}
                                {...additionalButtonProps}
                            />
                        )}
                    </DialogActions>
                )}
            </DialogContent>
        </MuiDialog>
    );
};

const DialogHOC = ({ onClose, onConfirm, onAdditionalClick, onBackdropClose, backdropClosable = true, ...restProps }: Omit<DialogProps, 'open'>) => {
    const [open, setOpen] = useState(true);

    return (
        <Dialog
            open={open}
            onClose={async (dontAskAgain) => {
                await onClose?.(dontAskAgain);
                setOpen(false);
            }}
            onConfirm={async (dontAskAgain) => {
                const result = await onConfirm?.(dontAskAgain);
                setOpen(false);
                return result;
            }}
            onAdditionalClick={async (dontAskAgain) => {
                const result = await onAdditionalClick?.(dontAskAgain);
                setOpen(false);
                return result;
            }}
            onBackdropClose={() => {
                if (onBackdropClose) {
                    onBackdropClose();
                }
                setOpen(false);
            }}
            backdropClosable={backdropClosable}
            {...restProps}
        />
    );
};

interface DialogsRef {
    open: (props: DialogHOCProps) => void;
    openForm: (props: DialogFormHOCProps) => void;
    openWindow: (props: DialogWindowHOCProps) => void;
    openStepForm: (props: DialogStepFormHOCProps) => void;
}
interface DialogsProps {
    container?: HTMLElement;
}

type DialogItems =
    | (DialogHOCProps & {
          key: string;
          type: 'dialog';
      })
    | (DialogFormHOCProps & {
          key: string;
          type: 'form';
      })
    | (DialogWindowHOCProps & {
          key: string;
          type: 'window';
      })
    | (DialogStepFormHOCProps & {
          key: string;
          type: 'stepForm';
      });
export const Dialogs = forwardRef<DialogsRef, DialogsProps>((props, ref) => {
    const [items, setItems] = useState<DialogItems[]>([]);

    const onClose = (key: string) => {
        setItems((prev) => prev.filter((item) => item.key !== key));
    };

    useImperativeHandle(ref, () => ({
        open: (dialogProps) => {
            const key = uniqueId('imbrace-dialog');
            setItems((prev) => {
                const clone = [...prev];
                clone.push({
                    key,
                    type: 'dialog',
                    ...dialogProps,
                });
                return clone;
            });
        },
        openForm: (dialogProps) => {
            const key = uniqueId('imbrace-dialog');
            setItems((prev) => {
                const clone = [...prev];
                clone.push({
                    key,
                    type: 'form',
                    ...dialogProps,
                });
                return clone;
            });
        },
        openWindow: (dialogProps) => {
            const key = uniqueId('imbrace-dialog');
            setItems((prev) => {
                const clone = [...prev];
                clone.push({
                    key,
                    type: 'window',
                    ...dialogProps,
                });
                return clone;
            });
        },
        openStepForm: (dialogProps) => {
            setItems((prev) => {
                const clone = [...prev];
                clone.push({
                    key: uniqueId('imbrace-dialog'),
                    type: 'stepForm',
                    ...dialogProps,
                });
                return clone;
            });
        },
    }));

    return createPortal(
        <>
            {items.map((item) => {
                if (item.type === 'form') {
                    const { key, type, ...restProps } = item;
                    return (
                        <DialogFormHOC
                            key={`imbrace-dialog-${key}`}
                            {...restProps}
                            onClose={() => {
                                restProps.onClose?.();
                                onClose(key);
                            }}
                        />
                    );
                }
                if (item.type === 'dialog') {
                    const { key, type, ...restProps } = item;
                    return (
                        <DialogHOC
                            key={`imbrace-dialog-${key}`}
                            {...restProps}
                            onClose={() => {
                                restProps.onClose?.();
                                onClose(key);
                            }}
                        />
                    );
                }
                if (item.type === 'window') {
                    const { key, type, ...restProps } = item;
                    return (
                        <DialogWindowHOC
                            key={`imbrace-dialog-${key}`}
                            {...restProps}
                            onClose={() => {
                                restProps.onClose?.();
                                onClose(key);
                            }}
                        />
                    );
                }
                if (item.type === 'stepForm') {
                    const { key, type, ...restProps } = item;
                    return (
                        <DialogStepFormHOC
                            key={`imbrace-dialog-${key}`}
                            {...restProps}
                            onClose={() => {
                                restProps.onClose?.();
                                onClose(key);
                            }}
                        />
                    );
                }
                return null;
            })}
        </>,
        props.container || document.body,
    );
});

type DialogAPI = {
    dialog: (dialogProps: DialogHOCProps) => void;
    dialogForm: <F extends FieldValues = FieldValues, S extends z.ZodType<F> = z.ZodType<F>>(dialogProps: DialogFormHOCProps<F, S>) => void;
    dialogWindow: (dialogProps: DialogWindowHOCProps) => void;
    dialogStepForm: <F extends FieldValues = FieldValues>(dialogProps: DialogStepFormHOCProps<F>) => void;
};

type UseDialogType = (props?: DialogsProps) => [DialogAPI, ReactElement];

export const useDialog: UseDialogType = (props) => {
    const notificationsRef = useRef<DialogsRef>(null);

    const contextHolder = useMemo(() => <Dialogs ref={notificationsRef} {...props} />, [props]);

    const api = useMemo<DialogAPI>(
        () => ({
            dialog: (dialogProps: DialogHOCProps) => {
                notificationsRef.current?.open(dialogProps);
            },
            dialogForm: (dialogProps) => {
                notificationsRef.current?.openForm(dialogProps as DialogFormHOCProps);
            },
            dialogWindow: (dialogProps) => {
                notificationsRef.current?.openWindow(dialogProps);
            },
            dialogStepForm: (dialogProps) => {
                notificationsRef.current?.openStepForm(dialogProps as DialogStepFormHOCProps);
            },
        }),
        [],
    );

    return [api, contextHolder];
};

export default Dialog;
