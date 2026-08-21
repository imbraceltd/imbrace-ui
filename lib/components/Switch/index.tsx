import CircularProgress from '@mui/material/CircularProgress';
import styled from '@mui/material/styles/styled';
import type { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';
import MuiSwitch from '@mui/material/Switch';
import type { ChangeEvent, ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Tooltip } from '../Tooltip';
import styles from './index.module.scss';

interface BaseSwitchProps extends MuiSwitchProps {
    type?: 'xs' | 'small' | 'default';
}

const sizeConfig: Record<
    'xs' | 'small' | 'default',
    {
        width: number;
        height: number;
        trackHeight: number;
        margin: number;
        thumbSize: number;
        checkedTranslateX: string;
    }
> = {
    xs: {
        width: 36,
        height: 14,
        trackHeight: 14,
        margin: 6,
        thumbSize: 18,
        checkedTranslateX: 'translateX(22px)',
    },
    small: {
        width: 40,
        height: 16,
        trackHeight: 16,
        margin: 5,
        thumbSize: 20,
        checkedTranslateX: 'translateX(24px)',
    },
    default: {
        width: 50,
        height: 20,
        trackHeight: 20,
        margin: 6,
        thumbSize: 24,
        checkedTranslateX: 'translateX(28px)',
    },
};

export const BaseSwitch = styled(MuiSwitch, { shouldForwardProp: (propName) => propName !== 'type' })<BaseSwitchProps>(({
    type = 'default',
}: BaseSwitchProps) => {
    return {
        padding: '0',
        width: sizeConfig[type].width,
        height: sizeConfig[type].height,
        color: 'var(--color-primary-6)',
        overflow: 'visible',
        '& .MuiSwitch-switchBase': {
            top: '-2px',
            // margin: sizeConfig[type].margin,
            padding: 0,
            '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'var(--color-primary-6)',
                opacity: 1,
            },
            '&.Mui-checked': {
                transform: sizeConfig[type].checkedTranslateX,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                backgroundColor: 'var(--color-light-3)',
                opacity: 1,
            },
        },
        '& .MuiSwitch-thumb': {
            color: '#fff',
            width: sizeConfig[type].thumbSize,
            height: sizeConfig[type].thumbSize,
            boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.16)',
        },
        '& .MuiSwitch-track': {
            borderRadius: 10,
            backgroundColor: 'var(--color-light-3)',

            opacity: 1,
            height: sizeConfig[type].trackHeight,
        },
    };
});

export interface SwitchProps extends Omit<BaseSwitchProps, 'onChange'> {
    checked?: boolean;
    onChange?: (checked: boolean) => Promise<boolean | void>;
    tooltip?: ReactNode;
}

const Spinner = ({ size = 14, thumbSize = 18 }: { size?: number; thumbSize?: number }) => (
    <div className={styles.circle} style={{ width: `${thumbSize}px`, height: `${thumbSize}px` }}>
        {<CircularProgress size={size} sx={{ color: 'var(--color--primary-1)' }} thickness={6} />}
    </div>
);

export const Switch = (props: SwitchProps) => {
    const { onChange, checked, disabled, type = 'default', tooltip, ...restProps } = props;
    const [isChecked, setIsChecked] = useState<boolean>(checked || false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsChecked(checked || false);
    }, [checked]);

    const handelChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            try {
                setIsChecked(e.target.checked);
                setIsLoading(true);
                if (onChange) {
                    const result = await onChange(e.target.checked);
                    if (typeof result !== 'undefined' && !result) {
                        setIsChecked(!e.target.checked);
                    }
                } else {
                    setIsChecked((prev) => !!prev);
                }
                setIsLoading(false);
            } catch (error) {
                setIsChecked(checked || false);
                setIsLoading(false);
            }
        },
        [checked, onChange],
    );

    return (
        <Tooltip disableHoverListener={!tooltip} disableFocusListener disableTouchListener arrow title={tooltip} placement="top-start">
            <div style={{ display: 'inline-flex' }}>
                <BaseSwitch
                    {...restProps}
                    {...(isLoading && {
                        checkedIcon: <Spinner size={sizeConfig[type].trackHeight} thumbSize={sizeConfig[type].thumbSize} />,
                        icon: <Spinner size={sizeConfig[type].trackHeight} thumbSize={sizeConfig[type].thumbSize} />,
                    })}
                    type={type}
                    onChange={handelChange}
                    checked={isChecked}
                    disabled={isLoading || disabled}
                />
            </div>
        </Tooltip>
    );
};
