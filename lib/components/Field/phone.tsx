import { getAllCountries, getCountry } from 'countries-and-timezones';
import type { CountryCode } from 'libphonenumber-js';
import { getCountryCallingCode, isSupportedCountry, parsePhoneNumber } from 'libphonenumber-js';
import type { CSSProperties } from 'react';
import { forwardRef } from 'react';

import { validatePhoneNumber } from '../../utils';
import { EllipsisText } from '../EllipsisText';
import type { SelectProps } from '../Select';
import selectStyles from '../Select/index.module.scss';
import { Space } from '../Space';
import { Typography } from '../Typography';
import { FieldSelect } from './select';
import type { FieldTextProps } from './text';
import { FieldText } from './text';

type ValueType = {
    country_code: CountryCode;
    phone: string;
    country_calling_code?: string;
    calling_code_with_number?: string;
    national_number?: string;
};
export interface FieldPhoneProps extends Omit<FieldTextProps, 'value' | 'onChange'> {
    defaultCountryCode?: CountryCode;
    value?: ValueType;
    onChange?: (value?: ValueType, isValid?: boolean | 'invalid') => void;
    selectContainerStyle?: CSSProperties;
    selectProps?: Omit<SelectProps, 'value' | 'onChange'>;
}

const CountryCodeOptions = Object.keys(getAllCountries())
    .filter((country) => {
        return isSupportedCountry(country);
    })
    .sort((a, b) => {
        const aCountry = getCountry(a);
        const bCountry = getCountry(b);
        if (aCountry && bCountry) {
            return aCountry.name.localeCompare(bCountry.name);
        }
        return 0;
    })
    .map((country) => ({
        icon: (
            <img
                style={{ width: '20px' }}
                alt={getCountry(country)?.name}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
            />
        ),
        text: (
            <Space size={4} style={{ overflow: 'hidden', width: '100%' }}>
                <EllipsisText text={getCountry(country)?.name} />
                <div>{`+${getCountryCallingCode(country as CountryCode)}`}</div>
            </Space>
        ),
        value: country,
    }));

export const FieldPhone = forwardRef<HTMLInputElement, FieldPhoneProps>((props, ref) => {
    const { onChange, value, defaultCountryCode, sx, selectContainerStyle, readOnly, disabled, selectProps, ...restProps } = props;
    return (
        <FieldText
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
                    <FieldSelect
                        queryKey={['FieldPhone-countryCode']}
                        readOnly={readOnly}
                        disabled={disabled}
                        value={
                            value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
                                ? value.country_code || defaultCountryCode
                                : defaultCountryCode
                        }
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
                        renderValue={(selectedValue) => {
                            try {
                                if (selectedValue) {
                                    return (
                                        <Typography style={{ lineHeight: '24px' }}>
                                            {getCountryCallingCode(selectedValue as unknown as CountryCode)}
                                        </Typography>
                                    );
                                }
                                return '';
                            } catch (error) {
                                return '';
                            }
                        }}
                        searchFn={({ option, search }) => {
                            if (!search) {
                                return true;
                            }
                            if (getCountryCallingCode(option.value as CountryCode).indexOf(search) !== -1) {
                                return true;
                            }
                            const country = getCountry(option.value as CountryCode);
                            if (country && country.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                                return true;
                            }

                            return `${option.value}`.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                        }}
                        onChange={(countryCode) => {
                            const phone =
                                value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
                                    ? value.phone || ''
                                    : (value as unknown as string) || '';
                            const newValue: {
                                country_code: CountryCode;
                                phone: string;
                                country_calling_code?: string;
                                calling_code_with_number?: string;
                                national_number?: string;
                            } = {
                                country_code: countryCode as unknown as CountryCode,
                                phone,
                            };
                            if (!phone) {
                                onChange?.({ phone: '', country_code: countryCode as unknown as CountryCode });
                                return;
                            }
                            try {
                                const isValid = validatePhoneNumber({
                                    phoneNumber: newValue.phone,
                                    defaultCountryCode: newValue.country_code as CountryCode,
                                });
                                if (!isValid) {
                                    onChange?.(newValue, typeof isValid === 'string' ? 'invalid' : true);
                                    return;
                                }

                                const phoneNumber = parsePhoneNumber(newValue.phone, newValue.country_code as CountryCode);
                                newValue.country_calling_code = phoneNumber.countryCallingCode;
                                newValue.calling_code_with_number = phoneNumber.number;
                                newValue.national_number = phoneNumber.nationalNumber;
                                onChange?.(newValue);
                            } catch (error) {
                                // console.log(error);
                                onChange?.(newValue, 'invalid');
                            }
                        }}
                        {...(selectProps as SelectProps)}
                        request={
                            selectProps?.request ||
                            (async () => {
                                return CountryCodeOptions;
                            })
                        }
                    />
                </div>
            }
            value={value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) ? value.phone : value}
            {...restProps}
            onChange={(e) => {
                const countryCode =
                    value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
                        ? value.country_code || defaultCountryCode || ''
                        : defaultCountryCode || '';
                const newValue: {
                    country_code: CountryCode;
                    phone: string;
                    country_calling_code?: string;
                    calling_code_with_number?: string;
                    national_number?: string;
                } = {
                    country_code: countryCode as unknown as CountryCode,
                    phone: e.target.value,
                };

                if (!e.target.value) {
                    onChange?.({ phone: '', country_code: countryCode as unknown as CountryCode });
                    return;
                }
                try {
                    const isValid = validatePhoneNumber({
                        phoneNumber: newValue.phone,
                        defaultCountryCode: newValue.country_code as CountryCode,
                    });
                    if (!isValid) {
                        onChange?.(newValue, typeof isValid === 'string' ? 'invalid' : true);
                        return;
                    }

                    const phoneNumber = parsePhoneNumber(newValue.phone, newValue.country_code as CountryCode);
                    newValue.country_calling_code = phoneNumber.countryCallingCode;
                    newValue.calling_code_with_number = phoneNumber.number;
                    newValue.national_number = phoneNumber.nationalNumber;
                    onChange?.(newValue);
                } catch (error) {
                    // console.log(error);
                    onChange?.(newValue, 'invalid');
                }
            }}
        />
    );
});
