import FormControl from '@mui/material/FormControl';
import type { QueryKey } from '@tanstack/react-query';
import type { ForwardedRef } from 'react';
import React from 'react';

import type { SelectProps, SelectRef } from '../Select';
import { Select } from '../Select';
import { Tooltip } from '../Tooltip';
import type { FieldBaseProps, Option } from '.';
import { FormHelperText, FormLabel } from '.';
import styles from './index.module.scss';

declare module 'react' {
    function forwardRef<T, P = object>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type FieldSelectProps<Value = unknown, Q extends QueryKey = QueryKey, TQueryFnData = Option[], TData = Option[]> = FieldBaseProps &
    SelectProps<Value, Q, TQueryFnData, TData>;

const SelectV2 = <Value = unknown, Q extends QueryKey = QueryKey, TQueryFnData = Option[], TData = Option[]>(
    props: FieldSelectProps<Value, Q, TQueryFnData, TData>,
    ref: ForwardedRef<SelectRef>,
) => {
    const {
        fullWidth,
        placeholder,
        label,
        error,
        helperText,
        description,
        tooltip,
        tooltipSx,
        labelProps,
        formControlSx,
        tooltipPlacement,
        tooltipPosition,
        InputProps: { ref: containerRef } = {},
        ...restProps
    } = props;

    return (
        <FormControl
            variant="standard"
            className={`${styles.container}`}
            sx={{
                width: fullWidth ? '100%' : undefined,
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
                <div>
                    <Select<Value, Q, TQueryFnData, TData>
                        ref={ref}
                        placeholder={placeholder}
                        fullWidth={fullWidth}
                        error={error}
                        {...(restProps as SelectProps<Value, Q, TQueryFnData, TData>)}
                    />
                </div>
            </Tooltip>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export const FieldSelect = React.forwardRef(SelectV2);
