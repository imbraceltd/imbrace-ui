import 'simplebar-react/dist/simplebar.min.css';

import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import type { SxProps } from '@mui/system';
import { forwardRef, type ReactNode, type SyntheticEvent } from 'react';
import SimpleBar from 'simplebar-react';

import { Icon } from '../Icon';

export interface AccordionProps {
    expanded: boolean;
    onChange: ((event: SyntheticEvent<Element, Event>, expanded: boolean) => void) | undefined;
    title: ReactNode;
    children: ReactNode;
    sx?: SxProps;
    titleSx?: SxProps;
    detailsSx?: SxProps;
    expandIcon?: ReactNode;
    expandIconPosition?: 'left' | 'right';
    maxHeight?: number;
}
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
    const { expanded, onChange, title, children, sx, expandIcon, titleSx, detailsSx, expandIconPosition = 'left', maxHeight } = props;

    return (
        <MuiAccordion
            disableGutters
            square
            expanded={expanded}
            onChange={onChange}
            sx={{
                boxShadow: 0,
                overflowX: 'hidden',
                '&:before': { display: 'none' },
                ...sx,
            }}
            ref={ref}
        >
            <AccordionSummary
                expandIcon={expandIcon || <Icon name="dropDown" fontSize={16} style={{ color: 'var(--color-light-4)' }} />}
                sx={{
                    p: 0,
                    paddingRight: '16px',
                    paddingLeft: '4px',
                    padding: '16px 0',
                    color: 'var(--color-light-7)',
                    fontSize: 16,
                    fontWeight: 'bold',
                    lineHeight: '24px',
                    background: 'var(--color-primary-2)',
                    flexDirection: expandIconPosition === 'left' ? 'row-reverse' : 'row',
                    '& .MuiAccordionSummary-content': {
                        m: 0,
                        paddingLeft: expandIconPosition === 'left' ? '4px' : '0',
                        paddingRight: expandIconPosition === 'left' ? '0' : '4px',
                    },
                    ...titleSx,
                }}
            >
                {title}
            </AccordionSummary>
            <SimpleBar autoHide style={{ height: '100%', ...(maxHeight && { maxHeight: `${maxHeight}px` }) }}>
                <AccordionDetails sx={{ p: 0, padding: '8px 24px 16px 24px', ...detailsSx }}>{children}</AccordionDetails>
            </SimpleBar>
        </MuiAccordion>
    );
});
