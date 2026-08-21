import type { HTMLAttributes } from 'react';
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { VariantMapping } from './constant';

export interface TypographyProps extends HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
    variant?: keyof typeof VariantMapping;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export const Typography = forwardRef<HTMLHeadingElement | HTMLParagraphElement, TypographyProps>(
    ({ variant = 'Body', children, className, ...restProps }, ref) => {
        const render = () => {
            switch (variant) {
                case 'Heading1':
                    return (
                        <h1 className={`${VariantMapping[variant]} ${className || ''}`} ref={ref} {...restProps}>
                            {children}
                        </h1>
                    );
                case 'Heading2':
                    return (
                        <h2 className={`${VariantMapping[variant]} ${className || ''}`} ref={ref} {...restProps}>
                            {children}
                        </h2>
                    );
                case 'SubHeading1':
                case 'SubHeading2':
                case 'SubHeading2Tight':
                    return (
                        <h3 className={`${VariantMapping[variant]} ${className || ''}`} ref={ref} {...restProps}>
                            {children}
                        </h3>
                    );
                case 'SubHeading2Light':
                    return (
                        <h3 className={`${VariantMapping[variant]} ${className || ''}`} ref={ref} {...restProps}>
                            {children}
                        </h3>
                    );
                case 'Inherit':
                    return (
                        <p className={`${VariantMapping[variant]} ${className || ''}`} ref={ref} {...restProps}>
                            {children}
                        </p>
                    );
                case 'Caption':
                case 'CaptionBold':
                case 'Body':
                case 'BodyBold':
                case 'BodyTight':
                default:
                    return (
                        <p className={`${VariantMapping[variant]} ${className || ''}`} ref={ref} {...restProps}>
                            {children}
                        </p>
                    );
            }
        };
        return render();
    },
);
