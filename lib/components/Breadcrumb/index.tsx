import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Space } from '../Space';

type Crumb = {
    title: string | ReactNode;
    onClick?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>, path: string) => void;
    path: string;
    disabled?: boolean;
    buttonProps?: Omit<ButtonProps, 'disabled' | 'onClick'>;
};

export interface BreadcrumbProps {
    items: Crumb[];
    separator?: string | ReactNode;
    separatorStyles?: CSSProperties;
    isActive?: (path: string) => Promise<boolean> | boolean;
}

export const Breadcrumb = (props: BreadcrumbProps) => {
    const { items, separator = '/', separatorStyles, isActive } = props;

    return (
        <Space
            size={4}
            align="center"
            style={{
                userSelect: 'none',
            }}
            wrap
        >
            {items.map((item, index) => {
                return (
                    <Space size={4} align="center" justify="center">
                        {index !== 0 &&
                            (typeof separator === 'object' ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        lineHeight: '20px',
                                        color: 'var(--color-light-4)',
                                        ...separatorStyles,
                                    }}
                                >
                                    {separator}
                                </div>
                            ) : (
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        lineHeight: '20px',
                                        color: 'var(--color-light-4)',
                                        ...separatorStyles,
                                    }}
                                >
                                    {separator}
                                </span>
                            ))}
                        <Button
                            type="secondary"
                            variant="link"
                            size="xs"
                            onClick={(e) => item.onClick?.(e, item.path)}
                            text={item.title}
                            disabled={item.disabled}
                            {...item.buttonProps}
                            sx={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: '20px',
                                padding: 0,
                                ...(isActive?.(item.path) &&
                                    !item.disabled && {
                                        color: 'var(--color-light-7)',
                                    }),

                                ...item.buttonProps?.sx,
                            }}
                        />
                    </Space>
                );
            })}
        </Space>
    );
};
