import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { ReactNode, RefObject } from 'react';
import { forwardRef } from 'react';

import type { CheckboxProps } from '../Checkbox';
import { Checkbox } from '../Checkbox';
import type { FieldBaseProps } from '.';
import { FormHelperText, FormLabel } from '.';
import styles from './index.module.scss';

export interface FieldCheckboxProps extends FieldBaseProps, CheckboxProps {
    disabled?: boolean;
    children?: ReactNode;
    containerRef?: RefObject<HTMLDivElement>;
    checkboxLabel?: () => string | ReactNode;
    textPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

export const FieldCheckbox = forwardRef<HTMLButtonElement, FieldCheckboxProps>((props, ref) => {
    const {
        label,
        error,
        helperText,
        description,
        formControlSx,
        disabled,
        tooltip,
        tooltipSx,
        labelProps,
        children,
        fullWidth,
        tooltipPlacement,
        containerRef,
        checkboxLabel,
        textPlacement = 'top',
        ...restProps
    } = props;


    return (
        <FormControl
            disabled={disabled}
            variant="standard"
            className={`${styles.container}`}
            sx={{
                width: fullWidth ? '100%' : '240px',
                ...(restProps.readOnly && {
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
                />
            )}

            {checkboxLabel ? (
                <div>
                    <FormControlLabel
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '0.875rem',
                            },
                            '& .MuiFormControlLabel-root': {
                                alignSelf: 'self-start'
                            },
                            gap: '12px',
                            marginRight: 0,
                            marginLeft: 0,
                        }}
                        control={
                            <Checkbox ref={ref} {...restProps} />
                        }
                        label={checkboxLabel?.() ?? ''}
                        labelPlacement={textPlacement}
                    />
                </div>
            ) : (
                <Checkbox ref={ref} {...restProps} />
            )}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}

        </FormControl>
    );
});
