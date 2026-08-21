import { keepPreviousData, useQuery } from '@tanstack/react-query';
import SimpleBar from 'simplebar-react';

import { Spin } from '../Spin';

interface Props {
    url?: string;
}

const CsvViewer = ({ url }: Props) => {
    const handleReadRemoteFile = async () => {
        try {
            if (!url) {
                throw new Error('no csv url provided');
            }
            const response = await fetch(url);
            const text = await response.text();
            // split the text by newline
            const lines = text.split('\n');
            // map through all the lines and split each line by comma.
            return lines.map((line) => line.split(','));
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading } = useQuery({
        queryFn: () => handleReadRemoteFile(),
        queryKey: ['knowledge-base', url],
        placeholderData: keepPreviousData,
        enabled: !!url,
    });

    const headers = data?.[0];
    const rows = data?.slice(1);

    return (
        <SimpleBar style={{ height: '100%', width: '100%', backgroundColor: 'var(--color-light-1)' }}>
            <Spin isSpinning={isLoading}>
                <table
                    style={{
                        width: 'max-content',
                        height: 'max-content',
                        overflow: 'auto',
                        padding: '8px',
                        backgroundColor: 'var(--color-light-1)',
                    }}
                >
                    <thead>
                        <tr>
                            {headers?.map((header, i) => (
                                <th key={i} style={{ textAlign: 'left' }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows?.map((rowData, i) => {
                            return (
                                <tr key={i}>
                                    {rowData?.map((el, idx) => {
                                        return <td key={idx}>{el}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Spin>
        </SimpleBar>
    );
};
export default CsvViewer;
