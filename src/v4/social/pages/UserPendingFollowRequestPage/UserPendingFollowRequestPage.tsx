import React from 'react';
import styles from './UserPendingFollowRequestPage.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import useFollowersCollection from '~/v4/core/hooks/collections/useFollowersCollection';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import useSDK from '~/v4/core/hooks/useSDK';
import { PendingUserItem } from './PendingUserItem/PendingUserItem';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent/EmptyContent';
import PartyHorn from '~/icons/PartyHorn';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

export const UserPendingFollowRequestPage = () => {
  const pageId = 'user_pending_follow_request_page';
  const { currentUserId } = useSDK();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { onBack } = useNavigation();
  const { pendingCount } = useFollowCount(currentUserId);
  const { isDesktop } = useResponsive();
  const { followers } = useFollowersCollection({
    userId: currentUserId,
    status: 'pending',
  });

  return (
    <div
      className={styles.userPendingFollowRequestPage}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      <div className={styles.userPendingFollowRequestPage__container}>
        <div className={styles.userPendingFollowRequestPage__topBar}>
          <BackButton pageId={pageId} onPress={() => onBack()} />
          <Typography.TitleBold className={styles.userPendingFollowRequestPage__topBar__text}>
            Follow requests ({pendingCount})
          </Typography.TitleBold>
        </div>
        <div className={styles.userPendingFollowRequestPage__description}>
          <Typography.Caption>
            Declining a follow request is irreversible. The user must send a new request if
            declined.
          </Typography.Caption>
        </div>
        {followers && followers.length === 0 ? (
          <div className={styles.userPendingFollowRequestPage__noPending}>
            <EmptyContent
              pageId={pageId}
              defaultIcon={() => (
                <PartyHorn className={styles.userPendingFollowRequestPage__noPending__icon} />
              )}
              text="No requests to review"
            />
          </div>
        ) : (
          <div>
            {followers.map((follower, index) => (
              <div key={follower.to}>
                <PendingUserItem userId={follower.from} />
                {index !== followers.length - 1 && !isDesktop && (
                  <div className={styles.userPendingFollowRequestPage__devider}></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
