import { Box, ClickAwayListener, type MenuItemProps, type SxProps, type Theme } from '@mui/material';
import type {
    BaseSingleInputFieldProps,
    DateTimePickerProps,
    DateTimeValidationError,
    FieldSection,
    UseDateTimeFieldProps,
} from '@mui/x-date-pickers';
import { DesktopDateTimePicker, LocalizationProvider, useClearableField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDateTimeField } from '@mui/x-date-pickers/DateTimeField/useDateTimeField';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { PropsWithChildren, Ref } from 'react';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { Button } from '../Button';
import { Icon } from '../Icon';
import type { FieldBaseProps } from '.';
import styles from './index.module.scss';
import { FieldText } from './text';
import { CustomActionBar } from './timePicker';

export type DateTimePickerRef = { openPicker: () => void };

export interface FieldDateTimePickerProps extends Omit<FieldBaseProps, 'onChange'>, Omit<DateTimePickerProps<Dayjs>, 'onChange' | 'value'> {
    value?: Date | Dayjs | null | string;
    onChange?: (date: Date | null, validation: { validationError: string | null }) => void;
    datetimePickerRef?: Ref<DateTimePickerRef>;
    customIcon?: (open: boolean) => JSX.Element;
    defaultOpenPicker?: boolean;
    bordered?: boolean;
}

interface CustomFieldProps
    extends UseDateTimeFieldProps<Dayjs, true>,
    BaseSingleInputFieldProps<Dayjs | null, Dayjs, FieldSection, true, DateTimeValidationError> {
    ref?: Ref<HTMLDivElement>;
    sx?: SxProps<Theme>;
    error?: boolean;
    fullWidth?: boolean;
    formControlSx?: SxProps<Theme>;
    inputRef?: Ref<HTMLInputElement>;
    inputMode: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | undefined;
    placeholder: string;
}

const paperSx = {
    '.MuiDayCalendar-header': {
        '& span': {
            color: 'var(--color-light-4)',
        },
    },

    '.MuiYearCalendar-root': {
        gap: '2px',
        height: 168,
        margin: '12px 0 24px 0',
        padding: '0 2px 0 24px',
    },
    '.MuiPickersMonth-root': {
        flex: 1,
        '.MuiPickersMonth-monthButton': {
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '14px',
            color: 'var(--color-light-7)',
            border: '1px solid transparent',
            padding: '8px 16px',
            height: '32px',
            width: '68px',
            margin: '2px 0',
            borderRadius: '8px',
            '&:hover, &:focus': {
                transition: 'none',
                background: 'var(--color-primary-3)',
            },
            '&.Mui-selected': {
                color: 'var(--color-light-1)',
                backgroundColor: 'var(--color-primary-1)',
            },
            '&.Mui-disabled': {
                color: 'var(--color-secondary-4) ',
            },
        },
    },
    '.MuiPickersYear-root': {
        flex: 1,
        '.MuiPickersYear-yearButton': {
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '14px',
            color: 'var(--color-light-7)',
            border: '1px solid transparent',
            padding: '8px 16px',
            height: '32px',
            width: '68px',
            margin: 0,
            borderRadius: '8px',
            '&:hover, &:focus': {
                transition: 'none',
                background: 'var(--color-primary-3)',
            },
            '&.Mui-selected': {
                color: 'var(--color-light-1)',
                backgroundColor: 'var(--color-primary-1)',
            },
            '&.Mui-disabled': {
                color: 'var(--color-secondary-4) ',
            },
        },
    },
    '.MuiPickersArrowSwitcher-button': {
        margin: 0,
        color: 'var(--color-secondary-1)',
    },
    '.MuiDateCalendar-root': {
        padding: '0 6px',
    },
    '.MuiMultiSectionDigitalClock-root': {
        padding: '16px 5px 16px 16px',
        '> .MuiList-root': {
            width: '47px',
        },
    },
    '.MuiList-root:not(:first-of-type)': {
        borderLeft: 'none',
    },
};

export const daySx = {
    color: 'var(--color-light-7)',
    borderRadius: '8px',
    fontWeight: 400,
    fontSize: '14px',
    transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
        background: 'var(--color-primary-3)',
    },
    '&:hover': {
        background: 'var(--color-primary-3)',
    },
    '&.MuiPickersDay-today': {
        fontWeight: 400,
        backgroundColor: 'transparent',
        border: '1px solid var(--color-primary-1)',
        color: 'var(--color-light-7)',
        '&:focus': {
            backgroundColor: 'transparent',
            color: 'var(--color-light-7)',
        },
        '&:hover': {
            color: 'var(--color-light-7)',
            background: 'var(--color-primary-3)',
        },
    },
    '&.Mui-selected': {
        fontWeight: 400,
        background: 'var(--color-primary-1)',
        color: 'var(--color-light-1)',

        '&:focus': {
            background: 'var(--color-primary-1)',
            color: 'var(--color-light-1)',
        },
        '&:hover': {
            color: 'var(--color-light-1)',
            background: 'var(--color-primary-4)',
        },
    },
    '&.Mui-disabled': {
        color: 'var(--color-secondary-4) ',
    },
};

