import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useArgs } from '@storybook/client-api';
import type { Meta, StoryFn } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Button } from '../Button';
import selectStyles from '../Select/index.module.scss';

import { FieldRadio, FieldRadios } from './radios';
import { FieldSelect, FieldSelectProps } from './select';
import { FieldUpload } from './upload';
import { FieldText } from './text';
import { FieldNumber } from './number';
import { FieldSwitch } from './switch';
import { FieldRangeNumber } from './rangeNumber';
import { Space } from '../Space';
import { Icon } from '../Icon';
import { FieldPhone } from './phone';
import { Typography } from '../Typography';
import { FieldDatePicker } from './datePicker';
import { FieldTimePicker } from './timePicker';
import { FieldDateRangePicker } from './dateRangePicker';
import { FieldTimeRangePicker } from './timeRangePicker';
import { FieldTimeSlotsPicker } from './timeSlotsPicker';
import { FieldDatetimePicker } from './datetimePicker';
import { FieldCountry } from './country';
import i18next from 'i18next';
import { FieldDateTimeRangePicker } from './datetimeRangePicker';
import { FieldTextEditor } from './textEditor';
import { fn } from '@storybook/test';
import { FieldCheckbox } from './checkBox';
import { FieldCurrency } from './currency';

export default {
    title: 'Imbrace/Field',
    component: FieldText,
    subcomponents: {
        FieldText,
        FieldSelect,
        FieldSwitch,
        FieldRangeNumber,
    },
    argTypes: {
        label: {
            type: 'string',
            control: 'text',
        },
        placeholder: {
            type: 'string',
            control: 'text',
        },
        value: {
            type: 'string',
        },
        description: {
            type: 'string',
            control: 'text',
        },
        helperText: {
            type: 'string',
            control: 'text',
        },
        tooltip: {
            type: 'string',
            control: 'text',
        },
        tooltipPlacement: {
            type: 'string',
            control: 'select',
            options: [
                'top',
                'right',
                'bottom',
                'left',
                'bottom-end',
                'bottom-start',
                'left-end',
                'left-start',
                'right-end',
                'right-start',
                'top-end',
                'top-start',
            ],
            defaultValue: 'top',
            table: {
                defaultValue: {
                    summary: 'top',
                },
            },
        },
        tooltipPosition: {
            type: 'string',
            control: {
                type: 'radio',
                defaultValue: 'label',
            },
            options: ['label', 'input'],
            defaultValue: 'label',
            table: {
                defaultValue: {
                    summary: 'label',
                },
            },
        },
        error: {
            type: 'boolean',
            defaultValue: false,
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        fullWidth: {
            type: 'boolean',
            defaultValue: false,
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        readOnly: {
            type: 'boolean',
            defaultValue: false,
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        onReset: {
            table: {
                category: 'Events',
            },
            control: false,
            defaultValue: undefined,
        },
        onChange: {
            table: {
                category: 'Events',
            },
            control: false,
        },
    },
    args: {
        placeholder: 'Placeholder',
        tooltipPosition: 'label',
        tooltipPlacement: 'top',
        error: false,
        readOnly: false,
        disabled: false,
        fullWidth: false,
        onChange: fn(),
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=1398%3A47307&t=Vc0crWfsWncBtL1k-1',
        },
        docs: { source: { type: 'dynamic' } },
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Story />
                </LocalizationProvider>
            </QueryClientProvider>
        ),
    ],
} as Meta<typeof FieldText>;

const Template: StoryFn<typeof FieldText> = (args) => <FieldText {...args} />;

export const Default = Template.bind({});
Default.args = {
    onReset: undefined,
};

export const FullWidth = Template.bind({});
FullWidth.args = { fullWidth: true };

const ErrorComponent: StoryFn<typeof FieldText> = (args) => {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <FieldText error label="Label" helperText={'Helper Text'} {...args} />
            <FieldText error {...args} />
        </div>
    );
};
export const Error = ErrorComponent.bind({
    placeholder: 'Placeholder',
    onReset: undefined,
});

