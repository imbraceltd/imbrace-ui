import { Skeleton } from '@mui/material';

import { Space } from '../Space';

const TabsSkeleton = () => (
    <Space size={6}>
        <Space size={0} style={{ padding: '8px 12px' }}>
            <Skeleton variant="rectangular" width={60} height={24} />
            <Space
                size={0}
                direction="vertical"
                justify="between"
                style={{
                    padding: '6px',
                }}
            >
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
            </Space>
        </Space>
        <Space size={0} style={{ padding: '8px 12px' }}>
            <Skeleton variant="rectangular" width={80} height={24} />
            <Space
                size={0}
                direction="vertical"
                justify="between"
                style={{
                    padding: '6px',
                }}
            >
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
            </Space>
        </Space>
        <Space size={0} style={{ padding: '8px 12px' }}>
            <Skeleton variant="rectangular" width={75} height={24} />
            <Space
                size={0}
                direction="vertical"
                justify="between"
                style={{
                    padding: '6px',
                }}
            >
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
            </Space>
        </Space>
        <Space size={0} style={{ padding: '8px 12px' }}>
            <Skeleton variant="rectangular" width={90} height={24} />
            <Space
                size={0}
                direction="vertical"
                justify="between"
                style={{
                    padding: '6px',
                }}
            >
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
                <Skeleton variant="circular" width={3} height={3} />
            </Space>
        </Space>
    </Space>
);

export default TabsSkeleton;
