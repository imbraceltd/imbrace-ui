import 'simplebar-react/dist/simplebar.min.css';

import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import SimpleBar from 'simplebar-react';

import type { EllipsisTextProps } from '../EllipsisText';
import { EllipsisText } from '../EllipsisText';
import type { SpaceProps } from '../Space';
import { Space } from '../Space';
import styles from './index.module.scss';

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
    items: {
        icon?: ReactNode;
        text: string | ReactNode;
        ellipsisTextProps?: Omit<EllipsisTextProps, 'text'>;
    }[];
    itemContainerProps?: Omit<SpaceProps, 'children'>;
}

export const List = forwardRef<HTMLDivElement, ListProps>((props, ref) => {
    const { items, itemContainerProps, ...restProps } = props;

    return (
        <SimpleBar
            autoHide
            style={{ width: '100%', height: '100%' }}
            scrollableNodeProps={{
                ref,
                ...restProps,
                className: `${styles.list} ${restProps.className ?? ''}`,
            }}
        >
            <div className={styles.container}>
                {items?.map((item, index) => (
                    <Space
                        key={`Imbrace-ListItem-${index}`}
                        size={12}
                        align="center"
                        {...itemContainerProps}
                        className={`${styles.listItem} ${itemContainerProps?.className}`}
                    >
                        {item.icon}
                        {typeof item.text === 'object' ? (
                            item.text
                        ) : (
                            <EllipsisText
                                text={item.text}
                                {...item.ellipsisTextProps}
                                style={{ fontSize: 14, color: 'var(--color-light-7)', ...item.ellipsisTextProps?.style }}
                            />
                        )}
                    </Space>
                ))}
            </div>
        </SimpleBar>
    );
});