const PrefixAndSuffixComponent: StoryFn<typeof FieldText> = (args) => {
    return (
        <Space direction="vertical" align="start">
            <FieldText
                prefix={
                    <div
                        style={{
                            margin: '0 4px',
                            marginRight: 0,
                        }}
                    >
                        <FieldSelect
                            disabled={args.disabled}
                            request={async () => {
                                return [{ text: 'hi', value: 'hi' }];
                            }}
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
                            fullWidth
                            paperSx={{
                                minWidth: 240,
                            }}
                        />
                    </div>
                }
                label="Label"
                helperText={'Helper Text'}
                {...args}
                onReset={undefined}
            />
        </Space>
    );
};
export const PrefixAndSuffix = PrefixAndSuffixComponent.bind({
    placeholder: 'Placeholder',
    onReset: undefined,
});

const SwitchTemplate: StoryFn<typeof FieldSwitch> = (args) => {
    const [, updateArgs] = useArgs();
    return (
        <Space size={15}>
            <FieldSwitch
                {...args}
                onChange={async (e) => {
                    args.onChange?.(e);
                    updateArgs({ value: e });
                }}
            />
            <FieldSwitch
                switchLabel={() => 'Active'}
                {...args}
                onChange={async (e) => {
                    args.onChange?.(e);
                    updateArgs({ value: e });
                }}
            />
        </Space>
    );
};

export const Switch = SwitchTemplate.bind({});
Switch.argTypes = {
    value: {
        control: 'boolean',
    },
};
Switch.args = {};

const NumberTemplate: StoryFn<typeof FieldNumber> = (args) => {
    return <FieldNumber autoFocus={false} {...args} />;
};

export const Number = NumberTemplate.bind({});
Number.args = { onReset: undefined };

const RangeNumberTemplate: StoryFn<typeof FieldRangeNumber> = (args) => {
    return (
        <FieldRangeNumber
            fieldNumberProps={{
                start: {
                    autoFocus: false,
                },
                end: {
                    autoFocus: false,
                },
            }}
            {...args}
        />
    );
};
export const RangeNumber = RangeNumberTemplate.bind({});
RangeNumber.args = { placeholder: ['Min', 'Max'], value: [0, 0] };
RangeNumber.argTypes = {
    placeholder: {
        control: 'object',
    },
    value: {
        control: 'object',
    },
};

const SelectTemplate: StoryFn<FieldSelectProps> = (args) => {
    const [, updateArgs] = useArgs();
    return (
        <FieldSelect
            {...args}
            onChange={(e) => {
                args?.onChange?.(e);
                updateArgs({ value: e });
            }}
            request={async () => {
                return [
                    { text: 'Ten', value: 10 },
                    { text: 'Hi', value: 'hi' },
                    {
                        text: (
                            <Space justify="between" style={{ width: '100%' }}>
                                <Typography>Test</Typography>
                                <Icon name="info" />
                            </Space>
                        ),
                        value: 'ttt',
                    },
                    { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
                    { text: 'With icon LongLongLongLongLongLong', value: 'withicon', icon: <Icon name="bookmark" /> },
                ];
            }}
        />
    );
};
export const Select = SelectTemplate.bind({});
Select.args = {
    placeholder: 'Click to select',
};

const DatePickerTemplate: StoryFn<typeof FieldDatePicker> = (args) => <FieldDatePicker {...args} />;
export const DatePicker = DatePickerTemplate.bind({});
DatePicker.args = {};

const DateRangePickerTemplate: StoryFn<typeof FieldDateRangePicker> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <FieldDateRangePicker
            {...args}
            value={value}
            onChange={(dates) => {
                updateArgs({
                    value: dates,
                });
                args.onChange?.(dates);
            }}
        />
    );
};
export const DateRangePicker = DateRangePickerTemplate.bind({});
DateRangePicker.argTypes = {
    label: {
        control: 'object',
    },
    tooltipPlacement: {
        control: 'object',
    },
    description: {
        control: 'object',
    },
};
DateRangePicker.args = { label: ['start', 'end'], description: ['start', 'end'] };

const TimePickerTemplate: StoryFn<typeof FieldTimePicker> = (args) => <FieldTimePicker autoFocus={false} {...args} />;
export const TimePicker = TimePickerTemplate.bind({});
TimePicker.args = {};

