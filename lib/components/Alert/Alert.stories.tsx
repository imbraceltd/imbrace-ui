import { Icon } from '../Icon';
import { Space } from '../Space';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Alert } from '.';

export default {
    title: 'Imbrace/Alert',
    component: Alert,

    argTypes: {
        type: {
            type: 'string',
            control: 'select',
            defaultValue: 'success',
            options: ['success', 'warning', 'error'],
        },
        hideIcon: {
            type: 'boolean',
            defaultValue: false,
        },
        hideCloseButton: {
            type: 'boolean',
            defaultValue: false,
        },
        message: {
            type: 'string',
        },
        icon: {
            table: {
                category: 'Element',
            },
            control: false,
        },
        actionButton: {
            table: {
                category: 'Element',
            },
            control: false,
        },
        onClose: {
            table: {
                category: 'Event',
            },
            control: false,
        },
    },
    args: {
        type: 'warning',
        message: 'Tips Msg',
    },
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?type=design&node-id=2292-135296&mode=design&t=u8Jdy2EUTW3mlYsk-0',
        },
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = (args) => {
    return <Alert {...args} />;
};

export const Default = Template.bind({});
Default.args = {};

const Types: StoryFn<typeof Alert> = (args) => {
    return (
        <Space direction="vertical" align="start">
            <Alert type="success" message="Success msg" onClose={args.onClose} />
            <Alert type="warning" message="Warning msg" onClose={args.onClose} />
            <Alert type="error" message="Error msg" onClose={args.onClose} />
        </Space>
    );
};

export const AllTypes = Types.bind({});
AllTypes.args = {};

const CIcon: StoryFn<typeof Alert> = (args) => {
    return <Alert icon={<Icon name="tips" />} {...args} />;
};

export const CustomIcon = CIcon.bind({});
CustomIcon.args = {};

const ActionButton: StoryFn<typeof Alert> = (args) => {
    return <Alert actionButton={<Button type="warning" text="confirm" size="xs" variant="text" />} {...args} />;
};
export const CustomActionButton = ActionButton.bind({});
CustomActionButton.args = {};
