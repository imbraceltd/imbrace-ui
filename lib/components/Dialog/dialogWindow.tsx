import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import type { SxProps, Theme } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
import MuiTypography from '@mui/material/Typography';
import type { ChangeEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Typography } from '../Typography';

export const DialogContent = styled(MuiDialogContent)(() => ({
    padding: 0,
    '& .MuiDialogContentText-root': {
        fontSize: '14px',
        fontWeight: 400,
        fontStyle: 'normal',
        letterSpacing: '0.25px',
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

export interface DialogWindowProps {
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
              onClose?: (dontAskAgain?: boolean, mode?: string) => void;
              onConfirm?: (dontAskAgain?: boolean) => Promise<boolean | void> | void;
              ref?: ReactNode;
          }) => ReactNode);
    /**
     * onClose
     * @param dontAskAgain boolean
     */
    onClose?: (dontAskAgain?: boolean, mode?: string) => Promise<void> | void;
    /**
     * onConfirm
     * @param dontAskedAgain boolean
     * @returns true -> will trigger onClose
     *          false -> do nothing after onConfirm
     */
    onConfirm?: (dontAskAgain?: boolean) => Promise<boolean | void> | void;
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
     * Confirm button props
     */
    confirmButtonProps?: ButtonProps;
    /**
     * Cancel button props
     */
    cancelButtonProps?: ButtonProps;
    paperSx?: SxProps<Theme>;
    paperOnClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
    backdropClosable?: boolean;
}

export interface DialogWindowHOCProps extends Omit<DialogWindowProps, 'open'> {
    backdropClosable?: boolean;
}

export const DialogWindow = (props: DialogWindowProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [cancelLoading, setCancelLoading] = useState<boolean>(false);
    const [dontAskedAgain, setDontAskedAgain] = useState<boolean>(false);
    const {
        title,
        content,
        onClose,
        onConfirm,
        cancelText,
        confirmText,
        showDontAskedAgain,
        onBackdropClose,
        actionsAlign = 'flex-end',
        hideConfirmButton,
        hideCancelButton,
        confirmButtonProps,
        cancelButtonProps,
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
                    height: '100%',
                    width: '100%',
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
            <Space
                align="center"
                justify="between"
                style={{
                    height: '49px',
                    padding: '15.5px 24px',
                    borderBottom: '1px solid var(--color-light-3)',
                }}
            >
                <Typography style={{ color: 'var(--color-light-5)', fontWeight: '700' }} variant="BodyBold">
                    {title}
                </Typography>

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
                {(!hideCancelButton || !hideConfirmButton) && (
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
                    </DialogActions>
                )}
            </DialogContent>
        </MuiDialog>
    );
};

export const DialogWindowHOC = ({
    onClose,
    onConfirm,
    onBackdropClose,
    backdropClosable = true,
    ...restProps
}: Omit<DialogWindowProps, 'open'>) => {
    const [open, setOpen] = useState(true);

    return (
        <DialogWindow
            open={open}
            onClose={async (dontAskAgain, mode) => {
                await onClose?.(dontAskAgain, mode);
                setOpen(false);
            }}
            onConfirm={async (dontAskAgain) => {
                const result = await onConfirm?.(dontAskAgain);
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
