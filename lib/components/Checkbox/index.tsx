import type { CheckboxProps as MUICheckboxProps } from '@mui/material/Checkbox';
import MUICheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { Icon } from '../Icon';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export const CustomCheckbox = forwardRef<HTMLButtonElement, MUICheckboxProps>((props, ref) => {
    return (
        <MUICheckbox
            ref={ref}
            disableRipple
            className={clsx(styles.checkboxContainer, props.disabled && styles.disabled)}
            icon={<div className={styles.checkbox} />}
            checkedIcon={
                <div className={clsx(styles.checkbox, styles.checked)}>
                    <Icon name="check" fontSize={16} />
                </div>
            }
            indeterminateIcon={<div className={clsx(styles.checkbox, styles.indeterminate)} />}
            {...props}
            sx={{
                padding: 0,
                width: 20,
                height: 20,
                ...props.sx,
            }}
        />
    );
});

export interface CheckboxProps extends Omit<MUICheckboxProps, 'onChange'> {
    labelPlacement?: 'top' | 'start' | 'bottom' | 'end';
    label?: ReactNode;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => {
    const { labelPlacement = 'end', label, indeterminate, onChange, ...restProps } = props;
    return (
        <FormControlLabel
            control={<CustomCheckbox ref={ref} indeterminate={indeterminate} {...restProps} />}
            labelPlacement={labelPlacement}
            sx={{ margin: 0, gap: '8px', alignItems: 'flex-start', ...props.sx }}
            {...(props.label && {})}
            label={typeof props.label === 'object' ? props.label : props.label ? <Typography>{props.label}</Typography> : null}
            onChange={(e, checked) => {
                e.stopPropagation();
                onChange?.(checked);
            }}
        />
    );
});
