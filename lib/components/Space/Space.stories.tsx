import { useArgs } from '@storybook/client-api';
import type { Meta, StoryFn } from '@storybook/react';

import { Typography } from '../Typography';
import { Space } from '../Space';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';

export default {
    title: 'Imbrace/Space',
    component: Space,

    argTypes: {
        size: {
            type: 'number',
            defaultValue: 10,
        },
        direction: {
            type: 'string',
            defaultValue: 'center',
            options: ['horizontal', 'vertical', 'horizontal-reverse', 'vertical-reverse'],
            control: 'radio',
        },
        align: {
            type: 'string',
            defaultValue: 'center',
            options: ['center', 'start', 'end', 'stretch'],
            control: 'select',
        },
        justify: {
            type: 'string',
            defaultValue: 'start',
            options: ['between', 'start', 'end', 'center', 'stretch'],
            control: 'select',
        },
        wrap: {
            type: 'boolean',
            defaultValue: false,
        },
        divider: {
            type: 'boolean',
            defaultValue: false,
        },
        dividerProps: {
            type: 'symbol',
            control: 'object',
        },
        children: {
            type: 'symbol',
        },
    },
    args: {
        wrap: false,
        size: 10,
        align: 'center',
        justify: 'start',
        divider: false,
        direction: 'horizontal',
    },
    parameters: {
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Space>;

const Template: StoryFn<typeof Space> = (args) => {
    return (
        <>
            <Space direction="vertical" {...args}>
                <Typography>hi hi hi hi</Typography>
                <Button text={'Button'} />
                <IconButton type="secondary" variant="outlined">
                    <Icon name="add" />
                </IconButton>
                <div style={{ width: 200, height: 200, background: 'skyblue', borderRadius: 5 }}></div>
            </Space>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {};
