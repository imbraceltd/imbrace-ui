import Box from '@mui/material/Box';
import type { InputBaseProps } from '@mui/material/InputBase';
import type { SxProps, Theme } from '@mui/material/styles';
import type { QueryKey } from '@tanstack/react-query';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isRef } from '../../utils';
import type { Option } from '../Field';
import { Input } from '../Field';
import { Icon } from '../Icon';
import type { IconButtonProps } from '../IconButton';
import { IconButton } from '../IconButton';
import { Select } from '../Select';
import { Tooltip } from '../Tooltip';
import styles from './index.module.scss';

interface GeneralProps extends Omit<InputBaseProps, 'onReset' | 'onClick'> {
    /**
     * Inner input ref
     */
    inputRef?: React.RefObject<HTMLInputElement>;
    /**
     * Search value
     */
    value?: string;

    /**
     * Placeholder
     */
    placeholder?: string;
    /**
     * Reset function
     */
    onReset?: React.MouseEventHandler;
    /**
     * Search height
     */
    height?: number;
    /**
     * Search width
     */
    width?: number;
    sx?: SxProps<Theme>;
    onClick?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
    /**
     * search icon props
     */
    search?: {
        containerStyle?: CSSProperties;
        iconButtonProps?: IconButtonProps;
    };
    /**
     * reset icon props
     */
    reset?: {
        containerStyle?: CSSProperties;
        iconButtonProps?: IconButtonProps;
    };
}

interface NormalProps extends GeneralProps {
    queryKey?: never;
    requestFn?: never;
    defaultSelectValue?: never;
    /**
     * Search function
     */
    onSearch?: (inputValue: string) => void;
}

/**
 * Enable search range setting
 */
interface WithDropdownProps<Q extends QueryKey = QueryKey> extends GeneralProps {
    queryKey: Q;
    requestFn: () => Promise<Option[]>;
    defaultSelectValue?: string;
    /**
     * Search function
     */
    onSearch?: (inputValue: string, selectedValue: string) => void;
}

export type SearchProps<Q extends QueryKey = QueryKey> = NormalProps | WithDropdownProps<Q>;

export const Search = <Q extends QueryKey = QueryKey>(props: SearchProps<Q>) => {
    const {
        inputRef,
        value,
        placeholder,
        onReset,
        height = 40,
        width = '100%',
        sx,
        onClick,
        search,
        reset,
        fullWidth,
        ...restProps
    } = props;
    const { t } = useTranslation();
    const [selectedValue, setSelectedValue] = useState<string>(
        'defaultSelectValue' in restProps && restProps.defaultSelectValue ? restProps.defaultSelectValue || '' : '',
    );
    const [inputValue, setInputValue] = useState<string>(value || '');
    const enableDropdown = 'queryKey' in restProps && 'requestFn' in restProps && !!restProps.queryKey && !!restProps.requestFn;
    const inputRestProps = useMemo(() => {
        if ('queryKey' in restProps && 'requestFn' in restProps) {
            const { queryKey, requestFn, defaultSelectValue, onSearch, ...inputProps } = restProps;
            return inputProps;
        }
        const { onSearch, ...inputProps } = restProps;
        return inputProps;
    }, [restProps]);

    return (
        <div className={`${styles.searchContainer}`}>
            <Input
                inputRef={isRef(inputRef) ? inputRef : undefined}
                placeholder={placeholder}
                fullWidth
                type="text"
                startAdornment={
                    enableDropdown && (
                        <Select
                            queryKey={restProps.queryKey}
                            request={restProps.requestFn}
                            value={selectedValue}
                            containerClassName={styles.dropdown}
                            onChange={(val) => {
                                setSelectedValue?.(val as string);
                                restProps.onSearch?.(inputValue, val as string);
                            }}
                            paperSx={{
                                width: '130px',
                            }}
                            popoverProps={{ disablePortal: false }}
                        />
                    )
                }
                endAdornment={
                    value && onReset ? (
                        <div style={{ padding: '8px', ...reset?.containerStyle }}>
                            <IconButton
                                onClick={(e) => {
                                    setInputValue('');
                                    onReset(e);
                                }}
                                type="secondary"
                                size="xs"
                                variant="text"
                                {...reset?.iconButtonProps}
                            >
                                <Icon name="close" style={{ color: 'var(--color-light-5)', fontSize: 20 }} />
                            </IconButton>
                        </div>
                    ) : onClick ? (
                        <div style={{ padding: '6px', ...search?.containerStyle }}>
                            <Tooltip arrow title={t('search')} placement="top">
                                <IconButton onClick={onClick} type="secondary" size="xs" variant="text" {...search?.iconButtonProps}>
                                    <Icon name="search" style={{ color: 'var(--color-light-4)' }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    ) : (
                        <Box
                            sx={{
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 24,
                            }}
                        >
                            <Icon name="search" style={{ color: 'var(--color-light-5)' }} />
                        </Box>
                    )
                }
                sx={{
                    height,
                    maxWidth: fullWidth ? undefined : width ?? 570,
                    minWidth: width ? undefined : 240,
                    width,
                    ...sx,
                }}
                value={value}
                onChange={(e) => {
                    if ('queryKey' in restProps && 'requestFn' in restProps) {
                        setInputValue(e.target.value);
                        restProps.onSearch?.(e.target.value, selectedValue);
                        return;
                    }
                    restProps.onSearch?.(e.target.value);
                }}
                {...inputRestProps}
            />
        </div>
    );
};
