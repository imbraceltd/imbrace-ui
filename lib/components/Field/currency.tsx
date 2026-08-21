import type { CSSProperties } from 'react';
import { forwardRef } from 'react';

import type { SelectProps } from '../Select';
import selectStyles from '../Select/index.module.scss';
import { FieldNumber, type FieldNumberProps } from './number';
import { FieldSelect } from './select';

type ValueType = {
    currency_code?: string;
    amounts?: number;
};
export interface FieldCurrencyProps extends Omit<FieldNumberProps, 'value' | 'onChange'> {
    defaultCurrency?: string;
    value?: ValueType;
    onChange?: (value?: ValueType, isValid?: boolean | 'invalid') => void;
    selectContainerStyle?: CSSProperties;
    selectProps?: Omit<SelectProps, 'value' | 'onChange'>;
}

const CurrencyOptions =
    Intl?.supportedValuesOf?.('currency')?.map((currency) => ({
        text: currency,
        value: currency,
    })) ?? [];

export const FieldCurrency = forwardRef<HTMLInputElement, FieldCurrencyProps>((props, ref) => {
    const { onChange, value, defaultCurrency = 'USD', sx, selectContainerStyle, readOnly, disabled, selectProps, ...restProps } = props;

    return (
        <FieldNumber
            ref={ref}
            readOnly={readOnly}
            disabled={disabled}
            prefix={
                <div
                    style={{
                        margin: '0 4px',
                        marginRight: 0,
                        ...selectContainerStyle,
                    }}
                >
                    <FieldSelect<string>
                        queryKey={['FieldCurrency-currencyCode']}
                        readOnly={readOnly}
                        disabled={disabled}
                        value={(value as ValueType)?.currency_code || defaultCurrency}
                        containerGap={0}
                        formControlSx={{
                            width: 'auto',
                            [`& .${selectStyles.selectContainer}`]: {
                                border: 'none',
                                padding: '4px',
                                '&:hover': {
                                    background: 'var(--color-secondary-2)',
                                },
                            },
                        }}
                        searchable
                        fullWidth
                        paperSx={{
                            minWidth: 240,
                        }}
                        closeOnSelect
                        popoverProps={{
                            disablePortal: false,
                        }}
                        onChange={(currencyCode) => {
                            const amounts =
                                value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
                                    ? value.amounts
                                    : undefined;

                            if (currencyCode) {
                                onChange?.(
                                    {
                                        currency_code: currencyCode,
                                        amounts,
                                    },
                                    true,
                                );
                            } else {
                                onChange?.(
                                    {
                                        currency_code: currencyCode || defaultCurrency,
                                        amounts,
                                    },
                                    'invalid',
                                );
                            }
                        }}
                        {...(selectProps as SelectProps<string>)}
                        request={
                            selectProps?.request ||
                            (async () => {
                                return CurrencyOptions;
                            })
                        }
                    />
                </div>
            }
            value={(value as ValueType)?.amounts || undefined}
            {...restProps}
            onChange={(e, isValid) => {
                const currencyCode =
                    value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
                        ? value.currency_code || defaultCurrency || ''
                        : defaultCurrency || '';

                if (!isValid) {
                    onChange?.({ amounts: undefined, currency_code: currencyCode }, false);
                    return;
                }
                const newValue = {
                    currency_code: currencyCode,
                    amounts: +e.target.value,
                };

                onChange?.(newValue, isValid);
            }}
        />
    );
});
