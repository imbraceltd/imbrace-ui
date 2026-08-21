import type { DividerProps } from '@mui/material/Divider';
import Divider from '@mui/material/Divider';
import type { ForwardedRef } from 'react';
import { type CSSProperties, forwardRef, type HTMLAttributes, type ReactNode, type RefObject } from 'react';

import styles from './index.module.scss';

export type Direction = 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
    direction?: Direction;
    children: ReactNode;
    size?: number | [number, number];
    align?: 'center' | 'start' | 'end' | 'stretch';
    justify?: 'between' | 'start' | 'end' | 'center' | 'stretch';
    divider?: boolean;
    /**
     * Divider props
     */
    dividerProps?: DividerProps;
    className?: string;
    wrap?: boolean;
    style?: CSSProperties;
    containerRef?: RefObject<HTMLDivElement> | ((ref: HTMLDivElement | null) => void);
}
interface SpaceItemProps {
    direction?: Direction;
    children: ReactNode;
    divider?: boolean;
    isLast: boolean;
    dividerProps?: DividerProps;
}

const stylesMapping = {
    horizontal: styles.horizontal,
    vertical: styles.vertical,
    'horizontal-reverse': styles.horizontalReverse,
    'vertical-reverse': styles.verticalReverse,
    center: styles.align_center,
    start: styles.align_start,
    end: styles.align_end,
    stretch: styles.align_stretch,
    justify_center: styles.justify_center,
    justify_start: styles.justify_start,
    justify_end: styles.justify_end,
    justify_between: styles.justify_between,
    justify_stretch: styles.justify_stretch,
};

const SpaceItem = ({ children, divider, dividerProps, isLast, direction = 'horizontal' }: SpaceItemProps) => {
    if (!children) {
        return null;
    }
    return (
        <>
            {children}
            {divider && !isLast && (
                <Divider
                    flexItem
                    orientation={direction === 'horizontal' || direction === 'horizontal-reverse' ? 'vertical' : 'horizontal'}
                    {...dividerProps}
                />
            )}
        </>
    );
};
const SpaceComponent = (props: SpaceProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
        direction = 'horizontal',
        align = 'center',
        justify = 'start',
        children,
        size = 10,
        divider,
        dividerProps,
        className,
        wrap,
        style,
        containerRef,
        ...restProps
    } = props;

    const renderChildren = () => {
        if (Array.isArray(children)) {
            return children.map((child, index) => (
                <SpaceItem
                    key={`space-item-${index}`}
                    divider={divider}
                    direction={direction}
                    dividerProps={dividerProps}
                    isLast={index === children.length - 1}
                >
                    {child}
                </SpaceItem>
            ));
        }
        return [children].map((child, index) => (
            <SpaceItem key={`space-item-${index}`} divider={divider} direction={direction} dividerProps={dividerProps} isLast>
                {child}
            </SpaceItem>
        ));
    };

    return (
        <div
            ref={ref || containerRef}
            className={`${styles.space} ${stylesMapping[direction]} ${stylesMapping[align]} ${stylesMapping[`justify_${justify}`]} ${
                className ?? ''
            }`}
            style={
                {
                    '--space-gap': typeof size === 'number' ? `${size}px` : `${size.map((s) => `${s}px`).join(' ')}`,
                    flexWrap: wrap ? 'wrap' : 'nowrap',
                    ...style,
                } as CSSProperties
            }
            {...restProps}
        >
            {renderChildren()}
        </div>
    );
};

export const Space = forwardRef<HTMLDivElement, SpaceProps>(SpaceComponent);
