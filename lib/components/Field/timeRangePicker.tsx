import type { TooltipProps } from '@mui/material';
import { FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isAfter, isBefore } from 'date-fns';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import { forwardRef, useMemo } from 'react';

import type { FieldBaseProps } from '.';
import { FormHelperText } from '.';
import styles from './index.module.scss';
import type { FieldTimePickerProps } from './timePicker';
import { FieldTimePicker } from './timePicker';
type TimeRangeValue = [Date | string | number | null, Date | string | number | null];

export interface FieldTimeRangePickerProps
    extends Omit<
        FieldBaseProps,
        'placeholder' | 'onChange' | 'readOnly' | 'tooltip' | 'tooltipPlacement' | 'tooltipSx' | 'tooltipPosition'
    > {
    label?: [string | ReactNode, string | ReactNode];
    description?: [string | ReactNode, string | ReactNode];
    value?: TimeRangeValue;
    onChange: (dates?: TimeRangeValue) => void;
    disabled?: [boolean, boolean];
    readOnly?: [boolean, boolean];
    tooltip?: [string | ReactNode, string | ReactNode];
    tooltipSx?: [Record<string, string>, Record<string, string>];
    tooltipPosition?: ['label' | 'input', 'label' | 'input'];
    tooltipPlacement?: [TooltipProps['placement'], TooltipProps['placement']];

    timePickerProps?: {
        start?: Omit<FieldTimePickerProps, 'value' | 'onChange'>;
        end?: Omit<FieldTimePickerProps, 'value' | 'onChange'>;
    };
}
//eslint-disable-next-line
export const FieldTimeRangePicker = forwardRef<HTMLInputElement, FieldTimeRangePickerProps>((props, ref) => {
    const {
        label,
        fullWidth,
        helperText,
        error,
        onChange,
        disabled,
        value,
        timePickerProps,
        readOnly,
        tooltip,
        tooltipPlacement,
        tooltipPosition,
        tooltipSx,
        description,
    } = props;

    const controlledValue = useMemo(() => {
        try {
            if (value && value.length === 2) {
                return value.map((valueDate) => {
                    if (typeof valueDate === 'string') {
                        if (/^\d{2}:\d{2}$/.test(valueDate)) {
                            const hours = +valueDate.split(':')[0];
                            const minutes = +valueDate.split(':')[1];
                            if (!isNaN(hours) && !isNaN(minutes)) {
                                const date = new Date();
                                date.setHours(hours, minutes);
                                return dayjs(date);
                            }
                        }
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
                        <FieldTimePicker
                            {...timePickerProps?.start}
                            label={label?.[0]}
                            description={description?.[0]}
                            fullWidth={fullWidth}
                            disabled={disabled?.[0]}
                            error={error}
                            value={controlledValue[0]}
                            onChange={(date) => {
                                if (date === null && controlledValue[1] === null) {
                                    onChange(undefined);
                                } else {
                                    if ((date && controlledValue[1] && isAfter(date, controlledValue[1].toDate())) || !controlledValue[1]) {
                                        onChange([date, null]);
                                    } else {
                                        onChange([date, controlledValue[1].toDate()]);
                                    }
                                }
                            }}
                            readOnly={readOnly?.[0]}
                            tooltip={tooltip?.[0]}
                            tooltipPlacement={tooltipPlacement?.[0]}
                            tooltipPosition={tooltipPosition?.[0]}
                            tooltipSx={tooltipSx?.[0]}
                            closeOnSelect={false}
                        />
                    </div>
                    <div
                        className={`${styles.dash} ${!label || label.every((labelVal) => !labelVal) ? styles.noLabel : ''} ${!description || description.every((descriptionVal) => !descriptionVal) ? styles.noDescription : ''}`}
                    >
                        －
                    </div>
                    <div>
                        <FieldTimePicker
                            {...timePickerProps?.end}
                            label={label?.[1]}
                            description={description?.[1]}
                            fullWidth={fullWidth}
                            disabled={disabled?.[1]}
                            error={error}
                            value={controlledValue[1]}
                            onChange={(date) => {
                                if (date === null && controlledValue[0] === null) {
                                    onChange(undefined);
                                } else {
                                    if (
                                        (date && controlledValue[0] && isBefore(date, controlledValue[0].toDate())) ||
                                        !controlledValue[0]
                                    ) {
                                        onChange([null, date]);
                                    } else {
                                        onChange([controlledValue[0].toDate(), date]);
                                    }
                                }
                            }}
                            readOnly={readOnly?.[1]}
                            tooltip={tooltip?.[1]}
                            tooltipPlacement={tooltipPlacement?.[1]}
                            tooltipPosition={tooltipPosition?.[1]}
                            tooltipSx={tooltipSx?.[1]}
                            closeOnSelect={false}
                        />
                    </div>
                </div>
                {error && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        </LocalizationProvider>
    );
});
