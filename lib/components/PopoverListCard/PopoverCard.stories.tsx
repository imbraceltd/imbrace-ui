import { Icon } from '../Icon';
import type { Meta, StoryFn } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DropdownMenuItem } from '../Dropdown';
import { PopoverListCard, PopoverListCardOption } from '.';
import { useState } from 'react';
import { useArgs } from '@storybook/client-api';
import { fn } from '@storybook/test';

export default {
    title: 'Imbrace/PopoverListCard',
    component: PopoverListCard,

    argTypes: {
        searchable: {
            type: 'boolean',
            defaultValue: false,
        },
        toggleElement: {
            type: 'function',
            table: {
                category: 'Elements',
            },
            control: false,
        },
        footer: {
            type: 'function',
            table: {
                category: 'Elements',
            },
            control: false,
        },
        request: {
            type: 'function',
            table: {
                category: 'Events',
            },
            control: false,
        },
        onSearch: {
            type: 'function',
            table: {
                category: 'Events',
            },
            control: false,
        },
        onSelected: {
            type: 'function',
            table: {
                category: 'Events',
            },
            control: false,
        },
        onSort: {
            type: 'function',
            table: {
                category: 'Events',
            },
            control: false,
        },
    },
    args: {
        onSelect: fn(),
        onSort: fn(),
    },
    parameters: {
        docs: { source: { type: 'dynamic' } },
    },
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <Story />
            </QueryClientProvider>
        ),
    ],
} as Meta<typeof PopoverListCard<{ text: string; id: string }>>;

const DefaultComponent: StoryFn<typeof PopoverListCard<{ text: string; id: string }>> = (props) => {
    const [
        {
            selected,
            options = {
                data: [
                    { text: 'Item 1', id: '1' },
                    { text: 'Item 2', id: '2' },
                    { text: 'Item 3', id: '3' },
                    { text: 'Item 4', id: '4' },
                    { text: 'Item 5', id: '5' },
                    { text: 'Item 6', id: '6' },
                    { text: 'Item 7', id: '7' },
                    { text: 'Item 8', id: '8' },
                    { text: 'Item 9', id: '9' },
                    { text: 'Item 10', id: '10' },
                    { text: 'Item 11', id: '11' },
                ],
                options: [
                    { text: 'Item 1', id: '1' },
                    { text: 'Item 2', id: '2' },
                    { text: 'Item 3', id: '3' },
                    { text: 'Item 4', id: '4' },
                    { text: 'Item 5', id: '5' },
                    { text: 'Item 6', id: '6' },
                    { text: 'Item 7', id: '7' },
                    { text: 'Item 8', id: '8' },
                    { text: 'Item 9', id: '9' },
                    { text: 'Item 10', id: '10' },
                    { text: 'Item 11', id: '11' },
                ],
            },
        },
        updateArgs,
    ] = useArgs();

    const request = async () => {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        return options as { data: { text: string; id: string }[]; options: PopoverListCardOption[] };
    };
    return (
        <PopoverListCard<{ text: string; id: string }, ['storybook-PopoverListCard']>
            {...props}
            queryKey={['storybook-PopoverListCard']}
            request={request}
            onSort={async (newOptions) => {
                updateArgs({
                    options: {
                        data: newOptions,
                        options: newOptions,
                    },
                });
                props?.onSort?.(newOptions);
            }}
            selected={selected}
            onSelect={(id, item) => {
                updateArgs({
                    selected: id,
                });
                props.onSelect?.(id, item);
            }}
            footer={() => (
                <DropdownMenuItem hasIcon color="var(--color-primary-1)">
                    <Icon name="add" />
                    Add new
                </DropdownMenuItem>
            )}
        />
    );
};

export const Default = DefaultComponent.bind({});

const QuerySelectComponent: StoryFn<typeof PopoverListCard<{ text: string; id: string }>> = (props) => {
    const [{ selected }, updateArgs] = useArgs();

    return (
        <PopoverListCard<
            { text: string; id: string },
            ['storybook-PopoverListCard-querySelect'],
            { data: { anotherField: string; anotherFieldID: string }[] }
        >
            {...props}
            queryKey={['storybook-PopoverListCard-querySelect']}
            onSort={async (newOptions) => {
                updateArgs({
                    options: {
                        data: newOptions,
                        options: newOptions,
                    },
                });
                props?.onSort?.(newOptions);
            }}
            request={async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
                return {
                    data: [
                        { anotherField: 'Item 1', anotherFieldID: '1' },
                        { anotherField: 'Item 2', anotherFieldID: '2' },
                        { anotherField: 'Item 3', anotherFieldID: '3' },
                    ],
                };
            }}
            querySelect={(data) => ({
                data: data.data.map((d) => ({ text: d.anotherField, id: d.anotherFieldID })),
                options: data.data.map((d) => ({ text: d.anotherField, id: d.anotherFieldID })),
            })}
            selected={selected}
            onSelect={(id, item) => {
                updateArgs({
                    selected: id,
                });
                props.onSelect?.(id, item);
            }}
            footer={() => (
                <DropdownMenuItem hasIcon color="var(--color-primary-1)">
                    <Icon name="add" />
                    Add new
                </DropdownMenuItem>
            )}
        />
    );
};

export const QuerySelectExample = QuerySelectComponent.bind({});
