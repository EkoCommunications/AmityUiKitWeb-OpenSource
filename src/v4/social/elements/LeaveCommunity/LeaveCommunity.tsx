import React from 'react';
import styles from './LeaveCommunity.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';

type LeaveCommunityProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
};

export const LeaveCommunity = ({
  pageId = '*',
  componentId = '*',
  onClick,
}: LeaveCommunityProps) => {
  const elementId = 'leave_community';
  const { themeStyles, isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.leaveCommunity__button}
    >
      {config.text && (
        <Typography.BodyBold className={styles.leaveCommunity__text}>
          {config.text}
        </Typography.BodyBold>
      )}
    </Button>
  );
};
