import type { Meta, StoryFn } from '@storybook/react';

import { Spin } from '.';
import { Typography } from '../Typography';
import { Space } from '../Space';

export default {
    title: 'Imbrace/Spin',
    component: Spin,

    argTypes: {
        isSpinning: {
            type: 'boolean',
            defaultValue: false,
        },
        children: {
            type: 'symbol',
        },
    },
    args: {
        isSpinning: false,
    },
    parameters: {
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Spin>;

const Template: StoryFn<typeof Spin> = (args) => {
    return (
        <>
            <div style={{ width: 220, height: '100%', padding: 10, border: '1px solid skyblue', borderRadius: 10 }}>
                <Spin {...args}>
                    <Space direction="vertical">
                        <Typography>hihihih</Typography>
                        <div style={{ width: 200, height: 200, background: 'skyblue', borderRadius: 5 }}></div>
                    </Space>
                </Spin>
            </div>
            <Typography style={{ marginTop: 10 }}>
                control <mark>isSpinning</mark> from control panel
            </Typography>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {};
