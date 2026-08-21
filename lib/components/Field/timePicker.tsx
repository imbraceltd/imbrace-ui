import type { MenuItemProps, SxProps, Theme } from '@mui/material';
import { Box, ClickAwayListener, DialogActions, listClasses } from '@mui/material';
import type {
    BaseSingleInputFieldProps,
    FieldSection,
    PickersActionBarProps,
    TimePickerProps,
    TimeValidationError,
    UseTimeFieldProps,
} from '@mui/x-date-pickers';
import {
    DesktopTimePicker,
    LocalizationProvider,
    multiSectionDigitalClockClasses,
    pickersLayoutClasses,
    useClearableField,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTimeField } from '@mui/x-date-pickers/TimeField/useTimeField';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { PropsWithChildren, Ref } from 'react';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../Button';
import { Icon } from '../Icon';
import type { FieldBaseProps } from '.';
import styles from './index.module.scss';
import { FieldText } from './text';

dayjs.extend(utc);
dayjs.extend(timezone);

export type TimePickerRef = { openPicker: () => void };

export interface FieldTimePickerProps
    extends Omit<FieldBaseProps, 'placeholder' | 'onChange'>,
    Omit<TimePickerProps<Dayjs>, 'onChange' | 'value'> {
    onChange?: (changeTime: Date | null, validation: { validationError: string | null }) => void;
    timePickerRef?: Ref<TimePickerRef>;
    customIcon?: (open: boolean) => JSX.Element;
    defaultOpenPicker?: boolean;
    value?: Date | Dayjs | string | null;
    autoFocus?: boolean;
    bordered?: boolean;
}

interface CustomFieldProps
    extends UseTimeFieldProps<Dayjs, true>,
    BaseSingleInputFieldProps<Dayjs | null, Dayjs, FieldSection, true, TimeValidationError> {
    ref?: Ref<HTMLDivElement>;
    sx?: SxProps<Theme>;
    error?: boolean;
    fullWidth?: boolean;
    formControlSx?: SxProps<Theme>;
    inputRef?: Ref<HTMLInputElement>;
    inputMode: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | undefined;
    placeholder: string;
}

const popperSx = {
    '& .MuiPaper-root': {
        boxShadow: '0px 4px 8px rgba(189, 189, 189, 0.08), 0px 2px 24px rgba(224, 224, 224, 0.2)',
    },
};

export const CustomField = (props: CustomFieldProps) => {
    const { inputRef: externalInputRef, slots, slotProps, error, fullWidth, formControlSx, ...textFieldProps } = props;
    const fieldResponse = useTimeField<Dayjs, true, typeof textFieldProps>({
        ...textFieldProps,
    });
    const { inputMode, focused, ...restResponse } = fieldResponse;
    const processedFieldProps = useClearableField(restResponse);

    return (
        <FieldText
            {...processedFieldProps}
            ref={externalInputRef}
            error={error}
            fullWidth={fullWidth}
            formControlSx={{ width: fullWidth ? '100%' : undefined, ...formControlSx }}
            sx={{
                // background: '#fff',
                '& .MuiIconButton-root': {
                    transition: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    padding: '4px',
                    marginRight: '8px',

                    '&:hover': {
                        background: 'var(--color-secondary-2)',
                        borderRadius: '8px',
                    },
                    '&:active & :focus': {
                        background: 'var(--color-primary-2)',
                        borderRadius: '8px',
                    },
                },

                '& .MuiOutlinedInput-root': {
                    paddingRight: '22px',
                    '&.Mui-focused fieldset': {
                        borderWidth: '1px',
                    },
                },
                '& .MuiInputBase-input': {
                    paddingRight: 0,
                    color: restResponse.value !== restResponse.placeholder ? 'var(--color-light-7) !important' : 'inherit',
                },
                svg: {
                    color: restResponse.value ? 'var(--color-light-5)' : 'var(--color-light-4)',
                },
                '&.Mui-focused svg': {
                    color: 'var(--color-primary-1)',
                },
                ...restResponse.sx,
            }}
            inputProps={{
                focused: `${focused}`,
                inputMode,
            }}
        />
    );
};

export const CustomActionBar = (props: PickersActionBarProps & { onClear?: () => void }) => {
    const { onClear, onSetToday, onAccept, onCancel, ...restProps } = props;
    const { t } = useTranslation();

    return (
        <>
            <DialogActions sx={{ padding: '4px 8px', borderTop: '1px solid var(--color-light-3)' }} {...restProps}>
                <Button text={t('clear')} variant="text" size="xs" onClick={() => onClear?.()} />
            </DialogActions>
        </>
    );
};

export const CustomClockItem = (props: PropsWithChildren<MenuItemProps>) => {
    const { children, disabled, selected, onClick } = props;

    return (
        <Box sx={{ margin: '8px 16px' }}>
            <li onClick={onClick}>
                <Button
                    sx={{
                        fontWeight: 400,
                        color: !selected ? (disabled ? 'var(--color-light-3)' : 'var(--color-light-7)') : undefined,
                        height: '36px',
                    }}
                    text={children}
                    size="xs"
                    variant={!selected ? 'text' : 'contained'}
                />
            </li>
        </Box>
    );
};

export const CustomSectionItem = (props: PropsWithChildren<MenuItemProps>) => {
    const { children, disabled, selected, sx, onClick, disableRipple, ...restProps } = props;

    return (
        <li
            onClick={(e) => {
                if (disabled) return;
                onClick?.(e);
            }}
            {...restProps}
            className={`${styles.li} ${restProps.className}`}
        >
            <Button
                sx={{
                    ...sx,
                    fontWeight: 400,
                    color: !selected ? (disabled ? 'var(--color-light-3)' : 'var(--color-light-7)') : undefined,
                }}
                text={children}
                size="xs"
                variant={!selected ? 'text' : 'contained'}
            />
        </li>
    );
};

