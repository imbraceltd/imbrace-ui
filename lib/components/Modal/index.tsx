import MuiDialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import type { ModalProps as MuiModalProps } from '@mui/material/Modal';
import type { SxProps, Theme } from '@mui/material/styles';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import type { HTMLAttributes, ReactElement } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { forwardRef, type ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import type { SpaceProps } from '../Space';
import { Space } from '../Space';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export interface ModalProps
    extends Omit<MuiModalProps, 'open' | 'onClose' | 'children' | 'title' | 'key' | 'ref' | 'container' | 'content'> {
    open: boolean;
    onClose?: (reason?: 'backdropClick' | 'escapeKeyDown') => Promise<boolean | undefined | void>;
    title?: ReactNode | (({ onClose }: { onClose?: () => Promise<boolean | undefined | void> }) => ReactNode);
    paperSx?: SxProps<Theme>;
    children?: ReactNode | ReactNode[] | string;
    containerProps?: HTMLAttributes<HTMLDivElement>;
    headerProps?: HTMLAttributes<HTMLDivElement>;
    titleProps?: Omit<SpaceProps, 'children'>;
    extraProps?: Omit<SpaceProps, 'children'>;
    extra?: ReactNode | (({ onClose }: { onClose?: () => Promise<boolean | undefined | void> }) => ReactNode);
    hideHeader?: boolean;
    hideDivider?: boolean;
    /**
     * onBackdropClose
     */
    onBackdropClose?: () => void;
    backdropClosable?: boolean;
    disablePortal?: boolean;
    onContextMenu?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
    closeIcon?: string;
}

export const Modal = (props: ModalProps) => {
    const {
        open,
        onClose,
        title,
        paperSx,
        children,
        containerProps,
        extra,
        hideHeader,
        hideDivider,
        backdropClosable,
        onBackdropClose,
        disablePortal,
        headerProps,
        titleProps,
        extraProps,
        closeIcon,
        ...restProps
    } = props;

    const onCloseHandler = async (
        event: Record<string, never> | ReactMouseEvent<HTMLButtonElement, MouseEvent>,
        reason?: 'backdropClick' | 'escapeKeyDown',
    ) => {
        event.stopPropagation?.();

        if (!backdropClosable && reason === 'backdropClick') {
            return;
        }

        if (backdropClosable && reason === 'backdropClick' && onBackdropClose) {
            onBackdropClose();
            return;
        }
        onClose?.(reason);
    };

    return (
        <MuiDialog
            open={open}
            onClose={onCloseHandler}
            closeAfterTransition
            disablePortal={disablePortal}
            {...restProps}
            PaperProps={{
                sx: {
                    margin: '29px 64px',
                    width: '100%',
                    justifyContent: 'center',
                    maxWidth: '1600px',
                    maxHeight: '100vh',
                    height: 'calc(100vh - 58px)',
                    ...paperSx,
                },
            }}
        >
            <div className={styles.modal}>
                {!hideHeader && (
                    <div
                        className={clsx(styles.header, headerProps?.className)}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Space justify="between" {...titleProps} className={clsx(styles.titleContainer, titleProps?.className)}>
                            {typeof title === 'object' ? (
                                title
                            ) : typeof title === 'function' ? (
                                title({ onClose })
                            ) : (
                                <EllipsisText
                                    element={<Typography style={{ color: 'var(--color-secondary-3)', fontWeight: 700 }} />}
                                    text={title}
                                />
                            )}

                            <Space
                                {...(extra && {
                                    divider: true,
                                    dividerProps: {
                                        sx: {
                                            margin: '4px 0',
                                        },
                                    },
                                })}
                                {...extraProps}
                            >
                                {extra && (typeof extra === 'function' ? extra({ onClose }) : extra)}
                                <IconButton
                                    size="s"
                                    variant="text"
                                    type="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose?.();
                                    }}
                                >
                                    <Icon name={(closeIcon as any) || 'close'} />
                                </IconButton>
                            </Space>
                        </Space>
                        {!hideDivider && <Divider flexItem />}
                    </div>
                )}

                <div {...containerProps} className={clsx(styles.body, containerProps?.className)}>
                    {children}
                </div>
            </div>
        </MuiDialog>
    );
};

