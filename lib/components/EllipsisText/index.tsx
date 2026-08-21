import type { TooltipProps } from '@mui/material/Tooltip';
import type { CSSProperties, FC, ReactNode } from 'react';
import { cloneElement, isValidElement, useRef } from 'react';

import useIsTextOverflow from '../../hooks/useIsTextOverflow';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

export interface EllipsisTextProps {
    text: string | ReactNode;
    element?: ReactNode;
    className?: string;
    style?: CSSProperties;
    whiteSpace?: 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces';
    tooltipPlacement?: TooltipProps['placement'];
}

export const EllipsisText: FC<EllipsisTextProps> = (props) => {
    const { text, element, className, style, whiteSpace = 'nowrap', tooltipPlacement } = props;
    const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
    const isOverflow = useIsTextOverflow(ref, false, text);

    const customTypography = isValidElement(element)
        ? cloneElement(element, {
              ...element.props,
              style: {
                  ...element?.props?.style,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: whiteSpace,
                  wordBreak: 'break-word',
              },
              children: <>{text}</>,
              ref,
              key: text,
          })
        : null;

    return (
        <div style={{ overflow: 'hidden' }} className={className}>
            <Tooltip
                placement={tooltipPlacement}
                disableHoverListener={!isOverflow}
                disableFocusListener
                disableTouchListener
                arrow
                title={text}
            >
                {customTypography || (
                    <Typography
                        ref={ref}
                        variant="Inherit"
                        style={{
                            ...style,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                            whiteSpace: whiteSpace,
                            wordBreak: 'break-word',
                        }}
                    >
                        {text}
                    </Typography>
                )}
            </Tooltip>
        </div>
    );
};
