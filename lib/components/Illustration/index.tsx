import { Provider as UniqueIdGeneratorProvider } from '@inline-svg-unique-id/react';
import type { ReactNode, SVGProps } from 'react';
import { Suspense, useId, useMemo } from 'react';
import { lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Space } from '../Space';
import { Typography } from '../Typography';
import { IllustrationMapping } from './constant';
import styles from './index.module.scss';

export interface IllustrationProps extends SVGProps<SVGSVGElement> {
    name: keyof typeof IllustrationMapping;
    description?: string | ReactNode;
    size?: number;
}

export const Illustration = ({ name, size = 48, description, ...restProps }: IllustrationProps) => {
    const id = useId();
    const renderDescription = () => {
        if (description) {
            if (typeof description === 'string') {
                return <Typography variant="SubHeading2">{description}</Typography>;
            }
            return <div>{description}</div>;
        }
        return null;
    };
    const LazyIcon = useMemo(() => lazy(() => import(`./assets/${IllustrationMapping[name]}.svg?react`)), [name]);

    return (
        // @ts-expect-error children is not defined in the UniqueIdGeneratorProvider
        <UniqueIdGeneratorProvider idPrefix={`illustration-${name}-${id}`}>
            <Space size={size} justify="center" direction="vertical" className={styles.illustration}>
                <ErrorBoundary fallbackRender={() => <svg style={{ width: '500px', height: '400px', ...restProps.style }} />}>
                    <Suspense fallback={<svg style={{ width: '500px', height: '400px', ...restProps.style }} />}>
                        {<LazyIcon {...restProps} />}
                    </Suspense>
                </ErrorBoundary>
                {renderDescription()}
            </Space>
        </UniqueIdGeneratorProvider>
    );
};
