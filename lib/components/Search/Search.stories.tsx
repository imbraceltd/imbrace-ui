import { useArgs } from '@storybook/client-api';
import type { Meta, StoryFn } from '@storybook/react';

import { Search, SearchProps } from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default {
    title: 'Imbrace/Search',
    component: Search,

    argTypes: {
        hideReset: {
            type: 'boolean',
            defaultValue: false,
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
        inputRef: {
            table: {
                category: 'Ref',
            },
            control: false,
        },
    },
    args: {
        placeholder: 'Search',
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <Story />
            </QueryClientProvider>
        ),
    ],
} as Meta<SearchProps>;

const Template: StoryFn<SearchProps> = (args) => {
    const [{ value }, updateArgs, resetArgs] = useArgs<SearchProps>();
    return (
        <Search
            {...args}
            value={value ?? ''}
            onSearch={(value) => {
                updateArgs({ value: value });
                if (!('queryKey' in args)) {
                    args.onSearch?.(value);
                }
            }}
            onReset={(e) => {
                resetArgs(['value']);
                updateArgs({ value: undefined });
                args.onReset?.(e);
            }}
        />
    );
};
export const Default = Template.bind({});

const WithDropdownTemplate: StoryFn<SearchProps> = (args) => {
    const [{ value }, updateArgs, resetArgs] = useArgs<SearchProps>();
    return (
        <Search
            {...args}
            value={value ?? ''}
            onSearch={(value, selectedValue) => {
                updateArgs({ value: value });
                args.onSearch?.(value, selectedValue);
            }}
            onReset={(e) => {
                resetArgs(['value']);
                updateArgs({ value: undefined });
                args.onReset?.(e);
            }}
            queryKey={['searchDropdown']}
            requestFn={async () => {
                return [
                    {
                        text: 'Ping',
                        value: 'Ping',
                    },
                    {
                        text: 'Pong',
                        value: 'Pong',
                    },
                ];
            }}
        />
    );
};
export const WithDropdown = WithDropdownTemplate.bind({});