const popperSx = {
    '& .MuiPaper-root': {
        boxShadow: '0px 4px 8px rgba(189, 189, 189, 0.08), 0px 2px 24px rgba(224, 224, 224, 0.2)',
        '& .MuiIconButton-root': {
            transition: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            padding: '4px',

            '&:hover': {
                background: 'var(--color-secondary-2)',
                borderRadius: '8px',
            },
            '&:active & :focus': {
                background: 'var(--color-primary-2)',
                borderRadius: '8px',
            },
        },
    },
    '& .MuiPickersArrowSwitcher-root': {
        '& .MuiIconButton-root': {
            transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                background: 'var(--color-secondary-3)',
                color: 'white',
            },
            '&.Mui-disabled': {
                color: 'var(--color-secondary-4)',
            },
        },
    },
    '& .MuiDivider-root': {
        borderBottomWidth: 'inherit',
    },
};

export const CustomField = (props: CustomFieldProps) => {
    const { inputRef: externalInputRef, slots, slotProps, error, fullWidth, formControlSx, ...textFieldProps } = props;
    const fieldResponse = useDateTimeField<Dayjs, true, typeof textFieldProps>({
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
            style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '8px',
            }}
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

const CustomClockItem = (props: PropsWithChildren<MenuItemProps>) => {
    const { children, disabled, selected, onClick } = props;

    return (
        <Box
            sx={{
                margin: '8px 16px',
                ':first-of-type': { marginTop: '16px' },
                ':last-of-type': { marginBottom: '16px' },
            }}
        >
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

export const FieldDatetimePicker = forwardRef<HTMLInputElement, FieldDateTimePickerProps>((props, ref) => {
    const {
        fullWidth,
        helperText,
        placeholder,
        error,
        value,
        formControlSx,
        datetimePickerRef,
        customIcon,
        defaultOpenPicker,
        bordered,
        readOnly,
        tooltip,
        tooltipPlacement,
        tooltipPosition,
        tooltipSx,
        description,
        ...restProps
    } = props;
    const [open, setOpen] = useState(!!defaultOpenPicker);

    useImperativeHandle(datetimePickerRef, () => ({
        openPicker: () => {
            if (!restProps.disabled && !readOnly) {
                setOpen(true);
            }
        },
    }));

    // Provide a default value to ensure the component remains controlled.
    const controlledValue = useMemo(() => {
        if (value) {
            if (typeof value === 'string' && dayjs(value).isValid()) {
                return dayjs(value);
            }
            if (dayjs.isDayjs(value)) {
                return value;
            }
            if (value instanceof Date) {
                return dayjs(value);
            }
            return null;
        }
        return null;
    }, [value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ClickAwayListener
                onClickAway={(e) => {
                    e.stopPropagation();
                    if (open) {
                        setOpen(false);
                    }
                }}
            >
                <div>
                    <DesktopDateTimePicker
                        {...restProps}
                        ampm={false}
                        onChange={(changedValue, validation) => {
                            restProps?.onChange?.(changedValue ? changedValue.toDate() : null, validation);
                        }}
                        inputRef={ref}
                        value={controlledValue}
                        open={open}
                        onClose={() => {
                            setOpen(false);
                        }}
                        readOnly={readOnly}
                        slots={{
                            field: CustomField,
                            digitalClockItem: CustomClockItem,
                            digitalClockSectionItem: CustomSectionItem,
                            openPickerIcon: customIcon
                                ? () => customIcon(open)
                                : () => <Icon style={{ color: 'var(--color-secondary-1)' }} name="calendar" />,
                            actionBar: !restProps.disableOpenPicker ? CustomActionBar : undefined,
                            ...restProps.slots,
                        }}
                        slotProps={{
                            ...restProps.slotProps,
                            popper: {
                                sx: popperSx,
                                ...restProps.slotProps?.popper,
                            },
                            desktopPaper: {
                                sx: paperSx,
                                ...restProps.slotProps?.desktopPaper,
                            },
                            openPickerButton: {
                                onClick: (event) => {
                                    event.stopPropagation();
                                    if (!restProps.disabled && !readOnly) {
                                        setOpen((prev) => !prev);
                                    }
                                },
                                sx: {
                                    '&.Mui-disabled': {
                                        color: 'var(--color-light-3)',
                                    },
                                },
                                disabled: restProps.disabled,
                                ...restProps.slotProps?.openPickerButton,
                            },
                            actionBar: {
                                onClear: () => {
                                    restProps?.onChange?.(null, { validationError: null });
                                },
                            } as any,
                            field: {
                                fullWidth,
                                error,
                                formControlSx,
                                helperText,
                                placeholder,
                                onClick: () => {
                                    if (!restProps.disabled && !readOnly) {
                                        setOpen(true);
                                    }
                                },
                                bordered,
                                readOnly,
                                tooltip,
                                tooltipPlacement,
                                tooltipPosition,
                                tooltipSx,
                                description,
                                ...restProps.slotProps?.field,
                            } as any,
                            digitalClockSectionItem: {
                                sx: {
                                    minWidth: 'auto',
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    fontSize: 14,
                                },
                            },
                            day: {
                                sx: daySx,
                                ...restProps.slotProps?.day,
                            },
                        }}
                        closeOnSelect={false}
                    />
                </div>
            </ClickAwayListener>
        </LocalizationProvider>
    );
});
