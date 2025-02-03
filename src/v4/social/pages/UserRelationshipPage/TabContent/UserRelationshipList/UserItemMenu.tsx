import React, { FC } from 'react';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import BlockedUser from '~/v4/icons/BlockedUser';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import useUserReport from '~/v4/social/hooks/useUserReport';
import useUserReportedByMe from '~/v4/social/hooks/useUserReportedByMe';
import Flag from '~/v4/social/icons/flag';
import styles from './UserItem.module.css';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type UserItemMenuProps = {
  pageId?: string;
  user: Amity.User;
  componentId?: string;
  closePopover: () => void;
};

export const UserItemMenu: FC<UserItemMenuProps> = ({
  user,
  closePopover,
  pageId = '*',
  componentId = '*',
}) => {
  const { blockUser } = useUserBlock();
  const { removeDrawerData } = useDrawer();
  const { reportUser, unReportUser } = useUserReport();
  const { isReportedByMe, isFetching } = useUserReportedByMe(user.userId);
  const { online } = useNetworkState();
  const notification = useNotifications();

  return (
    <div className={styles.userItem__menuContainer}>
      {isFetching ? (
        Array.from({ length: 2 }).map((_, index) => (
          <div className={styles.userItem__menuButtonSkeleton} key={index} />
        ))
      ) : (
        <>
          <Button
            variant="text"
            data-qa-anchor={`${pageId}/${componentId}/report_user_button`}
            className={styles.userItem__menuButton}
            onPress={() => {
              closePopover();
              removeDrawerData();
              if (!online) {
                notification.info({
                  content: `Failed to ${isReportedByMe ? 'unreport' : 'report'} user. Please try again.`,
                });
                return;
              }
              if (isReportedByMe) unReportUser(user.userId);
              else reportUser(user.userId);
            }}
          >
            <Flag className={styles.userItem__menuButton__icon} />
            <Typography.BodyBold className={styles.userItem__menuButton__label}>
              {isReportedByMe ? 'Unreport user' : 'Report user'}
            </Typography.BodyBold>
          </Button>
          <Button
            variant="text"
            className={styles.userItem__menuButton}
            data-qa-anchor={`${pageId}/${componentId}/block_user_button`}
            onPress={() => {
              closePopover();
              removeDrawerData();
              if (!online) {
                notification.info({
                  content: 'Failed to block user. Please try again.',
                });
                return;
              }
              blockUser({
                pageId,
                componentId,
                userId: user.userId,
                displayName: user.displayName ?? '',
              });
            }}
          >
            <BlockedUser className={styles.userItem__menuButton__icon} />
            <Typography.BodyBold className={styles.userItem__menuButton__label}>
              Block user
            </Typography.BodyBold>
          </Button>
        </>
      )}
    </div>
  );
};
