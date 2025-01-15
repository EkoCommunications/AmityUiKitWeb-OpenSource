import clsx from 'clsx';
import React from 'react';
import Badge from '~/v4/icons/Badge';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './UserAvatar.module.css';

type UserAvatarProps = {
  pageId?: string;
  className?: string;
  componentId?: string;
  userId?: string | null;
  isShowModeratorBadge?: boolean;
  imageContainerClassName?: string;
  textPlaceholderClassName?: string;
};

export function UserAvatar({
  userId,
  className,
  pageId = '*',
  componentId = '*',
  imageContainerClassName,
  isShowModeratorBadge = false,
  textPlaceholderClassName = '',
}: UserAvatarProps) {
  const elementId = 'user_avatar';

  const { onClickUser } = useNavigation();
  const { user, isLoading } = useUser({ userId });
  const userImage = useImage({ fileId: user?.avatar?.fileId });
  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  const displayName = user?.displayName || user?.userId || '';
  const firstChar = displayName?.trim().charAt(0).toUpperCase();

  if (isLoading) return <div className={clsx(styles.userAvatar__skeleton, className)} />;

  if (!user || !userId || !userImage) {
    return (
      <Button
        className={clsx(styles.userAvatar__placeholder, className)}
        onPress={() => {
          if (userId) onClickUser(userId);
        }}
      >
        <Typography.Title
          className={clsx(styles.userAvatar__placeholder__text, textPlaceholderClassName)}
        >
          {firstChar}
        </Typography.Title>
        {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
      </Button>
    );
  }

  return (
    <Button
      onPress={() => onClickUser(userId)}
      className={clsx(styles.userAvatar__container, imageContainerClassName)}
    >
      <img
        src={userImage}
        data-qa-anchor={accessibilityId}
        className={clsx(styles.userAvatar__img, className)}
      />
      {isShowModeratorBadge && <Badge className={styles.userAvatar__badge} />}
    </Button>
  );
}