export type ModalHOCProps = Omit<ModalProps, 'open' | 'children'> & {
    content: (params: {
        onClose: () => Promise<boolean | undefined | void>;
        changeTitle: (title: ReactNode) => void;
        changeExtra: (extra: ReactNode) => void;
    }) => ReactNode | ReactNode[];
};

const ModalHOC = ({ content, onClose, backdropClosable = true, ...restProps }: ModalHOCProps) => {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState<ReactNode>();
    const [extra, setExtra] = useState<ReactNode>();
    const handleOnClose = useCallback(async () => {
        const result = await onClose?.();
        if (typeof result !== 'undefined' && !result) {
            return result;
        }
        setOpen(false);
    }, [onClose]);

    const propsExtra = useMemo(() => restProps.extra, [restProps.extra]);

    useEffect(() => {
        if (propsExtra) {
            if (typeof propsExtra === 'function') {
                setExtra(propsExtra({ onClose: handleOnClose }));
            } else {
                setExtra(propsExtra);
            }
        }
    }, [propsExtra, handleOnClose]);

    const propsTitle = useMemo(() => restProps.title, [restProps.title]);

    useEffect(() => {
        if (propsTitle) {
            if (typeof propsTitle === 'function') {
                setTitle(propsTitle({ onClose: handleOnClose }));
            } else {
                setTitle(propsTitle);
            }
        }
    }, [propsTitle, handleOnClose]);

    const changeTitle = useCallback((newTitle: string | ReactNode) => {
        setTitle(newTitle);
    }, []);

    const changeExtra = useCallback((newExtra: ReactNode) => {
        setExtra(newExtra);
    }, []);

    return (
        <Modal {...restProps} title={title} open={open} backdropClosable={backdropClosable} onClose={handleOnClose} extra={extra}>
            {content({ onClose: handleOnClose, changeTitle, changeExtra })}
        </Modal>
    );
};

interface ModalsRef {
    open: (props: ModalHOCProps) => void;
}
interface ModalsProps {
    container?: HTMLElement;
}

type ModalItemProps = ModalHOCProps & { key: string };

export const Modals = forwardRef<ModalsRef, ModalsProps>((props, ref) => {
    const [items, setItems] = useState<ModalItemProps[]>([]);

    const onClose = (key: string) => {
        setItems((prev) => prev.filter((item) => item.key !== key));
    };

    useImperativeHandle(ref, () => ({
        open: (modalProps) => {
            const key = uniqueId('imbrace-modal');
            setItems((prev) => {
                const clone = [...prev];
                clone.push({
                    key,
                    ...modalProps,
                });
                return clone;
            });
        },
    }));

    return createPortal(
        <>
            {items.map((item) => {
                const { key, ...restProps } = item;
                return (
                    <ModalHOC
                        key={`imbrace-modal-${key}`}
                        {...restProps}
                        onClose={async () => {
                            const result = await restProps.onClose?.();
                            if (typeof result !== 'undefined' && !result) {
                                return result;
                            }
                            onClose(key);
                            return result;
                        }}
                    />
                );
            })}
        </>,
        props.container || document.body,
    );
});

type ModalAPI = {
    modal: (dialogProps: ModalHOCProps) => void;
};

type UseModalType = (props?: ModalProps) => [ModalAPI, ReactElement];

export const useModal: UseModalType = (props) => {
    const modalsRef = useRef<ModalsRef>(null);

    const contextHolder = useMemo(() => <Modals ref={modalsRef} {...props} />, [props]);

    const api = useMemo<ModalAPI>(
        () => ({
            modal: (modalProps: ModalHOCProps) => {
                modalsRef.current?.open(modalProps);
            },
        }),
        [],
    );

    return [api, contextHolder];
};
