import type { Meta, StoryFn } from '@storybook/react';
import { Icon } from '../Icon';
import { List } from '.';
import { Space } from '../Space';
import { Typography } from '../Typography';
import { IconButton } from '../IconButton';

export default {
    title: 'Imbrace/List',
    component: List,

    argTypes: {},
    // args: {
    //     placeholder: 'Placeholder',
    // },
    parameters: {
        // design: {
        //     type: 'figma',
        //     url: 'https://www.figma.com/file/KMoQjjjfdoxwJClKLKxY13/Platform---Core-Library?node-id=1398%3A47307&t=Vc0crWfsWncBtL1k-1',
        // },
        // docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof List>;

const Template: StoryFn<typeof List> = (args) => {
    return (
        <Space direction="vertical" align="start">
            <List {...args} />
            <Typography variant="SubHeading2">Scroll example</Typography>
            <div style={{ height: '150px', width: '100%' }}>
                <List {...args} />
            </div>
        </Space>
    );
};
export const Default = Template.bind({});
Default.args = {
    items: [
        { text: 'Webinar 20240503', icon: <Icon name="form" style={{ fontSize: 24, color: 'var(--color-light-5)' }} /> },
        { text: 'Webinar 20240503', icon: <Icon name="form" style={{ fontSize: 24, color: 'var(--color-light-5)' }} /> },
        { text: 'Webinar 20240503', icon: <Icon name="form" style={{ fontSize: 24, color: 'var(--color-light-5)' }} /> },
        { text: 'Webinar 20240503' },
        {
            text: (
                <Space size={4} direction="vertical" justify="center" align="start" style={{ flex: 1 }}>
                    <Typography variant="BodyTight">Webinar 20240503</Typography>
                    <Typography variant="Caption" style={{ color: 'var(--color-light-5)' }}>
                        Created At
                    </Typography>
                </Space>
            ),
            icon: (
                <IconButton variant="text" type="secondary" size="s" fontSize={24} onClick={(e) => {}}>
                    <Icon color="var(--color-light-4)" name="record" />
                </IconButton>
            ),
        },
        {
            text: (
                <Space direction="vertical" size={4} align="start">
                    <Typography>Jean Tsai</Typography>
                    <Typography variant="Caption" style={{ color: 'var(--color-light-4)' }}>
                        Last Updated 08/23/2023 6:14 PM
                    </Typography>
                </Space>
            ),
            icon: <Icon name="form" style={{ fontSize: 24, color: 'var(--color-light-5)' }} />,
        },
    ],
};
