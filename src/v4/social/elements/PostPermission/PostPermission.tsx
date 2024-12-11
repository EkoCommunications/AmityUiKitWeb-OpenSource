import clsx from 'clsx';
import React from 'react';
import { CheckTag } from '~/v4/icons/CheckTag';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components/Typography';
import styles from './PostPermission.module.css';

type PostPermissionProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const PostPermission = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: PostPermissionProps) => {
  const elementId = 'post_permission';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.postPermission__button}
    >
      <div className={styles.postPermission__leftWrap}>
        <IconComponent
          defaultIcon={() => (
            <CheckTag className={clsx(styles.postPermission__icon, defaultIconClassName)} />
          )}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIconName={defaultConfig.icon}
          configIconName={config.icon}
        />
        {config.text && <Typography.Body>{config.text}</Typography.Body>}
      </div>
      <ChevronRight className={styles.postPermission__angleRight} />
    </Button>
  );
};