const DatetimePickerTemplate: StoryFn<typeof FieldDatetimePicker> = (args) => <FieldDatetimePicker {...args} />;
export const DatetimePicker = DatetimePickerTemplate.bind({});
DatetimePicker.args = {};

const DatetimeRangePickerTemplate: StoryFn<typeof FieldDateTimeRangePicker> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <FieldDateTimeRangePicker
            {...args}
            value={value}
            onChange={(dates) => {
                updateArgs({
                    value: dates,
                });
                args.onChange?.(dates);
            }}
        />
    );
};
export const DatetimeRangePicker = DatetimeRangePickerTemplate.bind({});
DatetimeRangePicker.argTypes = {
    label: {
        control: 'object',
    },
    tooltipPlacement: {
        control: 'object',
    },
    description: {
        control: 'object',
    },
};
DatetimeRangePicker.args = { label: ['start', 'end'], tooltipPlacement: ['top', 'top'], description: ['start', 'end'] };

const TimeRangePickerTemplate: StoryFn<typeof FieldTimeRangePicker> = (args) => (
    <FieldTimeRangePicker
        timePickerProps={{
            start: {
                autoFocus: false,
            },
            end: {
                autoFocus: false,
            },
        }}
        {...args}
    />
);
export const TimeRangePicker = TimeRangePickerTemplate.bind({});
TimeRangePicker.args = {
    label: ['', ''],
    value: ['', ''],
    disabled: [false, false],
    readOnly: [false, false],
};
TimeRangePicker.argTypes = {
    label: {
        control: 'object',
    },
    value: {
        control: 'object',
    },
    disabled: {
        control: 'object',
        table: {
            defaultValue: {
                summary: '[false, false]',
            },
        },
    },
    readOnly: {
        control: 'object',
        table: {
            defaultValue: {
                summary: '[false, false]',
            },
        },
    },
    tooltipPlacement: {
        control: 'object',
        table: {
            defaultValue: {
                summary: "['top', 'top']",
            },
        },
    },
    tooltipPosition: {
        control: 'object',
        description: 'array of string',
        table: {
            defaultValue: {
                summary: "['label', 'label']",
            },
        },
    },
    tooltip: {
        control: 'object',
    },
    tooltipSx: {
        control: 'object',
    },
};

const TimeSlotsPickerTemplate: StoryFn<typeof FieldTimeSlotsPicker> = (args) => <FieldTimeSlotsPicker {...args} />;
export const TimeSlotsPicker = TimeSlotsPickerTemplate.bind({});
TimeSlotsPicker.args = {
    options: [
        ['00:00', '01:00', '02:00'],
        ['00:30', '01:30', '02:30'],
    ],
};

const onUpload = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const { data } = await axios.post<{
        data: {
            id: string;
            name: string;
            size: number;
            short_path?: string;
        };
    }>('http://localhost:9001/v2/marketplaces/files', uploadFormData, {
        headers: {
            'X-Access-Token': window.localStorage.getItem('imbrace-access-token'),
        },
    });
    return {
        url: `http://localhost:8080/api/files/v2/marketplaces/download/${data.data.short_path}`,
        id: data.data.id,
        name: data.data.name,
        size: data.data.size,
    };
};
const onDelete = async (fileId: string) => {
    const { data } = await axios.delete<{ message: string }>(`http://localhost:9001/v2/marketplaces/files/${fileId}`, {
        headers: {
            'X-Access-Token': window.localStorage.getItem('imbrace-access-token'),
        },
    });
    return data.message;
};

const fileValidation = async (file: File) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return 'Only accept jpg or png file';
    }
    return true;
};

