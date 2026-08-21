import './App.css';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getCountry } from 'countries-and-timezones';
import i18next from 'i18next';
import detector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import type { CountryCode } from 'libphonenumber-js';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { initReactI18next, useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
    Button,
    Dropdown,
    EllipsisText,
    FieldCheckbox,
    FieldCountry,
    FieldDatePicker,
    FieldDatetimePicker,
    FieldPhone,
    FieldSelect,
    FieldSwitch,
    FieldText,
    FieldUpload,
    Icon,
    Illustration,
    Search,
    Select,
    Space,
    Switch,
    Typography,
    Upload,
    useDialog,
    useModal,
} from '../lib/main';

import cn from '../lib/translations/cn.json';
import en from '../lib/translations/en.json';
import zh from '../lib/translations/zh.json';

import TextEditorExample from './TextEditorExample';

const queryClient = new QueryClient();

i18next
    .use(initReactI18next)
    .use(detector)
    .use(Backend)
    .init({
        resources: {
            en: { translation: en },
            cn: { translation: cn },
            zh: { translation: zh },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        nsSeparator: false,
        keySeparator: false,
        returnEmptyString: false,
        interpolation: {
            escapeValue: false,
        },
    });

const schema = z.object({
    text: z
        .string({
            required_error: i18next.t('validation_field_required'),
        })
        .trim()
        .min(1, {
            message: i18next.t('validation_field_required'),
        }),
    select: z
        .string({
            required_error: i18next.t('validation_field_required'),
        })
        .trim()
        .min(1, {
            message: i18next.t('validation_field_required'),
        }),
});

const FormContent = ({
    control,
}: {
    control: Control<
        {
            text: string;
            select: string;
        },
        any
    >;
}) => {
    const [{ dialogForm }, dialogHolder] = useDialog();
    return (
        <Space style={{ padding: 10 }}>
            {dialogHolder}
            <Space direction="vertical" align="start" style={{ width: '300px' }}>
                <Controller
                    control={control}
                    name="text"
                    render={({ field, fieldState: { error } }) => (
                        <FieldText label="Text" error={!!error} helperText={error?.message} {...field} />
                    )}
                />
                <Controller
                    control={control}
                    name="select"
                    render={({ field, fieldState: { error } }) => (
                        <FieldSelect
                            queryKey={['modalSelect']}
                            request={async () => {
                                return [{ text: 'Test', value: 'text' }];
                            }}
                            label="Select"
                            error={!!error}
                            helperText={error?.message}
                            {...field}
                        />
                    )}
                />
                <FieldDatePicker />
                <Button
                    text="Open sibling Dialog form"
                    onClick={() => {
                        dialogForm<z.infer<typeof schema>, typeof schema>({
                            title: 'hi sibling',
                            content: ({ control: con }) => (
                                <Space style={{ padding: 10 }}>
                                    <Space direction="vertical" align="start" style={{ width: '300px' }}>
                                        <Controller
                                            control={con}
                                            name="text"
                                            render={({ field, fieldState: { error } }) => (
                                                <FieldText label="Text" error={!!error} helperText={error?.message} {...field} />
                                            )}
                                        />
                                        <Controller
                                            control={con}
                                            name="select"
                                            render={({ field, fieldState: { error } }) => (
                                                <FieldSelect
                                                    queryKey={['modalSelect']}
                                                    request={async () => {
                                                        return [{ text: 'Test', value: 'text' }];
                                                    }}
                                                    label="Select"
                                                    footer={() => (
                                                        <Button
                                                            text="open dialog"
                                                            onClick={() => {
                                                                dialogForm<z.infer<typeof schema>, typeof schema>({
                                                                    title: 'hi sibling',
                                                                    content: ({ control: conn }) => <FormContent control={conn} />,
                                                                    onClose: () => {},
                                                                    onConfirm: async () => {
                                                                        return true;
                                                                    },
                                                                    schema: schema,
                                                                    showUnsavedDialog: true,
                                                                });
                                                            }}
                                                        />
                                                    )}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </Space>
                                </Space>
                            ),
                            onClose: () => {},
                            onConfirm: async () => {
                                return true;
                            },
                            schema: schema,
                            showUnsavedDialog: true,
                        });
                    }}
                />
            </Space>
        </Space>
    );
};

function App() {
    const [searchInput, setSearchInput] = useState('');
    const [searchbarInput, setSearchbarInput] = useState('');
    const [selectValue, setSelectValue] = useState<string | number>();
    const [multipleSelectValue, setMultipleSelectValue] = useState<(string | number)[]>();
    const [selectCountry, setSelectCountry] = useState<
        | {
              country_name: string;
              country_code: CountryCode;
          }
        | undefined
    >({
        country_name: 'Taiwan',
        country_code: 'TW',
    });
    const [{ dialog, dialogForm, dialogWindow, dialogStepForm }, dialogsHolder] = useDialog();
    const [{ modal }, modalHolder] = useModal();

    const resetSearchInput = () => {
        setSearchbarInput('');
    };

    const { t } = useTranslation();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <QueryClientProvider client={queryClient}>
                <>
                    {dialogsHolder}
                    {modalHolder}
                </>

                <Space direction="vertical" justify="center" align="center" size={40}>
                    <Typography variant="Heading1">@imbrace/ui Playground</Typography>
                    <Space>
                        <Icon name="accountCircle" />
                        <Icon name="accounts" />
                        <Icon name="add" />
                        <Icon name="person" />
                        <Icon name="allTeams" />
                        <Icon namespace="channel" name="wechat" />
                        <Icon namespace="twoTone" name="sort" />
                        <Icon namespace="workflow" name="subWorkflow" />
                        <Icon namespace="file" name="pdf" />
                        <Icon name="eventTrigger" />
                        <Icon name="timeTrigger" />
                    </Space>
                    <Illustration name="addFile" />
                    <TextEditorExample />
                    <Space justify="center" style={{ maxWidth: '240px' }}>
                        <Select
                            value={selectValue}
                            onChange={setSelectValue}
                            placeholder="Single select"
                            request={async () => {
                                return [
                                    { text: 'Test', value: 'text' },
                                    { text: 'Ten', value: 10 },
                                    { text: 'Hi', value: 'hi' },
                                    { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
                                    {
                                        text: 'With icon LongLongLongLongLongLong',
                                        value: 'withicon',
                                        icon: <Icon name="bookmark" />,
                                    },
                                    { text: 'Option6', value: 6 },
                                    { text: 'Option7', value: 7 },
                                    { text: 'Option8', value: 8 },
                                    { text: 'Option9', value: 9 },
                                ];
                            }}
                            onReset={() => {
                                setSelectValue('');
                            }}
                        />
                        <Select
                            value={multipleSelectValue}
                            onChange={setMultipleSelectValue}
                            placeholder="Multiple select"
                            displayType="chip"
                            request={async () => {
                                return [
                                    { text: 'Test', value: 'text' },
                                    { text: 'Ten', value: 10 },
                                    { text: 'Hi', value: 'hi' },
                                    { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
                                    {
                                        text: 'With icon LongLongLongLongLongLong',
                                        value: 'withicon',
                                        icon: <Icon name="bookmark" />,
                                    },
                                    { text: 'Option6', value: 6 },
                                    { text: 'Option7', value: 7 },
                                    { text: 'Option8', value: 8 },
                                    { text: 'Option9', value: 9 },
                                ];
                            }}
                            multiple
                            onReset={() => {
                                setMultipleSelectValue([]);
                            }}
                        />
                    </Space>
                    <Space>
                        <FieldDatePicker label="FieldDatePicker" readOnly />
                    </Space>
                    <Space>
                        <FieldCheckbox
                            value={true}
                            checkboxLabel={() => {
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <Typography variant="BodyBold">
                                            I agree to the terms and conditions.
                                        </Typography>
                                        <Typography variant="Body">
                                            Sample privacy notice text used to demonstrate a long-form checkbox label.
                                        </Typography>
                                    </div>
                                );
                            }}
                            textPlacement="end"
                        />
                    </Space>
                    <Space>
                        <FieldSwitch
                            label="FieldSwitch"
                            description="switch description"
                            switchLabel={() => {
                                return <div>xxx</div>;
                            }}
                            labelPlacement="top"
                            onChange={async () => {}}
                        />
                    </Space>
                    <Space>
                        <FieldDatetimePicker label="FieldDatetimePicker" />
                    </Space>
                    <Space>
                        <Dropdown
                            options={[
                                { text: 'Action', index: 0 },
                                { text: 'Action', index: 1 },
                                { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
                                { type: 'divider' },
                                { text: 'Action', index: 3, disabled: true },
                            ]}
                            text="Dropdown"
                        />
                        <Dropdown
                            variant="text"
                            icon={<Icon name="filter" />}
                            options={[
                                { text: 'Action', index: 0 },
                                { text: 'Action', index: 1 },
                                { text: 'Action', index: 2, icon: <Icon name="accountCircle" /> },
                                { type: 'divider' },
                                { text: 'Action', index: 3, disabled: true },
                            ]}
                            checkbox
                        />
                    </Space>

                    <Switch />
                    <Space style={{ width: '300px' }}>
                        <div>
                            <Upload />
                        </div>
                        <div>
                            <Upload type="avatar" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Upload type="input" rows={2} multiple addButtonDisplay="hover" />
                        </div>
                    </Space>
                    <div style={{ width: '100px' }}>
                        <EllipsisText text="long long long long long long Text" />
                    </div>
                    <Button text="Button" />
                    <Space>
                        <FieldText label="FieldText" tooltip="I'm tooltip" />

                        <FieldUpload
                            label="FieldUpload"
                            uploadButtonProps={{ text: 'Upload' }}
                            fileValidation={async (file) => {
                                if (file.size > 1024 * 1024) {
                                    return 'File size must be less than 1MB';
                                }
                                return true;
                            }}
                            showFileSize
                        />
                        <FieldUpload label="FieldUpload" type="input" />
                    </Space>
                    <div>
                        <FieldPhone label="FieldPhone" defaultCountryCode="HK" />
                    </div>
                </Space>

                <Space>
                    <div style={{ margin: '30px auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <Search
                            placeholder={t('teams_search_placeholder')}
                            value={searchInput}
                            onSearch={(value) => {
                                setSearchInput(value);
                            }}
                            sx={{
                                width: '248px',
                            }}
                        />

                        <div style={{ width: '400px' }}>
                            <Search
                                queryKey={['search-range']}
                                requestFn={async () => {
                                    return [
                                        { text: 'in tite only', value: 'title_only' },
                                        { text: 'in content only', value: 'content_only' },
                                        { text: 'in tite/content', value: 'title_and_content' },
                                    ];
                                }}
                                defaultSelectValue="title_only"
                                value={searchbarInput}
                                onSearch={(inputValue) => {
                                    setSearchbarInput(inputValue);
                                }}
                                onReset={resetSearchInput}
                                fullWidth
                            />
                        </div>
                    </div>
                </Space>

                <Space justify="center" align="center" style={{ marginBottom: 20 }}>
                    <FieldCountry
                        label="FieldCountry"
                        placeholder="Select a country"
                        value={selectCountry?.country_code}
                        onChange={(val) => {
                            if (!val) return;
                            const country = getCountry(val as CountryCode);
                            if (country) {
                                setSelectCountry({
                                    country_code: val as CountryCode,
                                    country_name: country.name,
                                });
                            }
                        }}
                        onReset={() => setSelectCountry(undefined)}
                    />
                </Space>

                <Space justify="center" align="center" wrap>
                    <Button
                        text="Open Modal"
                        onClick={() => {
                            modal({
                                // title: 'hi',
                                hideHeader: true,
                                content: () => (
                                    <Space style={{ padding: 10 }}>
                                        <div style={{ width: '300px' }}>
                                            <Select
                                                queryKey={['modalSelect']}
                                                request={async () => {
                                                    return [{ text: 'Test', value: 'text' }];
                                                }}
                                            />
                                            <FieldDatePicker />
                                        </div>
                                    </Space>
                                ),
                            });
                        }}
                    />
                    <Button
                        text="Open Dialog"
                        onClick={() => {
                            dialog({
                                title: 'hi',
                                content: () => (
                                    <Space style={{ padding: 10 }}>
                                        <Space direction="vertical" style={{ width: '300px' }}>
                                            <Select
                                                queryKey={['modalSelect']}
                                                request={async () => {
                                                    return [{ text: 'Test', value: 'text' }];
                                                }}
                                            />
                                            <Button
                                                text="Open sibling Dialogs"
                                                onClick={() => {
                                                    dialog({
                                                        title: "hi, I'm sibling dialogs",
                                                        content: () => (
                                                            <Space style={{ padding: 10 }}>
                                                                <div style={{ width: '300px' }}>
                                                                    <Select
                                                                        queryKey={['modalSelect2']}
                                                                        request={async () => {
                                                                            return [{ text: 'Test2', value: 'text' }];
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Space>
                                                        ),
                                                    });
                                                }}
                                            />
                                        </Space>
                                    </Space>
                                ),
                            });
                        }}
                    />

                    <Button
                        text="Open Dialog form"
                        onClick={() => {
                            dialogForm<z.infer<typeof schema>, typeof schema>({
                                title: 'hi',
                                content: ({ control }) => <FormContent control={control} />,
                                onClose: () => {},
                                onConfirm: async () => {
                                    return true;
                                },
                                schema: schema,
                                showUnsavedDialog: true,
                            });
                        }}
                    />
                    <Button
                        text="Open Dialog step form"
                        onClick={() => {
                            dialogStepForm({
                                title: 'hi',
                                content: () => [
                                    <Space style={{ padding: 10 }}>
                                        <Space direction="vertical" style={{ width: '300px' }}>
                                            <FieldDatePicker />
                                        </Space>
                                    </Space>,
                                ],
                                onClose: () => {},
                                onConfirm: async () => {
                                    return true;
                                },
                                confirmText: ['Confirm', 'Confirming'],
                            });
                        }}
                    />
                    <Button
                        text="Open Dialog Window"
                        onClick={() => {
                            dialogWindow({
                                title: 'hi',
                                content: () => (
                                    <Space style={{ padding: 10 }}>
                                        <div style={{ width: '300px' }}>
                                            <Select
                                                queryKey={['modalSelect']}
                                                request={async () => {
                                                    return [{ text: 'Test', value: 'text' }];
                                                }}
                                            />
                                        </div>
                                    </Space>
                                ),
                            });
                        }}
                    />
                </Space>
            </QueryClientProvider>
        </LocalizationProvider>
    );
}

export default App;
