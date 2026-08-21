import 'simplebar-react/dist/simplebar.min.css';

import { ClickAwayListener, Fade, Popper } from '@mui/material';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';

import { Button } from '../Button';
import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Typography } from '../Typography';
import styles from './index.module.scss';
import type { FieldTextProps } from './text';
import { FieldText } from './text';

export interface FieldTimeSlotsPickerProps extends Omit<FieldTextProps, 'onChange'> {
    options: string[] | string[][];
    onChange?: (value?: string) => void;
    emptyText?: string;
    closeOnSelect?: boolean;
    value?: string;
}

const validateOptions = (options: string[] | string[][]) => {
    const hasDuplicateValue = new Set([...options.flat(1)]).size !== options.flat(1).length;
    if (hasDuplicateValue) {
        return false;
    }
    const hasColumn = Array.isArray(options[0]);
    if (hasColumn) {
        const hasNonArrayColumn = (options as string[][]).some((column) => !Array.isArray(column));
        if (!hasNonArrayColumn) {
            const hasNonStringValue = (options as string[][]).some((column) => column.some((option) => typeof option !== 'string'));
            return !hasNonStringValue;
        }
        return false;
    }
    const hasNonStringValue = options.some((option) => typeof option !== 'string');
    return !hasNonStringValue;
};

const TimeSlot = ({
    selected,
    text,
    onClick,
}: {
    selected?: boolean;
    text: string;
    onClick?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
    return (
        <Button
            variant="text"
            size="s"
            text={<EllipsisText style={{ transition: 'none' }} text={text} />}
            onClick={onClick}
            sx={{
                fontWeight: 400,
                color: 'var(--color-light-7)',
                ...(selected && {
                    color: 'white',
                    background: 'var(--color-primary-1)',
                    '&:hover, &:focus, &:active': {
                        background: 'var(--color-primary-4)',
                    },
                }),
            }}
        />
    );
};

export const FieldTimeSlotsPicker = forwardRef<HTMLInputElement, FieldTimeSlotsPickerProps>((props, ref) => {
    const { options, value, onChange, emptyText, closeOnSelect, readOnly, ...fieldTextProps } = props;
    const [selectedSlot, setSelectedSlot] = useState<string | undefined>(value);
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const fieldRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const open = Boolean(anchorEl);

    const isValidOptions = useMemo(() => {
        return validateOptions(options);
    }, [options]);

    useEffect(() => {
        setSelectedSlot(value);
    }, [value]);

    useEffect(() => {
        if (!isValidOptions) {
            console.warn(
                "FieldTimeSlotsPicker - invalid options, please make sure type of options is string[] or string[][] and doesn't have duplicate option",
            );
        }
    }, [isValidOptions]);

    const renderTimeSlots = () => {
        const hasColumn = Array.isArray(options[0]);
        if (hasColumn) {
            return (
                <Space size={16} justify="start" align="start">
                    {(options as string[][]).map((column, index) => {
                        return (
                            <Space key={`column-${index}`} direction="vertical" justify="start" align="stretch" size={8}>
                                {column.map((option) => (
                                    <TimeSlot
                                        key={option}
                                        text={option}
                                        selected={selectedSlot === option}
                                        onClick={() => {
                                            setSelectedSlot(option);
                                            onChange?.(option);
                                            if (closeOnSelect) {
                                                setAnchorEl(undefined);
                                            }
                                        }}
                                    />
                                ))}
                            </Space>
                        );
                    })}
                </Space>
            );
        }
        return (
            <Space direction="vertical" justify="start" align="stretch" size={8}>
                {(options as string[]).map((option) => (
                    <TimeSlot
                        key={option}
                        text={option}
                        selected={selectedSlot === option}
                        onClick={() => {
                            setSelectedSlot(option);
                        }}
                    />
                ))}
            </Space>
        );
    };

    if (!isValidOptions) {
        return null;
    }

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (anchorEl) {
                    setAnchorEl(undefined);
                    return;
                }
            }}
        >
            <div>
                <FieldText
                    ref={fieldRef}
                    inputRef={ref}
                    formControlSx={{
                        cursor: 'pointer',
                    }}
                    inputProps={{
                        sx: {
                            cursor: 'pointer',
                        },
                    }}
                    value={selectedSlot ?? ''}
                    readOnly
                    onClick={(event) => {
                        if (readOnly) {
                            return;
                        }
                        if (anchorEl) {
                            setAnchorEl(undefined);
                            return;
                        }
                        setAnchorEl(event.currentTarget);
                    }}
                    endAdornment={
                        <IconButton size="s" variant="text" type="secondary" sx={{ marginRight: '8px' }}>
                            <Icon name="timeClock" />
                        </IconButton>
                    }
                    {...fieldTextProps}
                />
                <Popper open={open} anchorEl={anchorEl} role="presentation" placement="bottom-start" transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={{ enter: 250, exit: 200 }}>
                            <div className={styles.popperContainer}>
                                <div className={styles.inner}>
                                    {options.length === 0 ? (
                                        <div style={{ padding: '16px' }}>
                                            <Typography style={{ color: 'var(--color-light-3)', userSelect: 'none' }}>
                                                {emptyText || 'No Additional Option'}
                                            </Typography>
                                        </div>
                                    ) : (
                                        <SimpleBar className={styles.slotsContainer}>
                                            <div style={{ padding: '16px' }}>{renderTimeSlots()}</div>
                                        </SimpleBar>
                                    )}
                                </div>
                                {options.length !== 0 && (
                                    <Space className={styles.action} justify="end">
                                        <Button
                                            size="xs"
                                            variant="text"
                                            text={t('clear')}
                                            onClick={() => {
                                                onChange?.('');
                                                setSelectedSlot('');
                                                if (closeOnSelect) {
                                                    setAnchorEl(undefined);
                                                }
                                            }}
                                        />
                                    </Space>
                                )}
                            </div>
                        </Fade>
                    )}
                </Popper>
            </div>
        </ClickAwayListener>
    );
});
