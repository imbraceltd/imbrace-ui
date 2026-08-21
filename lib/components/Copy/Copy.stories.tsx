import type { Meta, StoryFn } from '@storybook/react';

import { Copy, CopyButton, CopyText } from '.';
import { Icon } from '../Icon';
export default {
    title: 'Imbrace/Copy',
    component: Copy,
    subcomponents: { CopyButton },

    argTypes: {},
    args: {},
    parameters: {
        docs: { source: { type: 'dynamic' } },
    },
} as Meta<typeof Copy>;

const Template: StoryFn<typeof Copy> = (args) => {
    return <Copy {...args} />;
};
export const Default = Template.bind({});
Default.args = {
    displayText: 'https://imbrace.co/?id=qr_2e236f6e-b427-4707-b775-bdb1b3afb2f2&-sharing',
    copyText: 'Copy URL',
    copyIcon: <Icon name="linkSide" />,
    copyValue: 'https://imbrace.co/?id=qr_2e236f6e-b427-4707-b775-bdb1b3afb2f2&-sharing',
    typographyProps: {
        style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
        },
    },
};

const MultilineTemplate: StoryFn<typeof Copy> = (args) => {
    return (
        <div style={{ width: 500 }}>
            <Copy {...args} />
        </div>
    );
};
export const Multiline = MultilineTemplate.bind({});
Multiline.args = {
    displayText:
        '<form id="form1"> <input name="val1"/> <input name="val2" type="hidden" /> <input type="button" name="Submit Form 1 data including form 2" onsubmit="return copyFromForm2Function()"> </form> <form id="form2"> <input name="val2"/> <input type="button" name="Submit Form 2 ONLY"> </form>',
    copyText: 'Copy Code',
    copyIcon: <Icon name="copyCode" />,
    copyValue:
        '<form id="form1"> <input name="val1"/> <input name="val2" type="hidden" /> <input type="button" name="Submit Form 1 data including form 2" onsubmit="return copyFromForm2Function()"> </form> <form id="form2"> <input name="val2"/> <input type="button" name="Submit Form 2 ONLY"> </form>',
    typographyProps: {
        style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 4,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
        },
    },
    spaceProps: {
        align: 'start',
    },
    ellipsisTextProps: {
        whiteSpace: 'pre-wrap',
    },
};

const CopyButtonTemplate: StoryFn<typeof CopyButton> = (args) => {
    return <CopyButton {...args} />;
};
export const CopyButtonExample = CopyButtonTemplate.bind({});
CopyButtonExample.args = {
    copyText: 'Copy URL',
    copyIcon: <Icon name="linkSide" />,
    copyValue: 'https://imbrace.co/?id=qr_2e236f6e-b427-4707-b775-bdb1b3afb2f2&-sharing',
};
const CopyTextTemplate: StoryFn<typeof CopyText> = (args) => {
    return <CopyText {...args} />;
};
export const CopyTextExample = CopyTextTemplate.bind({});
CopyTextTemplate.args = {
    copyText: 'Copy URL',
    copyIcon: <Icon name="linkSide" />,
    copyValue: 'https://imbrace.co/?id=qr_2e236f6e-b427-4707-b775-bdb1b3afb2f2&-sharing',
};