export const FieldTimePicker = forwardRef<HTMLInputElement, FieldTimePickerProps>((props, ref) => {
    const {
        fullWidth,
        helperText,
        error,
        value,
        formControlSx,
        timePickerRef,
        customIcon,
        defaultOpenPicker,
        autoFocus = false,
        bordered,
        timeSteps = {
            minutes: 1,
        },
        readOnly,
        tooltip,
        tooltipPlacement,
        tooltipPosition,
        description,
        ...restProps
    } = props;
    const [open, setOpen] = useState(!!defaultOpenPicker);

    useImperativeHandle(timePickerRef, () => ({
        openPicker: () => {
            if (!restProps.disabled && !readOnly) {
                setOpen(true);
            }
        },
    }));

    // Provide a default value to ensure the component remains controlled.
    const controlledValue = useMemo(() => {
        try {
            if (value) {
                if (typeof value === 'string') {
                    if (/^\d{2}:\d{2}$/.test(value)) {
                        const hours = +value.split(':')[0];
                        const minutes = +value.split(':')[1];
                        if (!isNaN(hours) && !isNaN(minutes)) {
                            return dayjs(new Date(0).setDate(2)).set('hour', hours).set('minute', minutes);
                        }
                    }
                    if (dayjs(value).isValid()) {
                        return dayjs(value);
                    }

                    return null;
                }
                if (dayjs.isDayjs(value)) {
                    return value;
                }
                if (value instanceof Date) {
                    if (new Date(value).getFullYear() > 1970) {
                        const hours = new Date(value).getHours();
                        const minutes = new Date(value).getMinutes();
                        return dayjs(new Date(0)).set('hour', hours).set('minute', minutes);
                    }
                    return dayjs(new Date(value));
                }
            }
            return null;
        } catch (err) {
            return null;
        }
    }, [value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ width: '100%' }}>
                <ClickAwayListener
                    onClickAway={() => {
                        if (open) {
                            setOpen(false);
                        }
                    }}
                >
                    <div style={{ width: '100%' }}>
                        <DesktopTimePicker
                            referenceDate={dayjs(new Date(0))}
                            {...restProps}
                            orientation="portrait"
                            readOnly={readOnly}
                            onChange={(changedValue, validation) => {
                                try {
                                    const hours = changedValue?.get('hour');
                                    const minutes = changedValue?.get('minute');

                                    if (changedValue?.isValid() && typeof hours !== 'undefined' && typeof minutes !== 'undefined') {
                                        restProps?.onChange?.(
                                            changedValue
                                                ? dayjs(new Date(0)).set('hour', hours).set('minute', minutes).utc().toDate()
                                                : null,
                                            validation,
                                        );
                                    }
                                } catch (err) {
                                    restProps?.onChange?.(null, validation);
                                }
                            }}
                            autoFocus={autoFocus}
                            ampm={false}
                            inputRef={ref}
                            value={controlledValue}
                            open={open}
                            timeSteps={timeSteps}
                            slots={{
                                field: CustomField,
                                openPickerIcon: customIcon
                                    ? () => customIcon(open)
                                    : () => <Icon style={{ color: 'var(--color-secondary-1)' }} name="timeClock" />,
                                digitalClockItem: CustomClockItem,
                                digitalClockSectionItem: CustomSectionItem,
                                actionBar: CustomActionBar,

                                ...restProps.slots,
                            }}
                            slotProps={{
                                ...restProps.slotProps,
                                popper: {
                                    sx: popperSx,
                                    ...restProps.slotProps?.popper,
                                },
                                openPickerButton: {
                                    onClick: (event) => {
                                        event.stopPropagation();
                                        if (!restProps.disabled && !readOnly) {
                                            setOpen((prev) => !prev);
                                        }
                                    },
                                    disabled: restProps.disabled,
                                    ...restProps.slotProps?.openPickerButton,
                                },

                                layout: {
                                    sx: {
                                        [`.${pickersLayoutClasses.contentWrapper}`]: {
                                            gridColumn: 1,
                                            gridRow: 1,
                                        },
                                        [`.${multiSectionDigitalClockClasses.root}`]: {
                                            padding: '16px 12px',
                                            border: 'none',
                                            [`.${listClasses.root}`]: {
                                                [`& + .${listClasses.root}`]: {
                                                    marginLeft: 0,
                                                    marginRight: '4px',
                                                },
                                                padding: 0,
                                                marginLeft: '4px',
                                                border: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                scrollbarGutter: 'stable',
                                                width: 43,
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
                                            },
                                        },
                                    },
                                },
                                digitalClockSectionItem: {
                                    sx: {
                                        minWidth: 'auto',
                                        width: 36,
                                        height: 36,
                                        borderRadius: '8px',
                                        fontSize: 14,
                                    },
                                } as any,
                                actionBar: {
                                    onClear: () => {
                                        restProps?.onChange?.(null, { validationError: null });
                                    },
                                } as any,
                                field: {
                                    fullWidth,
                                    error,
                                    formControlSx,
                                    helperText: helperText,
                                    placeholder: 'HH:MM',
                                    onClick: () => {
                                        if (!restProps.disabled && !readOnly) {
                                            setOpen(true);
                                        }
                                    },
                                    bordered,
                                    tooltip,
                                    tooltipPlacement,
                                    tooltipPosition,
                                    description,
                                    ...restProps.slotProps?.field,
                                } as any,
                            }}
                            closeOnSelect={false}
                        />
                    </div>
                </ClickAwayListener>
            </div>
        </LocalizationProvider>
    );
});
