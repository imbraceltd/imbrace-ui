import type { TooltipProps } from '@mui/material';
import { FormControl, styled } from '@mui/material';
import type { PickersDayProps } from '@mui/x-date-pickers';
import { LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getYear, isAfter, isBefore, isSameDay, isWithinInterval, set } from 'date-fns';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import { forwardRef, useMemo, useState } from 'react';

import { validateDate } from '../../utils';
import type { FieldBaseProps } from '.';
import { FormHelperText } from '.';
import type { FieldDatePickerProps } from './datePicker';
import { FieldDatePicker } from './datePicker';
import styles from './index.module.scss';

type DateRangeValue = [Date | null, Date | null];

export interface FieldDateRangePickerProps
    extends Omit<
        FieldBaseProps,
        'placeholder' | 'onChange' | 'readOnly' | 'tooltip' | 'tooltipPlacement' | 'tooltipSx' | 'tooltipPosition'
    > {
    label?: [string | ReactNode, string | ReactNode];
    description?: [string | ReactNode, string | ReactNode];
    value?: DateRangeValue;
    onChange: (dates?: DateRangeValue) => void;
    disabled?: [boolean, boolean];
    maxDate?: Date;
    datePickerProps?: {
        start?: Omit<FieldDatePickerProps, 'value' | 'onChange'>;
        end?: Omit<FieldDatePickerProps, 'value' | 'onChange'>;
    };
    readOnly?: [boolean, boolean];
    tooltip?: [string | ReactNode, string | ReactNode];
    tooltipSx?: [Record<string, string>, Record<string, string>];
    tooltipPosition?: ['label' | 'input', 'label' | 'input'];
    tooltipPlacement?: [TooltipProps['placement'], TooltipProps['placement']];
}

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
    dayIsBetween?: boolean;
    isFirstDay?: boolean;
    isLastDay?: boolean;
    isSingle?: boolean;
}

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay' && prop !== 'isSingle',
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay, isSingle }) => ({
    color: 'var(--color-light-7)',
    borderRadius: '8px',
    fontWeight: 400,
    fontSize: '14px',
    transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover, &:focus': {
        color: 'var(--color-light-7)',
        background: 'var(--color-primary-3)',
    },
    ':not(.Mui-selected)': {
        border: 'none',
    },
    '&.Mui-selected': {
        fontWeight: 400,
        background: 'var(--color-primary-1)',
        color: 'var(--color-light-1)',
        '&:hover': {
            color: 'var(--color-light-7)',
            background: 'var(--color-primary-3)',
        },
        '&:focus': {
            background: 'var(--color-primary-1)',
            color: 'var(--color-light-1)',
        },
    },
    '&.Mui-disabled': {
        color: 'var(--color-secondary-4) ',
    },
    '&.MuiPickersDay-today': {
        border: '1px solid var(--color-primary-1)',
        '&:focus': {
            backgroundColor: 'transparent',
            color: 'var(--color-light-7)',
        },
        '&:hover': {
            color: 'var(--color-light-7)',
            background: 'var(--color-primary-3)',
        },
    },
    ...(dayIsBetween && {
        borderRadius: 0,
        backgroundColor: 'var(--color-primary-1)',
        color: 'var(--color-light-1)',
        '&:hover, &:focus': {
            color: 'var(--color-light-7)',
            background: 'var(--color-primary-3)',
        },
        '&.MuiPickersDay-today': {
            fontWeight: 400,

            '&:focus': {
                background: theme.palette.primary.main,
                color: 'var(--color-light-1)',
            },
            '&:hover': {
                color: 'var(--color-light-7)',
                background: 'var(--color-primary-3)',
            },
        },
    }),
    ...((isFirstDay || isLastDay) && {
        margin: 0,
        background: 'var(--color-primary-1)',
        color: 'var(--color-light-1)',
        '&:hover': {
            color: 'var(--color-light-7)',
            background: 'var(--color-primary-3)',
        },
    }),
    ...(isFirstDay &&
        !isSingle && {
            borderRadius: 0,
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
        }),
    ...(isLastDay &&
        !isSingle && {
            borderRadius: 0,
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
        }),
})) as React.ComponentType<CustomPickerDayProps>;

