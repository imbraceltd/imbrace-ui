import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import MuiDivider from '@mui/material/Divider';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import type { PaperProps } from '@mui/material/Paper';
import type { PopoverOrigin } from '@mui/material/Popover';
import type { SxProps, Theme } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
import type { ForwardedRef, MouseEvent as ReactMouseEvent, ReactElement, ReactNode, RefObject } from 'react';
import React, { useImperativeHandle, useMemo, useState } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import type { TypographyProps } from '../Typography';
import { Typography } from '../Typography';

declare module 'react' {
    function forwardRef<T, P = Record<string, unknown>>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export interface DropdownOption<ValueType> {
    text?: string | ReactNode;
    disabled?: boolean;
    index: ValueType;
    icon?: ReactNode;
    typographyProps?: TypographyProps;
    tooltip?: string;
    textColor?: string;
    sx?: SxProps<Theme>;
    loading?: boolean;
}

export interface DividerOptionType {
    type: 'divider';
    fullWidth?: boolean;
}

export interface DropdownBaseProps<ValueType> {
    /**never
     * Loading status
     * @default false
     */
    loading?: boolean;
    /**
     * Hide Dropdown arrow icon
     * @default false
     */
    hideArrow?: boolean;
    /**
     * Hide option on select
     * @default false
     */
    hideOnSelect?: boolean;
    /**
     * Button text
     */
    text?: string | ReactNode;
    /**
     * Dropdown item show checkbox
     */
    checkbox?: boolean;
    /**
     * icon
     * @default false
     */
    icon?: ReactNode | ((open?: boolean) => ReactNode);
    /**
     * DropdownOption
     * @default []
     */
    options: (DropdownOption<ValueType> | DividerOptionType)[];
    /**
     * Button sx
     * @default
     */
    buttonSx?: SxProps;
    /**
     * Button variant
     */
    variant?: ButtonProps['variant'];
    /**
     * Button type
     */
    type?: ButtonProps['type'];
    /**
     * Arrow color
     */
    arrowColor?: string;
    /**
     * Typography Props
     */
    typographyProps?: TypographyProps;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
    disabled?: boolean;
    menuPaperProps?: PaperProps;
    arrowDownIcon?: ReactElement;
    arrowUpIcon?: ReactElement;
    tabRef?: RefObject<HTMLButtonElement> | RefObject<HTMLDivElement>;
    className?: string;
    /**
     * onClick event
     */
    onClick?: () => void;
}

interface Single<ValueType> {
    /**
     * Multiple options
     * @default
     */
    mode?: 'single';
    /**
     * Selected option index
     * @default
     */
    selectedIndex?: ValueType;
    /**
     * Select function
     * @default
     */
    onSelect?: (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: ValueType) => void;
}

interface Multiple<ValueType> {
    /**
     * Multiple options
     * @default
     */
    mode: 'multiple';
    /**
     * Selected option index
     * @default
     */
    selectedIndex?: ValueType[];
    /**
     * Select function
     * @default
     */
    onSelect?: (event: ReactMouseEvent<HTMLLIElement, MouseEvent>, selectedIndex: ValueType[]) => void;
}

export type DropdownProps<ValueType> =
    | (DropdownBaseProps<ValueType> & Single<ValueType>)
    | (DropdownBaseProps<ValueType> & Multiple<ValueType>);

export const DropdownMenu = styled(MuiMenu)(() => ({
    '& .MuiPopover-paper': {
        boxShadow: '0px 0px 4px rgba(189, 189, 189, 0.25)',
        padding: '8px 0px',
        marginTop: '4px',
        marginBottom: '4px',
    },
    '& .MuiMenu-list': {
        padding: 0,
    },
}));

export const DropdownMenuItem = styled(MuiMenuItem, {
    shouldForwardProp: (propsName) => propsName !== 'hasIcon' && propsName !== 'color' && propsName !== 'hasDescription',
})<{
    hasIcon?: boolean;
    hasDescription?: boolean;
    color?: string;
}>(({ hasIcon, color, hasDescription, theme }) => ({
    padding: '10px 12px',
    ...(hasIcon && { display: 'flex', gap: 12, padding: '8px 12px' }),
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
    color: color ?? 'var(--color-light-7)',
    ...(hasDescription && { alignItems: 'flex-start' }),
    '&:hover': {
        backgroundColor: 'var(--color-secondary-2)',
    },
    '&.Mui-selected': {
        '&:hover': {
            backgroundColor: 'var(--color-primary-2)',
        },
        backgroundColor: 'var(--color-primary-2)',
    },
    '& > svg': {
        fontSize: 24,
        color: color ?? 'var(--color-secondary-3)',
    },
    '&.Mui-disabled': {
        opacity: 1,
        color: 'var(--color-light-3)',
        '& > svg': {
            color: 'var(--color-light-3)',
        },
    },

    // 新增
    // '& .MuiDivider-root': {
    //     marginBottom: 0,
    // },
    transition: theme.transitions.create(['background-color']),
}));

export const DividerOption = styled(MuiDivider, {
    shouldForwardProp: (propsName) => propsName !== 'fullWidth' && propsName !== 'hasIcon',
})<{ fullWidth?: boolean; hasIcon?: boolean }>(({ fullWidth }) => ({
    // margin: '8px 0px 0px 0px',
    margin: '0px !important',
    ...(fullWidth && {
        margin: 0,
        '.MuiMenuItem-root + &': {
            margin: 0,
        },
    }),
}));

const TextStyles = {
    gap: '12px',
    padding: '8px 8px 8px 24px',
    '& > span': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    '& > div.textContainer': {
        flex: 1,
        textAlign: 'center',
    },
};

const IconStyles = {
    gap: '4px',
    minWidth: 'auto',
    padding: '4px',
    height: 32,
    borderRadius: '4px',

    '&:hover': {
        boxShadow: 'none',
    },
};

export interface DropdownRef {
    close: () => void;
}

const Dropdown = <ValueType extends string | number>(
    {
        loading,
        checkbox,
        hideArrow,
        icon,
        arrowDownIcon,
        arrowUpIcon,
        options,
        selectedIndex,
        onSelect,
        hideOnSelect,
        text,
        buttonSx,
        mode,
        variant = 'contained',
        arrowColor,
        typographyProps,
        anchorOrigin = {
            vertical: 'bottom',
            horizontal: 'right',
        },
        transformOrigin = {
            vertical: 'top',
            horizontal: 'right',
        },
        disabled,
        menuPaperProps,
        tabRef,
        className,
        onClick,
        type,
    }: DropdownProps<ValueType>,
    ref: ForwardedRef<DropdownRef>,
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [width, setWidth] = useState<number>();

    useImperativeHandle(ref, () => ({
        close: () => {
            setAnchorEl(null);
        },
    }));

    const handleClick = (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setAnchorEl((tabRef?.current as HTMLButtonElement) ?? event.currentTarget);
        setWidth(event.currentTarget.getBoundingClientRect().width);
        onClick?.();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const hasIcon = useMemo(() => options.some((option) => !('type' in option) && !!option.icon), [options]);

    const selected = useMemo(
        () => (targetIndex: ValueType) => {
            if (mode === 'multiple') {
                const selectedItem = selectedIndex || [];
                return selectedItem.indexOf(targetIndex) !== -1;
            }
            return targetIndex === selectedIndex;
        },
        [mode, selectedIndex],
    );

    return (
        <>
            <Button
                className={`dropdownButton ${className}`}
                disabled={disabled}
                variant={variant}
                type={type ?? variant === 'contained' ? 'primary' : 'secondary'}
                sx={{
                    minWidth: '100px',

                    '& svg': {
                        fontSize: 24,
                    },

                    ...(variant === 'contained' && { ...TextStyles }),
                    ...((variant === 'text' || variant === 'link') && { ...IconStyles }),
                    ...buttonSx,
                }}
                loading={loading}
                onClick={handleClick}
                text={
                    <Space size={12}>
                        {icon ? (
                            typeof icon === 'function' ? (
                                icon(open)
                            ) : (
                                icon
                            )
                        ) : (
                            <div className="textContainer">
                                {typeof text === 'string' ? (
                                    <Typography variant="BodyBold" {...typographyProps}>
                                        {text}
                                    </Typography>
                                ) : (
                                    text
                                )}
                            </div>
                        )}

                        {!hideArrow &&
                            (anchorEl ? (
                                <Typography variant="BodyBold" {...typographyProps}>
                                    {arrowUpIcon ? (
                                        arrowUpIcon
                                    ) : (
                                        <Icon color={arrowColor} style={{ verticalAlign: 'middle' }} name="dropUp" />
                                    )}
                                </Typography>
                            ) : (
                                <Typography variant="BodyBold" {...typographyProps}>
                                    {arrowDownIcon ? (
                                        arrowDownIcon
                                    ) : (
                                        <Icon color={arrowColor} style={{ verticalAlign: 'middle' }} name="dropDown" />
                                    )}
                                </Typography>
                            ))}
                    </Space>
                }
            />
            <DropdownMenu
                anchorEl={anchorEl}
                open={open}
                onClose={(event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
                    event.stopPropagation();
                    handleClose();
                }}
                MenuListProps={{
                    role: 'listbox',
                }}
                disableAutoFocus
                disableEnforceFocus
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                slotProps={{
                    paper: {
                        onClick: (event) => {
                            event.stopPropagation();
                        },
                        ...menuPaperProps,
                        sx: {
                            maxHeight: 300,
                            ...(!icon && {
                                minWidth: width,
                            }),
                            '&::-webkit-scrollbar': {
                                width: '7px !important',
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                borderRadius: '10px',
                                background: 'rgba(130, 130, 130, 0.7)',
                            },
                            '&::-webkit-scrollbar-corner': {
                                background: 'transparent',
                            },
                            ...menuPaperProps?.sx,
                        },
                    },
                }}
            >
                {options.map((option, index) => {
                    if ('type' in option) {
                        return (
                            <div key={`divider-${index}`} style={{ padding: '8px 12px' }}>
                                <DividerOption fullWidth={option.fullWidth} hasIcon={hasIcon || checkbox} key={`divider-${index}`} />
                            </div>
                        );
                    }
                    return (
                        <Tooltip key={option.index} arrow disableHoverListener={!option.tooltip} title={option.tooltip}>
                            <div>
                                <DropdownMenuItem
                                    sx={option.sx}
                                    color={option.textColor}
                                    disabled={option.disabled || option.loading}
                                    selected={selected(option.index) && !checkbox}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        if (mode === 'multiple') {
                                            const selectedItems = selectedIndex || [];
                                            if (selectedItems.indexOf(option.index) === -1) {
                                                onSelect?.(event, [...selectedItems, option.index]);
                                                return;
                                            }

                                            onSelect?.(
                                                event,
                                                selectedItems.filter((selectedItem) => selectedItem !== option.index),
                                            );
                                        } else {
                                            onSelect?.(event, option.index);
                                        }
                                        if (hideOnSelect) {
                                            handleClose();
                                        }
                                    }}
                                    hasIcon={hasIcon || checkbox}
                                >
                                    {option.loading && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <CircularProgress size={16} />
                                        </div>
                                    )}
                                    {checkbox && (
                                        <Checkbox
                                            edge="start"
                                            checked={selected(option.index)}
                                            tabIndex={-1}
                                            disableRipple
                                            color={'primary'}
                                            sx={{
                                                padding: 0,
                                                marginLeft: 0,
                                                '& svg': {
                                                    fontSize: 24,
                                                },
                                            }}
                                        />
                                    )}
                                    {option.icon}
                                    {option.text && (
                                        <EllipsisText element={<Typography {...option.typographyProps} />} text={option.text} />
                                    )}
                                </DropdownMenuItem>
                            </div>
                        </Tooltip>
                    );
                })}
            </DropdownMenu>
        </>
    );
};

const DropdownForwardRef = React.forwardRef(Dropdown);

export { DropdownForwardRef as Dropdown };
