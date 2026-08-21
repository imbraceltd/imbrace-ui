import MuiFormHelperText from '@mui/material/FormHelperText';
import InputBase from '@mui/material/InputBase';
import type { InputLabelProps } from '@mui/material/InputLabel';
import MuiInputLabel from '@mui/material/InputLabel';
import type { SxProps, Theme } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
import type { TooltipProps } from '@mui/material/Tooltip';
import Tooltip from '@mui/material/Tooltip';
import type { MouseEvent as ReactMouseEvent, ReactNode, Ref } from 'react';

import { Icon } from '../Icon';
import { Space } from '../Space';
import { Typography } from '../Typography';

const TooltipWithHelpIcon = ({
    title,
    placement = 'right',
    tooltipSx,
}: {
    title: string | ReactNode;
    placement: TooltipProps['placement'];
    tooltipSx?: Record<string, string>;
}) => {
    return (
        <Tooltip
            title={title}
            disableFocusListener
            placement={placement}
            arrow
            componentsProps={{
                arrow: {
                    sx: () => ({
                        color: '#D9D9D9',
                    }),
                },
                tooltip: {
                    sx: () => ({
                        backgroundColor: '#D9D9D9',
                        color: 'var(--color-light-7)',
                        fontSize: '12px',
                        fontWeight: 400,
                        padding: '4px 8px',
                        display: 'flex',
                        lineHeight: '18px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...tooltipSx,
                    }),
                },
            }}
        >
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                    name="info"
                    style={{
                        fontSize: '16px',
                        color: 'var(--color-light-4)',
                    }}
                />
            </span>
        </Tooltip>
    );
};

export const Input = styled(InputBase)(({ theme }) => ({
    height: 38,
    width: '100%',
    color: 'var(--color-light-7)',
    border: '1px solid var(--color-secondary-4)',
    borderRadius: '4px',
    '&.Mui-disabled': {
        background: 'var(--color-light-2)',
        borderColor: 'var(--color-light-3)',
        color: 'var(--color-light-4)',
        '&:hover': {
            borderColor: 'var(--color-light-3)',
        },
    },
    '&:hover': {
        borderColor: 'var(--color-primary-1)',
    },
    '&.Mui-focused': {
        borderColor: 'var(--color-primary-1)',
    },
    '&.MuiInputBase-multiline': {
        height: 'auto',
        minHeight: 40,
        padding: 0,
    },
    '& .MuiInputBase-input': {
        position: 'relative',
        padding: '8px 12px',
        height: '100%',
        fontSize: '14px',
        lineHeight: '20px',
        boxSizing: 'border-box',
        color: 'var(--color-light-7)',
        '& svg': {
            color: 'var(--color-light-5)',
            fontSize: 24,
        },
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&.Mui-disabled': {
            color: 'var(--color-light-4)',
            textFillColor: 'var(--color-light-4)',
            '& svg': {
                color: 'var(--color-light-4)',
            },
        },
        '&::-webkit-input-placeholder': {
            color: 'var(--color-light-4)',
            opacity: 1,
        },
    },
    '&.Mui-error': {
        borderColor: 'var(--color-danger-1)',
        '&:hover': {
            borderColor: 'var(--color-danger-1)',
        },
    },
    '& .MuiInputBase-input:read-only': {
        cursor: 'initial',
    },
}));

export const InputLabel = styled(MuiInputLabel)({
    fontSize: 14,
    fontWeight: 800,
    color: 'var(--color-light-7)',
    lineHeight: '20px',
    marginBottom: '4px',
    position: 'relative',
    transform: 'none',
    whiteSpace: 'normal',
    '&.Mui-focused, &.Mui-error': {
        color: 'var(--color-light-7)',
    },
});

export interface FormLabelProps {
    label?: string | ReactNode;
    tooltip?: string | ReactNode;
    tooltipPosition?: 'label' | 'input';
    tooltipSx?: Record<string, string>;
    tooltipPlacement?: TooltipProps['placement'];
    labelProps?: InputLabelProps;
    description?: string | ReactNode;
}
export const FormLabel = ({
    label,
    description,
    tooltip,
    tooltipSx,
    labelProps,
    tooltipPosition = 'label',
    tooltipPlacement = 'top',
}: FormLabelProps) => {
    return (
        <InputLabel shrink disableAnimation {...labelProps}>
            {tooltip && tooltipPosition === 'label' ? (
                <Space size={4}>
                    {label}
                    <TooltipWithHelpIcon title={tooltip} placement={tooltipPlacement} tooltipSx={tooltipSx} />
                </Space>
            ) : (
                <>{label}</>
            )}

            {typeof description === 'object' ? (
                description
            ) : (
                <Typography style={{ color: 'var(--color-light-5)' }}>{description}</Typography>
            )}
        </InputLabel>
    );
};

export const FormHelperText = styled(MuiFormHelperText)({
    fontSize: 12,
    lineHeight: '16px',
    marginTop: '0',
    marginLeft: '12px',
    '&.Mui-error': {
        color: 'var(--color-danger-1)',
    },
});

export interface Option {
    text: string | ReactNode;
    disabled?: boolean;
    value: string | number;
    icon?: ReactNode;
    iconAlignment?: 'center' | 'flex-start' | 'flex-end';
    color?: string;
    description?: string | ReactNode;
    onClick?: (event: ReactMouseEvent<HTMLLIElement, MouseEvent>) => void;
    fixedAtFooter?: boolean;
    /**
     * for renderValue
     */
    custom?: (option: Option) => ReactNode;
    tooltipText?: string;
    /**
     * extra element on the right side of option
     */
    extra?: () => ReactNode;
    /**
     * flex-direction: row-reverse
     */
    reverse?: boolean;
    asChip?: boolean;
}

export interface FieldBaseProps {
    label?: string | ReactNode;
    fullWidth?: boolean;
    error?: boolean;
    placeholder?: string;
    helperText?: string;
    description?: string | ReactNode;
    formControlSx?: SxProps<Theme>;
    tooltip?: string | ReactNode;
    tooltipSx?: Record<string, string>;
    tooltipPosition?: 'label' | 'input';
    tooltipPlacement?: TooltipProps['placement'];
    InputProps?: {
        ref?: Ref<HTMLDivElement>;
        startAdornment?: ReactNode;
        endAdornment?: ReactNode;
    };
    labelProps?: InputLabelProps;
    readOnly?: boolean;
}
