import FormControl from '@mui/material/FormControl';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { RadioProps } from '@mui/material/Radio';
import MuiRadio from '@mui/material/Radio';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import RadioGroup from '@mui/material/RadioGroup';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChangeEvent, ReactNode, RefObject } from 'react';
import { forwardRef } from 'react';

import { Typography } from '../Typography';
import type { FieldBaseProps } from '.';
import { FormHelperText, FormLabel } from '.';
import styles from './index.module.scss';

export interface FieldRadioProps extends Omit<FieldBaseProps, 'tooltipPosition'>, RadioGroupProps {
    disabled?: boolean;
    containerRef?: RefObject<HTMLDivElement>;
    groupSx?: SxProps<Theme>;

    onChange?: (e: ChangeEvent<HTMLInputElement>, checked: string) => void;
    children?: ReactNode;
}

const Radio = (props: RadioProps) => {
    return (
        <MuiRadio
            disableRipple
            icon={<div className={`${styles.radio} ${props.disabled ? styles.disabled : ''}`} />}
            checkedIcon={<div className={`${styles.radio} ${styles.checked} ${props.disabled ? styles.disabled : ''}`} />}
            {...props}
            sx={{ padding: 0, ...props.sx, marginRight: '12px' }}
        />
    );
};

export const FieldRadio = (props: Omit<FormControlLabelProps, 'control'>) => {
    return (
        <FormControlLabel
            control={<Radio />}
            {...props}
            sx={{ margin: '0', ...props.sx }}
            label={typeof props.label === 'object' ? props.label : <Typography>{props.label}</Typography>}
        />
    );
};

export const FieldRadios = forwardRef<HTMLInputElement, FieldRadioProps>((props, ref) => {
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
        containerRef,
        groupSx,
        children,
        fullWidth,
        tooltipPlacement,
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

            <RadioGroup ref={ref} sx={groupSx} {...restProps}>
                {children}
            </RadioGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
});
