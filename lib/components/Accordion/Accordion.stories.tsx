import { action } from '@storybook/addon-actions';
import { Accordion } from '.';
import { Meta, StoryFn } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { Space } from '../Space';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Illustration } from '../Illustration';

export default {
    title: 'Imbrace/Accordion',
    component: Accordion,
    argTypes: {
        expanded: { control: 'boolean' },
        onChange: { action: 'change' },
        title: { control: 'text' },
        children: { control: 'text' },
        expandIconPosition: { control: 'radio', options: ['left', 'right'] },
    },
} as Meta<typeof Accordion>;

const Template: StoryFn<typeof Accordion> = (args) => {
    const [{ expanded, expanded2, expanded3 }, updateArgs] = useArgs();
    return (
        <>
            <Accordion {...args} expanded={expanded} onChange={(e, isExpanded) => updateArgs({ expanded: isExpanded })}>
                <Illustration size={8} name="recordMissing2" description="Record Missing" style={{ width: '180px', height: 'auto' }} />
            </Accordion>
            <Accordion {...args} expanded={expanded2} maxHeight={300} onChange={(e, isExpanded) => updateArgs({ expanded2: isExpanded })}>
                <div style={{ width: '100%', height: '500px', backgroundColor: 'lightblue' }}></div>
            </Accordion>
            <Accordion {...args} expanded={expanded3} onChange={(e, isExpanded) => updateArgs({ expanded3: isExpanded })}>
                <Illustration size={8} name="recordMissing2" description="Record Missing" style={{ width: '180px', height: 'auto' }} />
            </Accordion>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    expanded: false,
    onChange: action('change'),
    title: (
        <Space justify="between" align="center" style={{ width: '100%' }}>
            {'Accordion Title'}
            <Button size="xs" variant="link" startIcon={<Icon name="newRecord" />} text="Add" onClick={(e) => e.stopPropagation()} />
        </Space>
    ),
    children: 'Accordion Content',
    expandIconPosition: 'left',
};
