import LoadingButton from '@mui/lab/LoadingButton';
import type { SxProps, Theme } from '@mui/material/styles';
import type { MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';

import { ColorMapping } from '../../utils';

const VariantMapping = (type: keyof typeof ColorMapping) => ({
    outlined: {
        borderColor: ColorMapping[type].backgroundColor,
        color: ColorMapping[type].backgroundColor,
        '&:hover, &:focus, &:active': {
            boxShadow: 'none',
            borderColor: ColorMapping[type].backgroundColor,
            color: ColorMapping[type].backgroundColor,
            background: ColorMapping[type].textHoverBackgroundColor,
        },
        '&.Mui-disabled': {
            borderColor: ColorMapping[type].disabledColor,
            color: ColorMapping[type].disabledColor,
        },
    },
    contained: {
        background: ColorMapping[type].backgroundColor,
        '&:hover, &:focus, &:active': {
            boxShadow: 'none',
            background: ColorMapping[type].hoverBackgroundColor,
        },
        '&.Mui-disabled': {
            background: ColorMapping[type].disabledColor,
            color: '#fff',
        },
    },
    text: {
        color: ColorMapping[type].backgroundColor,
        '&:hover, &:focus, &:active': {
            boxShadow: 'none',
            background: ColorMapping[type].textHoverBackgroundColor,
        },
        '&.Mui-disabled': {
            color: ColorMapping[type].disabledColor,
        },
    },
    link: {
        color: ColorMapping[type].backgroundColor,
        padding: '2px 0px',
        minWidth: 'auto',
        height: 'auto',
        '&:hover, &:focus, &:active': {
            boxShadow: 'none',
            background: 'none',
            color: ColorMapping[type].hoverBackgroundColor,
        },
        '&.Mui-disabled': {
            color: ColorMapping[type].disabledColor,
        },
    },
});

const SizeMapping = {
    l: {
        gap: '11px',
        width: 257,
        height: 40,
        '& svg ': {
            fontSize: 16,
        },
    },
    default: {
        gap: '11px',
        width: 'auto',
        height: 40,
        padding: '0 48px',
        '& svg ': {
            fontSize: 16,
        },
    },
    s: {
        gap: '8px',
        width: 'auto',
        height: 32,
        padding: '0 24px',
        '& svg ': {
            fontSize: 16,
        },
    },
    xs: {
        gap: '8px',
        width: 'auto',
        height: 32,
        padding: '0 8px',
        '& svg ': {
            fontSize: 16,
        },
    },
    xxs: {
        gap: '8px',
        width: 'auto',
        height: 28,
        padding: '0 8px',
        borderRadius: '4px',
        minWidth: 'auto',
        '& svg ': {
            fontSize: 16,
        },
    },
};

export interface ButtonProps {
    /**
     * Color of button
     * @default primary
     */
    type?: keyof typeof ColorMapping;
    /**
     * Size of button
     *
     * all sizes except "l" have a dynamic width according to its content,
     * "l" size have a fixed width
     * @default default
     */
    size?: 'l' | 'default' | 's' | 'xs' | 'xxs';
    /**
     * Variant of button
     * @default contained
     */
    variant?: 'outlined' | 'contained' | 'text' | 'link';
    /**
     * Button inner text
     */
    text?: string | ReactNode;
    /**
     * Button disabled status
     * @default false
     */
    disabled?: boolean;
    /**
     * Button loading status
     * @default false
     */
    loading?: boolean;
    /**
     * Click function
     */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Button start icon
     */
    startIcon?: JSX.Element | ReactNode | null;
    /**
     * Button end icon
     */
    endIcon?: JSX.Element | ReactNode | null;

    /**
     * Custom button style
     */
    sx?: SxProps<Theme>;
    className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { type = 'primary', text, startIcon, endIcon, size = 'default', variant = 'contained', sx, className, ...restProps } = props;
    return (
        <LoadingButton
            ref={ref}
            variant={variant === 'link' ? 'text' : variant}
            className={className}
            sx={{
                display: 'flex',
                borderRadius: '8px',
                boxShadow: 'none',
                fontSize: 14,
                fontWeight: 800,
                lineHeight: '20px',
                letterSpacing: '0.02em',
                transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiCircularProgress-root': {
                    width: '22px !important',
                    height: '22px !important',
                },
                '& > span': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                textTransform: variant === 'link' ? 'none' : 'uppercase',
                ...SizeMapping[size],
                ...VariantMapping(type)[variant],
                ...sx,
            }}
            disableRipple={variant === 'link'}
            {...restProps}
        >
            {startIcon && startIcon}
            {text && <span>{text}</span>}
            {endIcon && endIcon}
        </LoadingButton>
    );
});
