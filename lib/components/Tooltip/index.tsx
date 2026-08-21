import styled from '@mui/material/styles/styled';
import type { TooltipProps } from '@mui/material/Tooltip';
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip';

export const Tooltip = styled(({ className, ...props }: TooltipProps) => <MuiTooltip {...props} classes={{ popper: className }} />)(() => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: 'var(--color-light-3)',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--color-light-3)',
        padding: '8px 12px',
        boxShadow: 'none',
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 400,
        color: 'var(--color-light-7)',
        borderRadius: '4px',
        maxWidth: '333px',
    },
    zIndex: 1000000,
})) as typeof MuiTooltip;