const convertToDate = (date: Date | Dayjs | null | undefined) => {
    if (date) {
        if (dayjs.isDayjs(date)) {
            return date.toDate();
        }
        return date;
    }
    return date;
};

const Day = (props: PickersDayProps<Dayjs> & { selectedDates?: [Date | Dayjs | null, Date | Dayjs | null] }) => {
    const { day, selectedDates, ...other } = props;
    const start = validateDate(convertToDate(selectedDates?.[0]));
    const end = validateDate(convertToDate(selectedDates?.[1]));

    if (!selectedDates || (start === null && end === null) || (start && end && isSameDay(start, end))) {
        return <CustomPickersDay day={day} {...other} />;
    }

    const dayIsBetween = start && end ? isWithinInterval(day.toDate(), { start, end }) : false;
    const isFirstDay = start ? isSameDay(day.toDate(), start) : false;
    const isLastDay = end ? isSameDay(day.toDate(), end) : false;

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
            dayIsBetween={dayIsBetween}
            isFirstDay={isFirstDay}
            isLastDay={isLastDay}
            isSingle={selectedDates.some((date) => !(date instanceof Date && !isNaN(date.getTime())))}
        />
    );
};
//eslint-disable-next-line
export const FieldDateRangePicker = forwardRef<HTMLInputElement, FieldDateRangePickerProps>((props, ref) => {
    const {
        label,
        fullWidth,
        helperText,
        error,
        onChange,
        disabled,
        value,
        maxDate,
        datePickerProps,
        readOnly,
        tooltip,
        tooltipPosition,
        tooltipSx,
        tooltipPlacement,
        description,
    } = props;
    const [firstOpen, setFirstOpen] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);

    const controlledValue = useMemo(() => {
        try {
            if (value && value.length === 2) {
                return value.map((valueDate) => {
                    if (typeof valueDate === 'string') {
                        if (dayjs(valueDate).isValid()) {
                            return dayjs(valueDate);
                        }
                        return null;
                    }
                    if (dayjs.isDayjs(valueDate)) {
                        return valueDate;
                    }
                    if (valueDate instanceof Date) {
                        return dayjs(new Date(valueDate));
                    }
                    return null;
                });
            }
            return [null, null];
        } catch (err) {
            return [null, null];
        }
    }, [value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl variant="standard" className={`${styles.container}${fullWidth ? ` ${styles.fullWidth}` : ''}`} error={!!error}>
                <div className={`${styles.dateRangePicker}${fullWidth ? ` ${styles.fullWidth}` : ''}`}>
                    <div>
                        <FieldDatePicker
                            {...datePickerProps?.start}
                            open={firstOpen}
                            label={label?.[0]}
                            description={description?.[0]}
                            fullWidth={fullWidth}
                            disabled={disabled?.[0]}
                            error={error}
                            value={controlledValue[0]}
                            readOnly={readOnly?.[0]}
                            tooltip={tooltip?.[0]}
                            tooltipPosition={tooltipPosition?.[0]}
                            tooltipPlacement={tooltipPlacement?.[0]}
                            tooltipSx={tooltipSx?.[0]}
                            shouldDisableYear={(year) => {
                                if (maxDate) {
                                    return getYear(year.toDate()) > getYear(maxDate);
                                }
                                return false;
                            }}
                            shouldDisableDate={(date) => {
                                if (maxDate) {
                                    return isAfter(date.toDate(), maxDate);
                                }
                                return false;
                            }}
                            onOpen={() => {
                                setFirstOpen(true);
                            }}
                            onClose={() => {
                                setFirstOpen(false);
                            }}
                            onChange={(date) => {
                                if (date === null && controlledValue[1] === null) {
                                    onChange(undefined);
                                } else {
                                    if (
                                        (date &&
                                            controlledValue[1] &&
                                            isAfter(date, controlledValue[1].toDate()) &&
                                            !isSameDay(date, controlledValue[1].toDate())) ||
                                        !controlledValue[1]
                                    ) {
                                        onChange([date, null]);
                                    } else {
                                        console.log('shit');
                                        onChange([date, controlledValue[1].toDate()]);
                                    }
                                }
                            }}
                            slots={{
                                day: Day,
                            }}
                            slotProps={{
                                day: {
                                    selectedDates: value,
                                } as any,
                                openPickerButton: {
                                    disabled: true,
                                },
                            }}
                            closeOnSelect={false}
                        />
                    </div>
                    <div
                        className={`${styles.dash} ${!label || label.every((labelVal) => !labelVal) ? styles.noLabel : ''} ${!description || description.every((descriptionVal) => !descriptionVal) ? styles.noDescription : ''}`}
                    >
                        －
                    </div>
                    <div>
                        <FieldDatePicker
                            {...datePickerProps?.end}
                            open={secondOpen}
                            label={label?.[1]}
                            description={description?.[1]}
                            fullWidth={fullWidth}
                            disabled={disabled?.[1]}
                            error={error}
                            value={controlledValue[1]}
                            readOnly={readOnly?.[1]}
                            tooltip={tooltip?.[1]}
                            tooltipPosition={tooltipPosition?.[1]}
                            tooltipPlacement={tooltipPlacement?.[1]}
                            tooltipSx={tooltipSx?.[1]}
                            shouldDisableYear={(year) => {
                                if (controlledValue[0]) {
                                    if (maxDate) {
                                        return (
                                            getYear(year.toDate()) < getYear(controlledValue[0].toDate()) ||
                                            getYear(year.toDate()) > getYear(maxDate)
                                        );
                                    }
                                    return getYear(year.toDate()) < getYear(controlledValue[0].toDate());
                                } else if (maxDate) {
                                    return getYear(year.toDate()) > getYear(maxDate);
                                }
                                return false;
                            }}
                            shouldDisableDate={(date) => {
                                if (controlledValue[0]) {
                                    const normalizedFirstDate = set(controlledValue[0].toDate(), {
                                        seconds: 0,
                                        minutes: 0,
                                        hours: 0,
                                    });
                                    if (maxDate) {
                                        return (
                                            (isBefore(date.toDate(), normalizedFirstDate) &&
                                                !isSameDay(date.toDate(), normalizedFirstDate)) ||
                                            isAfter(date.toDate(), maxDate)
                                        );
                                    }
                                    return isBefore(date.toDate(), normalizedFirstDate) && !isSameDay(date.toDate(), normalizedFirstDate);
                                } else if (maxDate) {
                                    return isAfter(date.toDate(), maxDate);
                                }

                                return false;
                            }}
                            onOpen={() => {
                                setSecondOpen(true);
                            }}
                            onClose={() => {
                                setSecondOpen(false);
                            }}
                            onChange={(date) => {
                                if (date === null && controlledValue[0] === null) {
                                    onChange(undefined);
                                } else {
                                    if (
                                        (date &&
                                            controlledValue[0]?.toDate() &&
                                            isBefore(date, controlledValue[0]?.toDate()) &&
                                            !isSameDay(date, controlledValue[0]?.toDate())) ||
                                        !controlledValue[0]
                                    ) {
                                        onChange([null, date]);
                                    } else {
                                        onChange([controlledValue[0]?.toDate(), date]);
                                    }
                                }
                            }}
                            slots={{
                                day: Day,
                            }}
                            slotProps={{
                                day: {
                                    selectedDates: value,
                                } as any,
                                openPickerButton: {
                                    disabled: true,
                                },
                            }}
                            closeOnSelect={false}
                        />
                    </div>
                </div>
                {error && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        </LocalizationProvider>
    );
});
