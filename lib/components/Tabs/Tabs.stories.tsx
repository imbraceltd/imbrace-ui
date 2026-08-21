import type { Meta, StoryFn } from '@storybook/react';
import { fn } from '@storybook/test';
import { Icon } from '../Icon';
import { Space } from '../Space';
import { Tabs, TabsProps } from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArgs } from '@storybook/client-api';
import { Button } from '../Button';

export default {
    title: 'Imbrace/Tabs',
    component: Tabs,

    argTypes: {},
    args: {
        onChange: fn(),
    },
    // parameters: {
    //     design: {
    //         type: 'figma',
    //         url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=1398%3A47307&t=Vc0crWfsWncBtL1k-1',
    //     },
    //     // docs: { source: { type: 'dynamic' } },
    // },
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <Story />
            </QueryClientProvider>
        ),
    ],
} as Meta<TabsProps>;

const Template: StoryFn<TabsProps> = (args) => {
    const [{ currentTab, tabs }, updateArgs] = useArgs();
    return (
        <Space direction="vertical" align="start">
            <Tabs
                {...args}
                tabs={tabs}
                currentTab={currentTab}
                onChange={(e, tab) => {
                    updateArgs({ currentTab: tab });
                    args.onChange?.(e, tab);
                }}
            />
            <Button
                text="Change tabs"
                onClick={() => {
                    updateArgs({
                        tabs: [
                            { label: 'Tab 1', value: '1' },
                            { label: 'Tab 2', value: '2', description: 'Description' },
                            { label: 'Tab 3', value: '3' },
                        ],
                    });
                }}
            />
        </Space>
    );
};

export const Default = Template.bind({});
Default.args = {
    tabs: [
        { label: 'Tab 1', value: '1' },
        { label: 'Tab 2', value: '2', description: 'Description' },
        { label: 'Tab 3', value: '3' },
        { type: 'divider' },
        { label: 'Tab 4', value: '4', icon: () => <Icon name="bookmark" /> },
        { label: 'Tab 5', value: '5', icon: () => <Icon name="calendar" />, iconPosition: 'end' },
    ],
};
const RemoteTemplate: StoryFn<TabsProps> = (args) => {
    const [{ currentTab }, updateArgs] = useArgs();
    return (
        <Space>
            <Tabs
                {...args}
                currentTab={currentTab}
                onChange={(e, tab) => {
                    updateArgs({ currentTab: tab });
                    args.onChange?.(e, tab);
                }}
            />
        </Space>
    );
};

export const RequestTabs = RemoteTemplate.bind({});
RequestTabs.args = {
    request: async () => {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        return [
            { label: 'Tab 1', value: '1' },
            { label: 'Tab 2', value: '2', description: 'Description' },
            { label: 'Tab 3', value: '3' },
            { type: 'divider' },
            { label: 'Tab 4', value: '4', icon: () => <Icon name="bookmark" /> },
            { label: 'Tab 5', value: '5', icon: () => <Icon name="calendar" />, iconPosition: 'end' },
        ];
    },
};

const RemoteWithSelectTemplate: StoryFn<TabsProps<['tabsRemoteSelect'], Record<string, string>>> = (args) => {
    const [{ currentTab }, updateArgs] = useArgs();
    return (
        <Space>
            <Tabs
                {...args}
                queryKey={['tabsRemoteSelect']}
                currentTab={currentTab}
                onChange={(e, tab) => {
                    updateArgs({ currentTab: tab });
                    args.onChange?.(e, tab);
                }}
            />
        </Space>
    );
};

export const RequestWithSelectTabs = RemoteWithSelectTemplate.bind({});
RequestWithSelectTabs.args = {
    request: async () => {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        return {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
        };
    },
    querySelect: (data) => {
        return Object.keys(data).map((key) => ({ label: key, value: key }));
    },
};
