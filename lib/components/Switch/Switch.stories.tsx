import { action } from '@storybook/addon-actions';
import { Switch } from '.';
import { Meta, StoryFn } from '@storybook/react';

export default {
    title: 'Imbrace/Switch',
    component: Switch,
    argTypes: {
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
        type: {
            control: 'select',
            options: ['xs', 'small', 'default'],
        },
        tooltip: { control: 'text' },
    },
} as Meta<typeof Switch>;

const Template: StoryFn<typeof Switch> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
    checked: false,
    disabled: false,
    type: 'default',
    tooltip: 'Toggle switch',
};
