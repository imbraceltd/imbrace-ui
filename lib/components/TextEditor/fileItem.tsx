import CircularProgress from '@mui/material/CircularProgress';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import { prettySize } from '../../utils';
import { EllipsisText } from '../EllipsisText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Space } from '../Space';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';
import type { Attachment, FileStatus } from '../Upload/types';
import styles from './index.module.scss';

interface FileItemProps {
    attachment: Attachment;
    onUpload?: (file: File) => Promise<{ url: string; id: string; name: string; size?: number }>;
    onDelete?: (fileId: string) => Promise<unknown>;
    onStatusChange: (
        payload: { id: string; fileId?: string; status: FileStatus; error?: string; url?: string; name?: string; size?: number },
        silent?: boolean,
    ) => void;
    onGetInfo?: (fileId: string) => Promise<{ url?: string; id: string; name?: string; size?: number }>;
    removeAttachFile: (attachmentId: string) => void;
    showFileSize?: boolean;
}

const FileItem = (props: FileItemProps) => {
    const { attachment, onStatusChange, removeAttachFile, onUpload, onDelete, showFileSize, onGetInfo } = props;

    const getFile = useMutation({
        mutationKey: ['getFile', attachment.id],
        mutationFn: async () => {
            if (onGetInfo && attachment.status === 'ok') {
                const data = await onGetInfo(attachment.id);
                return data;
            }

            return undefined;
        },
        onSuccess: (data) => {
            onStatusChange({ id: attachment.id, fileId: data?.id, status: 'ok', url: data?.url, name: data?.name, size: data?.size }, true);
        },
        onError: (error) => {
            onStatusChange({ id: attachment.id, status: 'missingFile', error: error.message });
        },
    });

    const uploadFile = useMutation({
        mutationKey: ['uploadFile', attachment.id],
        mutationFn: async (file: File) => {
            if (onUpload) {
                const data = await onUpload(file);
                return data;
            }

            return undefined;
        },
        onMutate: () => {
            onStatusChange({ id: attachment.id, status: 'uploading' });
        },
        onSuccess: (data) => {
            onStatusChange({ id: attachment.id, fileId: data?.id, status: 'ok', url: data?.url, size: data?.size });
        },
        onError: (error) => {
            onStatusChange({ id: attachment.id, status: 'uploadError', error: error.message });
        },
    });

    const deleteFile = useMutation({
        mutationKey: ['deleteFile', attachment.id],
        mutationFn: async (fileId: string) => {
            if (onDelete) {
                await onDelete(fileId);
                return true;
            }
            return true;
        },
        onMutate: () => {
            onStatusChange({ id: attachment.id, status: 'deleting' });
        },
        onSuccess: () => {
            onStatusChange({ id: attachment.id, status: 'deleted' });
        },
        onError: (error) => {
            onStatusChange({ id: attachment.id, status: 'deleted', error: error.message });
        },
    });

    const removeFile = async () => {
        try {
            if (deleteFile.isIdle && attachment.status === 'ok') {
                await deleteFile.mutateAsync(attachment.fileId || attachment.id);
            }
            removeAttachFile(attachment.id);
        } catch (error) {
            console.log(error);
            removeAttachFile(attachment.id);
        }
    };

    useEffect(() => {
        if (attachment.status === 'pending' && uploadFile.isIdle && attachment.file) {
            uploadFile.mutate(attachment.file);
        }
    }, [uploadFile, attachment]);

    useEffect(() => {
        if (onGetInfo && attachment.status === 'ok' && getFile.isIdle && (!attachment.url || !attachment.name || !attachment.size)) {
            getFile.mutate();
        }
    }, [onGetInfo, getFile, attachment]);

    const getFileSize = (size?: number) => {
        if (!size) {
            return null;
        }

        return <Typography variant="BodyTight" style={{ whiteSpace: 'nowrap' }}>{`(${prettySize(size)})`}</Typography>;
    };

    return (
        <Tooltip arrow placement="top" title={attachment.error} disableHoverListener={!attachment.error}>
            <div>
                <Space justify="between" align="center" className={`${styles.file} ${attachment.error ? styles.error : ''}`}>
                    <Space size={8} style={{ overflow: 'hidden' }}>
                        <Space>
                            <Icon name="file" style={{ color: 'var(--color-light-5)' }} />
                        </Space>
                        <Space size={4} style={{ overflow: 'hidden' }}>
                            <EllipsisText element={<Typography variant="BodyTight" />} text={attachment.name} />
                            {showFileSize && getFileSize(attachment.size || attachment.file?.size)}
                        </Space>
                    </Space>
                    {uploadFile.isPending || deleteFile.isPending ? (
                        <CircularProgress size={12} sx={{ color: 'var(--color-secondary-1)' }} />
                    ) : (
                        <IconButton size={'xs'} variant="text" type="secondary" onClick={() => removeFile()}>
                            <Icon name="close" style={{ fontSize: '12px' }} />
                        </IconButton>
                    )}
                </Space>{' '}
            </div>
        </Tooltip>
    );
};

export default FileItem;
