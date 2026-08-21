import LoadingButton from '@mui/lab/LoadingButton';
import type { SxProps } from '@mui/material/styles';
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
            color: ColorMapping[type].textHoverColor,
            background: ColorMapping[type].textHoverBackgroundColor,
        },
        '&.Mui-disabled': {
            color: ColorMapping[type].disabledColor,
        },
    },
});

const SizeMapping = {
    default: {
        padding: '8px',
        borderRadius: '8px',
    },
    s: {
        padding: '4px',
        borderRadius: '4px',
    },
    xs: {
        padding: '2px',
        borderRadius: '4px',
    },
};

export interface IconButtonProps {
    /**
     * Color of button
     * @default primary
     */
    type?: keyof typeof ColorMapping;
    /**
     * Size of button
     * @default default
     */
    size?: 'default' | 's' | 'xs';
    /**
     * Variant of button
     * @default contained
     */
    variant?: 'outlined' | 'contained' | 'text';
    /**
     * Size of icon
     * @default 24
     */
    fontSize?: number;
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
     * Icon Element
     */
    children?: ReactNode;
    sx?: SxProps;
    className?: string;
    disableRipple?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
    const { type = 'primary', size = 'default', variant = 'contained', fontSize = 24, sx, ...restProps } = props;
    return (
        <LoadingButton
            ref={ref}
            variant={variant}
            sx={{
                fontSize,
                display: 'flex',
                boxShadow: 'none',
                letterSpacing: '0.02em',
                transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiCircularProgress-root': {
                    width: fontSize ? `${fontSize}px !important` : '22px !important',
                    height: fontSize ? `${fontSize}px !important` : '22px !important',
                },
                '& > span': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                minWidth: 'auto',

                ...SizeMapping[size],
                ...VariantMapping(type)[variant],
                ...sx,
            }}
            {...restProps}
        >
            {props.children}
        </LoadingButton>
    );
});
