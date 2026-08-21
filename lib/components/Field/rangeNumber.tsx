import FormControl from '@mui/material/FormControl';
import type { OutlinedInputProps } from '@mui/material/OutlinedInput';
import type { ForwardedRef } from 'react';
import { forwardRef, useEffect, useState } from 'react';

import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import type { FieldBaseProps } from '.';
import { FormHelperText, FormLabel } from '.';
import styles from './index.module.scss';
import { FieldNumber, type FieldNumberProps } from './number';

export interface FieldRangeNumberProps
    extends Omit<FieldBaseProps, 'placeholder'>,
        Omit<OutlinedInputProps, 'ref' | 'onChange' | 'placeholder' | 'disabled'> {
    value?: (number | string)[];
    placeholder?: [string, string];
    onChange?: (e: (number | string | null)[], isValidNumber?: boolean) => void;
    disabled?: [boolean, boolean];
    fieldNumberProps?: {
        start?: Omit<FieldNumberProps, 'value' | 'onChange'>;
        end?: Omit<FieldNumberProps, 'value' | 'onChange'>;
    };
}

const isValidNumber = (value: string | number) =>
    !(
        value === '' ||
        isNaN(+value) ||
        !isFinite(+value) ||
        +value > Number.MAX_SAFE_INTEGER ||
        +value < Number.MIN_SAFE_INTEGER ||
        (typeof value !== 'string' && typeof value !== 'number')
    );

const validateValue = (value?: (number | string | null)[]) => !value?.some((v) => !isValidNumber(v as string));

// eslint-disable-next-line
export const RangeNumberComponent = (props: FieldRangeNumberProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
        fullWidth,
        placeholder,
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
        onChange,
        fieldNumberProps,
        readOnly,
        tooltipPlacement,
        tooltipPosition,
        ...restProps
    } = props;

    const [value, setValue] = useState<(number | string | null)[]>(restProps.value || [null, null]);

    useEffect(() => {
        setValue(restProps?.value?.map((v) => (isValidNumber(v) ? v : null)) || [null, null]);
    }, [restProps.value]);

    return (
        <FormControl
            variant="standard"
            className={`${styles.container}`}
            sx={{ width: fullWidth ? '100%' : undefined, ...formControlSx }}
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
                <Space size={8} style={fullWidth ? { width: '100%' } : undefined}>
                    <FieldNumber
                        {...fieldNumberProps?.start}
                        value={value?.[0]}
                        onChange={(e) => {
                            const newValue = [isValidNumber(+e.target.value) ? +e.target.value : null, value?.[1] ?? null];
                            if (typeof value?.[1] === 'number') {
                                if (+e.target.value > value?.[1]) {
                                    return;
                                }
                            }
                            setValue(newValue);
                            onChange?.(newValue, validateValue(newValue));
                        }}
                        fullWidth
                        placeholder={placeholder?.[0]}
                        disabled={disabled?.[0]}
                        readOnly={readOnly}
                    />
                    <div className={`${styles.dash} ${!label ? styles.noLabel : ''}`}>－</div>
                    <FieldNumber
                        {...fieldNumberProps?.end}
                        value={value?.[1]}
                        onChange={(e) => {
                            const newValue = [value?.[0] ?? null, isValidNumber(+e.target.value) ? +e.target.value : null];
                            if (typeof value?.[0] === 'number') {
                                if (+e.target.value < value?.[0]) {
                                    return;
                                }
                            }
                            setValue(newValue);
                            onChange?.(newValue, validateValue(newValue));
                        }}
                        fullWidth
                        placeholder={placeholder?.[1]}
                        disabled={disabled?.[1]}
                        readOnly={readOnly}
                    />
                </Space>
            </Tooltip>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export const FieldRangeNumber = forwardRef<HTMLInputElement, FieldRangeNumberProps>(RangeNumberComponent);
