import CircularProgress from '@mui/material/CircularProgress';
import type { ForwardedRef } from 'react';
import { forwardRef, type ReactNode } from 'react';

import styles from './index.module.scss';

export interface SpinProps {
    isSpinning?: boolean;
    children?: ReactNode;
}

export const SpinComponent = ({ isSpinning, children }: SpinProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={`${styles.container}`}>
            <div className={`${styles.inner} ${isSpinning ? styles.blur : ''}`}>{children}</div>
            {isSpinning && (
                <div className={styles.loadingContainer}>
                    <CircularProgress size={'25px'} />
                </div>
            )}
        </div>
    );
};

export const Spin = forwardRef<HTMLDivElement, SpinProps>(SpinComponent);