// const TextEditorTemplate: StoryFn<typeof FieldTextEditor> = (args) => {
//     const [{ value }, updateArgs] = useArgs();
//     return (
//         <FieldTextEditor
//             {...args}
//             fileValidation={fileValidation}
//             onUpload={onUpload}
//             onDelete={onDelete}
//             onImageUpload={onUpload}
//             onImageDelete={onDelete}
//             value={value}
//             onChange={(e) => {
//                 args.onChange?.(e);
//                 updateArgs({ value: e });
//             }}
//         />
//     );
// };
// export const TextEditor = TextEditorTemplate.bind({});
// TextEditor.argTypes = {
//     value: {
//         control: 'object',
//     },
// };
// TextEditor.args = {
//     boardId: 'brd_eebbc2af-14b3-4c3a-99fb-8e6f9ccbc15c',
// };
const UploadTemplate: StoryFn<typeof FieldUpload> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <FieldUpload
            {...args}
            fileValidation={fileValidation}
            onUpload={onUpload}
            onDelete={onDelete}
            value={value}
            onChange={(e) => {
                args.onChange?.(e);
                updateArgs({ value: e });
            }}
        />
    );
};
export const Upload = UploadTemplate.bind({});
Upload.argTypes = {
    value: {
        control: 'object',
    },
    type: {
        control: 'radio',
        options: ['list', 'avatar', 'input'],
        defaultValue: 'list',
        type: 'string',
    },
    accept: {
        type: 'string',
    },
};

Upload.args = {
    value: [],
    description: (
        <Typography style={{ color: 'var(--color-light-5)' }}>
            {i18next.t('web_widget_window_logo_upload_subtitle')}
            <br />
            {i18next.t('web_widget_file_upload_tips')}
            <br />
            {i18next.t('web_widget_file_upload_tips2')}
        </Typography>
    ),
};

const RadiosTemplate: StoryFn<typeof FieldRadios> = (args) => (
    <FieldRadios {...args}>
        <FieldRadio value="female" label="Female" />
        <FieldRadio value="male" label="Male" />
        <FieldRadio value="x" label="X" disabled />
    </FieldRadios>
);
export const Radios = RadiosTemplate.bind({});
Radios.args = {};

const CheckBoxTemplate: StoryFn<typeof FieldCheckbox> = (args) => (
    <FieldCheckbox {...args}>
        <Typography>hihi</Typography>
    </FieldCheckbox>
);
export const Checkbox = CheckBoxTemplate.bind({});
Checkbox.argTypes = {
    labelPlacement: {
        options: ['top', 'start', 'end', 'bottom'],
        type: 'string',
        control: 'select',
        table: {
            defaultValue: {
                summary: 'end',
            },
        },
    },
    checkboxLabel: {
        type: 'string',
    },
    indeterminate: {
        type: 'boolean',
    },
};
Checkbox.args = {
    checkboxLabel: () => 'CheckBox Label',
    labelPlacement: 'end',
};

const PhoneTemplate: StoryFn<typeof FieldPhone> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space direction="vertical" align="start">
            <FieldPhone
                {...args}
                value={value}
                defaultCountryCode="TW"
                onChange={(data, isValid) => {
                    updateArgs({ value: data });
                    args.onChange?.(data, isValid);
                }}
            />
            <Typography>
                check <mark>Actions</mark> to see the onChange event
            </Typography>
        </Space>
    );
};

export const Phone = PhoneTemplate.bind({});
Phone.args = {
    value: {
        country_code: 'TW',
        phone: '',
    },
};
Phone.argTypes = {
    value: {
        control: 'object',
    },
};

const CurrencyTemplate: StoryFn<typeof FieldCurrency> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space direction="vertical" align="start">
            <FieldCurrency
                {...args}
                value={value}
                // defaultCurrency="HKD"
                onChange={(data, isValid) => {
                    updateArgs({ value: data });
                    args.onChange?.(data, isValid);
                }}
            />
            <Typography>
                check <mark>Actions</mark> to see the onChange event
            </Typography>
        </Space>
    );
};

export const Currency = CurrencyTemplate.bind({});
Currency.args = {
    value: {
        currency_code: 'HKD',
    },
};
Currency.argTypes = {
    value: {
        control: 'object',
    },
};

const CountryTemplate: StoryFn<typeof FieldCountry> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <FieldCountry
            {...args}
            value={value}
            onChange={(data) => {
                updateArgs({ value: data });
                args.onChange?.(data);
            }}
        />
    );
};
export const Country = CountryTemplate.bind({});
Country.args = {};

