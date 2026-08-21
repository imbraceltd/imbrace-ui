import { FormControl } from '@mui/material';
import type { OutlinedInputProps } from '@mui/material/OutlinedInput';
import type { ChangeEvent, ReactNode } from 'react';
import { forwardRef, useEffect, useState } from 'react';

import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import type { FieldBaseProps } from '.';
import { FormHelperText, FormLabel, Input } from '.';
import styles from './index.module.scss';

export interface FieldNumberProps extends FieldBaseProps, Omit<OutlinedInputProps, 'ref' | 'prefix'> {
    prefix?: ReactNode;
    suffix?: ReactNode;
    onReset?: () => void;
    autoFocus?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isValidNumber?: boolean) => void;
    bordered?: boolean;
    compact?: boolean;
    min?: number;
    max?: number;
}

const isValidNumber = (value: string | number, options: { min?: number; max?: number }) =>
    !(
        isNaN(+value) ||
        !isFinite(+value) ||
        +value > Number.MAX_SAFE_INTEGER ||
        +value < Number.MIN_SAFE_INTEGER ||
        (typeof value !== 'string' && typeof value !== 'number') ||
        (typeof options.min !== 'undefined' && +value < options.min) ||
        (typeof options.max !== 'undefined' && +value > options.max)
    );

export const FieldNumber = forwardRef<HTMLInputElement, FieldNumberProps>((props, ref) => {
    const {
        fullWidth,
        placeholder,
        label,
        error,
        helperText,
        description,
        onReset,
        InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
        formControlSx,
        disabled,
        tooltip,
        tooltipSx,
        labelProps,
        autoFocus = false,
        prefix,
        suffix,
        bordered = true,
        compact = false,
        min,
        max,
        tooltipPlacement,
        tooltipPosition,
        ...restProps
    } = props;

    const [value, setValue] = useState<number | string>(restProps.value as number);

    useEffect(() => {
        if (!isValidNumber(restProps.value as string, { min, max })) {
            return;
        }
        setValue(restProps.value as number);
    }, [restProps.value, min, max]);

    return (
        <FormControl
            variant="standard"
            className={`${styles.container}`}
            sx={{
                width: fullWidth ? '100%' : undefined,
                '& .MuiInputBase-root': { border: 'none', borderRadius: '0' },
                '& > div': {
                    overflow: 'hidden',
                    border: bordered ? '1px solid var(--color-secondary-4)' : '0',
                    borderRadius: bordered ? '4px' : 0,
                    ...(!disabled && {
                        '&:hover': {
                            borderColor: 'var(--color-primary-1)',
                        },
                    }),
                    ...(compact && { '& .MuiInputBase-input': { padding: 0 } }),
                    ...(error && {
                        borderColor: 'var(--color-danger-1)',
                        '&:hover': {
                            borderColor: 'var(--color-danger-1)',
                        },
                    }),
                },
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
            <Tooltip
                disableHoverListener={!tooltip || tooltipPosition !== 'input'}
                disableFocusListener
                title={tooltip}
                placement={tooltipPlacement}
                sx={tooltipSx}
                arrow
            >
                <Space size={0}>
                    {prefix}
                    <Input
                        disabled={disabled}
                        inputRef={ref}
                        placeholder={placeholder}
                        fullWidth={fullWidth}
                        type="text"
                        startAdornment={startAdornment}
                        endAdornment={
                            endAdornment ? (
                                endAdornment
                            ) : onReset ? (
                                <IconButton onClick={onReset} size="xs" type="secondary" variant="text" sx={{ marginRight: '8px' }}>
                                    <Icon name="close" fontSize={20} />
                                </IconButton>
                            ) : undefined
                        }
                        inputProps={{
                            inputMode: 'numeric',
                            pattern: '\\d*',
                            autoFocus: autoFocus,
                            max: Number.MAX_SAFE_INTEGER,
                            min: Number.MIN_SAFE_INTEGER,
                        }}
                        {...restProps}
                        sx={{
                            ...(prefix && {
                                flex: 1,
                                '& .MuiInputBase-input': {
                                    paddingLeft: 0,
                                },
                            }),
                            ...(suffix && {
                                flex: 1,
                                '& .MuiInputBase-input': {
                                    paddingRight: 0,
                                },
                            }),
                            ...restProps.sx,
                        }}
                        value={isNaN(value as number) || value === '' || `${value}`.indexOf('.') !== -1 ? value : +value}
                        onKeyDownCapture={(e) => {
                            const validNumber = isValidNumber(value, { min, max }) ? value : restProps.value ?? 0;
                            if (e.key === 'ArrowUp' && +validNumber < Number.MAX_SAFE_INTEGER) {
                                const isValid = isValidNumber(+validNumber + 1, { min, max });
                                if (isValid) {
                                    setValue((prev) => (prev ? +prev + 1 : 1));
                                    restProps.onChange?.(
                                        {
                                            target: {
                                                value: `${typeof validNumber === 'number' ? +validNumber + 1 : 1}`,
                                            },
                                            currentTarget: e.currentTarget,
                                        } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                                        true,
                                    );
                                }
                            }
                            if (e.key === 'ArrowDown' && +validNumber > Number.MIN_SAFE_INTEGER) {
                                const isValid = isValidNumber(+validNumber - 1, { min, max });
                                if (isValid) {
                                    setValue((prev) => (prev ? +prev - 1 : 0));
                                    restProps.onChange?.(
                                        {
                                            target: {
                                                value: `${typeof validNumber === 'number' ? +validNumber - 1 : 0}`,
                                            },
                                            currentTarget: e.currentTarget,
                                        } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                                        true,
                                    );
                                }
                            }
                        }}
                        onChange={(e) => {
                            setValue(
                                isNaN(+e.target.value) || e.target.value === '' || e.target.value.indexOf('.') !== -1
                                    ? e.target.value
                                    : +e.target.value,
                            );
                            if (!isValidNumber(e.target.value, { min, max })) {
                                restProps.onChange?.(e, false);
                                return;
                            }

                            restProps.onChange?.(e, true);
                        }}
                        onBlur={(e) => {
                            if (!isValidNumber(value, { min, max })) {
                                setValue(restProps.value as string);
                                return;
                            }
                            if (restProps.value !== value) {
                                setValue(restProps.value as string);
                                return;
                            }
                            restProps?.onBlur?.(e);
                        }}
                    />
                </Space>
            </Tooltip>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
});
