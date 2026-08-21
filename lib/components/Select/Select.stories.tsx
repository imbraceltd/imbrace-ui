import type { Meta, StoryFn } from '@storybook/react';
import { fn } from '@storybook/test';
import { Icon } from '../Icon';
import { Space } from '../Space';
import { Select, SelectProps } from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArgs } from '@storybook/client-api';
import { Typography } from '../Typography';

export default {
    title: 'Imbrace/Select',
    component: Select,

    argTypes: {
        text: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        chipsContainerScrollbarProps: {
            type: 'string',
        },
        containerClassName: {
            type: 'string',
        },
        searchable: {
            type: 'boolean',
            defaultValue: false,
        },
        closeOnSelect: {
            type: 'boolean',
            defaultValue: false,
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
        },
        hideSelectedItem: {
            type: 'boolean',
            defaultValue: false,
        },
        fullWidth: {
            type: 'boolean',
            defaultValue: false,
        },
        enabled: {
            type: 'boolean',
            defaultValue: false,
        },
        error: {
            type: 'boolean',
            defaultValue: false,
        },
        hideArrow: {
            type: 'boolean',
            defaultValue: false,
        },
        chipWrap: {
            type: 'boolean',
            defaultValue: false,
        },
        multiple: {
            type: 'boolean',
            defaultValue: false,
        },
        readOnly: {
            type: 'boolean',
            defaultValue: false,
        },
        menuType: {
            control: 'select',
            defaultValue: 'text',
            options: ['text', 'chip'],
        },
        displayType: {
            control: 'select',
            defaultValue: 'text',
            options: ['text', 'chip'],
        },
        onChange: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        onSearch: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        onReset: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        onClose: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        onOpen: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        searchFn: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        request: {
            table: {
                category: 'Events',
            },
            control: false,
        },
        customIcon: {
            table: {
                category: 'Element',
            },
            control: false,
        },
        footer: {
            table: {
                category: 'Element',
            },
            control: false,
        },
        renderValue: {
            table: {
                category: 'Element',
            },
            control: false,
        },
    },
    args: {
        onChange: fn(),
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=1398%3A47307&t=Vc0crWfsWncBtL1k-1',
        },
        // docs: { source: { type: 'dynamic' } },
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <Story />
            </QueryClientProvider>
        ),
    ],
} as Meta<SelectProps>;

const Template: StoryFn<SelectProps> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space>
            <Select
                {...args}
                value={value}
                onChange={(selectedValue) => {
                    updateArgs({ value: selectedValue });
                    args.onChange?.(selectedValue);
                }}
                onReset={undefined}
                containerStyle={{ maxWidth: '240px' }}
            />
        </Space>
    );
};

