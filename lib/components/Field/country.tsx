import { getAllCountries, getCountry } from 'countries-and-timezones';
import { type CountryCode } from 'libphonenumber-js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldSelect, type FieldSelectProps } from './select.tsx';

export interface FieldCountryProps extends Omit<FieldSelectProps, 'value' | 'onChange' | 'request'> {
    value?: string;
    onChange?: (value?: string) => void;
}

export const FieldCountry = (props: FieldCountryProps) => {
    const { value, onChange, ...restProps } = props;
    const { t } = useTranslation();

    const countryOptions = useMemo(() => {
        return Object.values(getAllCountries()).map((country) => {
            return {
                icon: (
                    <img
                        style={{ width: '20px' }}
                        alt={country.name}
                        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.id}.svg`}
                    />
                ),
                text: t(`country_${country.id}`),
                value: country.id,
            };
        });
    }, [t]);

    return (
        <FieldSelect
            searchable
            value={value}
            onChange={(val) => {
                onChange?.(val as string);
            }}
            queryKey={['FieldCountry-country']}
            request={async () => {
                return countryOptions;
            }}
            onReset={() => {
                onChange?.('');
            }}
            searchFn={({ option, search }) => {
                if (!search) {
                    return true;
                }
                const country = getCountry(option.value as CountryCode);
                const searchLower = search.toLowerCase();
                return !!(country && (country.name.toLowerCase().includes(searchLower) || country.id.toLowerCase().includes(searchLower)));
            }}
            {...restProps}
        />
    );
};
