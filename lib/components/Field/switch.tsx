import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { ForwardedRef, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import type { SwitchProps } from '../Switch';
import { Switch } from '../Switch';
import type { FieldBaseProps } from '.';
import { FormLabel } from '.';
import { FormHelperText } from '.';
import styles from './index.module.scss';

export interface FieldSwitchProps extends FieldBaseProps, Omit<SwitchProps, 'ref' | 'onChange' | 'checked'> {
    switchLabel?: (checked?: boolean) => string | ReactNode;
    labelPlacement?: 'bottom' | 'top' | 'end' | 'start';
    onChange: (checked: boolean) => Promise<boolean | void>;
    value?: boolean;
}

const SwitchComponent = (props: FieldSwitchProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
        fullWidth,
        label,
        error,
        helperText,
        description,
        InputProps: { ref: containerRef } = {},
        formControlSx,
        disabled,
        tooltip,
        tooltipSx,
        labelProps,
        switchLabel,
        labelPlacement = 'start',
        onChange,
        value,
        readOnly,
        tooltipPlacement,
        tooltipPosition,
        ...restProps
    } = props;

    return (
        <FormControl
            disabled={disabled}
            variant="standard"
            className={`${styles.container}`}
            sx={{
                width: fullWidth ? '100%' : undefined,
                '& .MuiInputLabel-root.Mui-disabled': {
                    color: 'var(--color-light-7)',
                },
                ...(readOnly && {
                    pointerEvents: 'none',
                }),
                ...formControlSx,
            }}
            error={error}
            ref={containerRef}
        >
            {label && (
                <FormLabel
                    label={label}
                    tooltip={tooltip}
                    tooltipSx={tooltipSx}
                    description={description}
                    labelProps={labelProps}
                    tooltipPlacement={tooltipPlacement}
                    tooltipPosition={tooltipPosition}
                />
            )}

            {switchLabel ? (
                <div>
                    <FormControlLabel
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '0.875rem',
                            },
                            gap: '12px',
                            marginRight: 0,
                            marginLeft: 0,
                        }}
                        control={
                            <Switch
                                {...restProps}
                                type={restProps.type || 'xs'}
                                inputRef={ref}
                                disabled={disabled}
                                onChange={onChange}
                                checked={!!value}
                                tooltip={tooltip}
                                readOnly={readOnly}
                            />
                        }
                        label={switchLabel?.(value) ?? ''}
                        labelPlacement={labelPlacement}
                    />
                </div>
            ) : (
                <Switch inputRef={ref} disabled={disabled} type="xs" onChange={onChange} checked={!!value} readOnly={readOnly} />
            )}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export const FieldSwitch = forwardRef<HTMLInputElement, FieldSwitchProps>(SwitchComponent);