export const Default = Template.bind({});
Default.args = {
    placeholder: 'Click to select',
    request: async () => [
        { text: 'Ten', value: 10 },
        { text: 'Hi', value: 'hi' },
        { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
        {
            text: 'With LongLongLongLongLongLong',
            value: 'withicon',
            icon: <Icon name="bookmark" />,
            reverse: true,
        },
    ],
};

const CustomIconTemplate: StoryFn<SelectProps> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space>
            <Select
                {...args}
                value={value}
                onChange={(selectedValue) => {
                    updateArgs({ value: selectedValue });
                    args.onChange?.(selectedValue);
                }}
                customIcon={(open) => (
                    <Icon
                        name="add"
                        fontSize={20}
                        style={{
                            display: open ? 'none' : undefined,
                            marginRight: '6px',
                            color: 'var(--color-light-4)',
                        }}
                    />
                )}
                onReset={undefined}
            />
        </Space>
    );
};
export const CustomIcon = CustomIconTemplate.bind({});
CustomIcon.args = {
    placeholder: 'Click to select',
    request: async () => [
        { text: 'Ten', value: 10 },
        { text: 'Hi', value: 'hi' },
        { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
        { text: 'With icon LongLongLongLongLongLong', value: 'withicon', icon: <Icon name="bookmark" /> },
    ],
};

const OutOfRangeTemplate: StoryFn<SelectProps> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space direction="vertical" justify="start" align="start">
            <Select<string>
                {...args}
                onChange={(selectedValue, isValid) => {
                    updateArgs({ value: selectedValue });
                    args.onChange?.(selectedValue, isValid);
                }}
                value={value}
                defaultValue={'s'}
                onReset={undefined}
            />
            <Typography>
                check <mark>Actions</mark> to see the onChange event
            </Typography>
        </Space>
    );
};
export const OutOfRange = OutOfRangeTemplate.bind({});
OutOfRange.args = {
    placeholder: 'Click to select',
    request: async () => [
        { text: 'Ten', value: 10 },
        { text: 'Hi', value: 'hi' },
        { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
        { text: 'With icon LongLongLongLongLongLong', value: 'withicon', icon: <Icon name="bookmark" /> },
    ],
};
const DefaultValueTemplate: StoryFn<SelectProps> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space>
            <Select<string | number>
                {...args}
                onChange={(selectedValue) => {
                    updateArgs({ value: selectedValue });
                    args.onChange?.(selectedValue);
                }}
                value={value}
                defaultValue={10}
                onReset={undefined}
            />
        </Space>
    );
};
export const DefaultValue = DefaultValueTemplate.bind({});
DefaultValue.args = {
    placeholder: 'Click to select',
    request: async () => [
        { text: 'Ten', value: 10 },
        { text: 'Hi', value: 'hi' },
        { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
        { text: 'With icon LongLongLongLongLongLong', value: 'withicon', icon: <Icon name="bookmark" /> },
    ],
};

const SearchTemplate: StoryFn<SelectProps> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Select<string | number>
            {...args}
            onChange={(selectedValue) => {
                updateArgs({ value: selectedValue });
                args.onChange?.(selectedValue);
            }}
            value={value}
            defaultValue={10}
            onReset={undefined}
            searchable
            fullWidth
        />
    );
};
export const Search = SearchTemplate.bind({});
Search.args = {
    placeholder: 'Click to select',
    request: async () => [
        { text: 'Ten', value: 10 },
        { text: 'Hi', value: 'hi' },
        { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
        { text: 'With icon LongLongLongLongLongLong', value: 'withicon', icon: <Icon name="bookmark" /> },
    ],
};

const MultipleSelectComponent: StoryFn<SelectProps> = (args) => {
    const [{ value }, updateArgs] = useArgs();
    return (
        <Space>
            <div style={{ maxWidth: 240 }}>
                <Select
                    {...args}
                    onChange={(selectedValue) => {
                        updateArgs({ value: selectedValue });
                        args.onChange?.(selectedValue);
                        // fn();
                    }}
                    {...(value?.length > 0
                        ? {
                              onReset: () => {
                                  updateArgs({ value: [] });
                                  args.onReset?.();
                              },
                          }
                        : {
                              onReset: undefined,
                          })}
                />
            </div>
            <div style={{ maxWidth: 240 }}>
                <Select
                    {...args}
                    onChange={(selectedValue) => {
                        updateArgs({ value: selectedValue });
                        args.onChange?.(selectedValue);
                        // fn();
                    }}
                    customIcon={(open) => (
                        <Icon
                            name="add"
                            fontSize={20}
                            style={{
                                display: open ? 'none' : undefined,
                                marginRight: '6px',
                                color: 'var(--color-light-4)',
                            }}
                        />
                    )}
                    {...(value?.length > 0
                        ? {
                              onReset: () => {
                                  updateArgs({ value: [] });
                                  args.onReset?.();
                              },
                          }
                        : {
                              onReset: undefined,
                          })}
                />
            </div>
            <div style={{ maxWidth: 240 }}>
                <Select
                    {...args}
                    onChange={(selectedValue) => {
                        updateArgs({ value: selectedValue });
                        // args.onChange?.(selectedValue);
                        // fn();
                    }}
                    menuType="chip"
                    displayType="chip"
                    customIcon={(open) => (
                        <Icon
                            name="add"
                            fontSize={20}
                            style={{
                                display: open ? 'none' : undefined,
                                marginRight: '6px',
                                color: 'var(--color-light-4)',
                            }}
                        />
                    )}
                    {...(value?.length > 0
                        ? {
                              onReset: () => {
                                  updateArgs({ value: [] });
                                  args.onReset?.();
                              },
                          }
                        : {
                              onReset: undefined,
                          })}
                />
            </div>
        </Space>
    );
};

export const MultipleSelect = MultipleSelectComponent.bind({});
MultipleSelect.args = {
    placeholder: 'Click to select',
    multiple: true,
    request: async () => [
        { text: 'Ten', value: 10 },
        { text: 'Hi', value: 'hi' },
        { text: 'LongLongLongLongLongLong Text', value: 'longtext' },
        { text: 'With icon LongLongLongLongLongLong', value: 'withicon', icon: <Icon name="bookmark" /> },
    ],
};

const QuerySelectComponent: StoryFn<SelectProps<string, ['querySelectExample'], Record<string, string>>> = (args) => {
    const [{ value }, updateArgs] = useArgs<{ value: string }>();

    return (
        <div style={{ maxWidth: 240 }}>
            <Select<string, ['querySelectExample'], Record<string, string>>
                {...args}
                onChange={(selectedValue) => {
                    args.onChange?.(selectedValue);
                    updateArgs({ value: selectedValue });
                }}
                value={value}
                onReset={undefined}
                searchable
                fullWidth
                queryKey={['querySelectExample']}
            />
        </div>
    );
};

export const QuerySelect = QuerySelectComponent.bind({});
QuerySelect.args = {
    placeholder: 'Click to select',
    request: async () => {
        return {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
        };
    },
    querySelect: (data) => {
        return Object.entries(data).map(([key, value]) => ({
            text: value,
            value: key,
        }));
    },
};
