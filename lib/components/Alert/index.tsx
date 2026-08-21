import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { Icon } from '../Icon';
import type { generalIconMapping } from '../Icon/constant';
import type { IconButtonProps } from '../IconButton';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Typography } from '../Typography';
import styles from './index.module.scss';

type Type = 'success' | 'warning' | 'error';

export interface AlertProps {
    message?: ReactNode;
    type?: Type;
    icon?: ReactNode;
    onClose?: () => Promise<void>;
    actionButton?: ReactNode;
    hideIcon?: boolean;
    hideCloseButton?: boolean;
}

const iconMapping: Record<Type, keyof typeof generalIconMapping> = {
    success: 'checkCircle',
    warning: 'warning',
    error: 'errorOutline',
};

const buttonTypeMapping: Record<Type, IconButtonProps['type']> = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
};

export const Alert = (props: AlertProps) => {
    const { message, actionButton, type = 'success', icon, onClose, hideIcon, hideCloseButton } = props;
    const [loading, setLoading] = useState(false);

    const onClick = useCallback(async () => {
        if (onClose) {
            setLoading(true);
            await onClose();
            setLoading(false);
        }
    }, [onClose]);

    return (
        <div className={`${styles.container} ${styles[type]}`}>
            <Space size={12} style={{ width: '100%' }} justify="between" align="center">
                <Space size={8} align="start">
                    {!hideIcon && <div style={{ height: '20px', fontSize: 20 }}>{icon ? icon : <Icon name={iconMapping[type]} />}</div>}

                    {typeof message === 'object' ? message : <Typography variant="Body">{message}</Typography>}
                </Space>
                {actionButton ? (
                    <div>{actionButton}</div>
                ) : (
                    !hideCloseButton && (
                        <div style={{ height: '20px', display: 'flex', alignSelf: 'flex-start' }}>
                            <IconButton
                                fontSize={16}
                                loading={loading}
                                type={buttonTypeMapping[type]}
                                variant="text"
                                size="xs"
                                onClick={onClick}
                            >
                                <Icon style={{ fontSize: 12 }} name="close" />
                            </IconButton>
                        </div>
                    )
                )}
            </Space>
        </div>
    );
};
