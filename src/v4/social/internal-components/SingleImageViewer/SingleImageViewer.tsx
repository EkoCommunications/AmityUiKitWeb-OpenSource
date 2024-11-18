import React from 'react';
import useImage from '~/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton';

import styles from './SingleImageViewer.module.css';

interface SingleImageViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  fileId: string;
  onClose(): void;
}

export function SingleImageViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  fileId,
  onClose,
}: SingleImageViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const imageUrl = useImage({ fileId, imageSize: 'medium' });

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <img src={imageUrl} alt={fileId} className={styles.fullImage} />
          <span className={styles.closeButton}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.singleImageViewer__clearButton}
              imgClassName={styles.singleImageViewer__clearButton__img}
              onPress={onClose}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