const TextEditorTemplate: StoryFn<typeof FieldTextEditor> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <FieldTextEditor
            {...args}
            fileValidation={fileValidation}
            onUpload={onUpload}
            onDelete={onDelete}
            onImageUpload={onUpload}
            onImageDelete={onDelete}
            value={value}
            onChange={(e) => {
                args.onChange?.(e);
                updateArgs({ value: e });
            }}
        />
    );
};
export const TextEditor = TextEditorTemplate.bind({});
TextEditor.argTypes = {
    value: {
        control: 'object',
    },
};
TextEditor.args = {
    blotsProps: {
        dataBoardVariable: {
            boardId: 'brd_eebbc2af-14b3-4c3a-99fb-8e6f9ccbc15c',
        },
        unsubscribe: {
            link: 'http://localhost:8080/email-campaign/unsubscribe',
        },
    },
};

const HookFormExampleComponent: StoryFn<any> = () => {
    const { control, handleSubmit } = useForm<{
        start_datetime: Date | null;
        range: [Date | null, Date | null];
        text: string | null;
        switch: boolean;
    }>({
        defaultValues: {
            text: null,
            start_datetime: null,
        },
    });
    const { t } = useTranslation();

    return (
        <Space direction="vertical" align="start">
            <Controller
                control={control}
                name="text"
                rules={{
                    required: {
                        value: true,
                        message: t('validation_field_required'),
                    },
                }}
                render={({ field, fieldState: { error } }) => {
                    return <FieldText {...field} error={!!error} helperText={error?.message} />;
                }}
            />
            <Controller
                control={control}
                name="switch"
                render={({ field, fieldState: { error } }) => {
                    return (
                        <FieldSwitch
                            {...field}
                            onChange={async (checked) => {
                                field.onChange(checked);
                            }}
                            error={!!error}
                            helperText={error?.message}
                        />
                    );
                }}
            />
            {/* <Controller
                control={control}
                name="start_datetime"
                rules={{
                    required: {
                        value: true,
                        message: t('validation_datepicker_required'),
                    },
                    validate: {
                        invalidDate: (date: Date | null) => {
                            return date instanceof Date && !isNaN(date.getTime()) ? true : t('validation_datepicker_invalidDate');
                        },
                        // beforeToday: (value) => {
                        //     if (!touchpointData) return;
                        //     const formatSelectedDate = format(value, 'MM/dd/yyyy');
                        //     if (isNaN(value) || value.toString() === 'Invalid Date') {
                        //         return t('validation_datepicker_end_date_format');
                        //     }
                        //     const defaultDate = new Date(touchpointData.start_datetime);
                        //     const formatDefaultDate = format(defaultDate, 'MM/dd/yyyy');
                        //     if (formatSelectedDate === formatDefaultDate && !dirtyFields.start_datetime) return true;
                        //     const error = isBefore(value, startOfDay(new Date()));
                        //     return !error || t('validation_datepicker_before_today');
                        // },
                    },
                }}
                render={({ field: { onChange, disabled, ...resetField }, fieldState: { error } }) => {
                    return (
                        <FieldDatePicker
                            {...resetField}
                            onChange={(date, validation) => {
                                onChange(date);
                            }}
                            // maxDate={watch('end_datetime') ?? undefined}
                            error={!!error}
                            helperText={error?.message}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="range"
                rules={{
                    required: {
                        value: true,
                        message: t('validation_datepicker_required'),
                    },
                    validate: {
                        invalidDate: (dates) => {
                            return dates.some((date) => !(date instanceof Date && !isNaN(date.getTime())))
                                ? t('validation_datepicker_invalidDate')
                                : true;
                        },
                    },
                }}
                render={({ field: { onChange, ...resetField }, fieldState: { error } }) => {
                    return (
                        <FieldDateRangePicker
                            {...resetField}
                            disabled={resetField.disabled ? [resetField.disabled, resetField.disabled] : undefined}
                            onChange={(date) => {
                                onChange(date);
                            }}
                            error={!!error}
                            helperText={error?.message}
                        />
                    );
                }}
            /> */}
            <Button
                text="submit"
                onClick={() => {
                    handleSubmit((formData) => {
                        console.log(formData);
                    })();
                }}
            />
        </Space>
    );
};
export const HookFormExample = HookFormExampleComponent.bind({});
