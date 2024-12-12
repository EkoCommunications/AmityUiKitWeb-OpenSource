import React, { useState } from 'react';
import styles from './UserProfileHeader.module.css';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { UserFollowing } from '~/v4/social/elements/UserFollowing/UserFollowing';
import { UserFollower } from '~/v4/social/elements/UserFollower/UserFollower';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserName } from '~/v4/social/elements/UserName/UserName';
import { UserDescription } from '~/v4/social/elements/UserDescription/UserDescription';
import UserOfficialBadge from '~/v4/icons/UserOfficialBadge';
import useSDK from '~/v4/core/hooks/useSDK';
import { FollowUserButton } from '~/v4/social/elements/FollowUserButton';
import { FollowingUserButton } from '~/v4/social/elements/FollowingUserButton';
import { PendingUserButton } from '~/v4/social/elements/PendingUserButton';
import { UnblockUserButton } from '~/v4/social/elements/UnblockUserButton/UnblockUserButton';
import useFollowCount from '~/v4/core/hooks/objects/useFollowCount';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import NotificationIndicator from '~/v4/icons/NotificationIndicator';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useUserFollow from '~/v4/social/hooks/useUserFollow';
import UnfollowUser from '~/v4/icons/UnfollowUser';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import useUserBlock from '~/v4/social/hooks/useUserBlock';
import { SingleImageViewer } from '~/v4/social/internal-components/SingleImageViewer';

interface UserProfileHeaderProps {
  user?: Amity.User | null;
  pageId?: string;
}

const UserProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className={styles.userProfileHeader__skeleton}>
      <div className={styles.userProfileHeader__skeleton__header}>
        <div className={styles.userProfileHeader__skeleton__avatar}></div>
        <div className={styles.userProfileHeader__skeleton__displayName}></div>
      </div>
      <div>
        <div className={styles.userProfileHeader__skeleton__about}></div>
        <div className={styles.userProfileHeader__skeleton__about}></div>
      </div>
      <div className={styles.userProfileHeader__skeleton__relationship}>
        <div className={styles.userProfileHeader__skeleton__relationship__text}></div>
        <div className={styles.userProfileHeader__skeleton__relationship__text}></div>
      </div>
    </div>
  );
};

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user, pageId = '*' }) => {
  const componentId = 'user_profile_header';
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const { currentUserId } = useSDK();
  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });
  const { AmityUserProfileHeaderComponentBehavior } = usePageBehavior();
  const { followStatus, pendingCount } = useFollowCount(user?.userId);
  const { followUser, unFollowUser, cancelFollow } = useUserFollow();
  const { unblockUser } = useUserBlock();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const onPressFollowingButton = (userId: string) => {
    setDrawerData({
      content: (
        <Button
          className={styles.userProfileHeader__unFollowButton}
          onPress={() => {
            removeDrawerData();
            unFollowUser({ pageId, userId });
          }}
        >
          <UnfollowUser className={styles.userProfileHeader__unFollowButton__icon} />
          <Typography.BodyBold className={styles.userProfileHeader__unFollowButton__text}>
            Unfollow
          </Typography.BodyBold>
        </Button>
      ),
    });
  };

  const isShowPendingButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'pending';
  const isShowFollowButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'none';
  const isShowFollowingButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'accepted';

  const isShowUnBlockButton =
    currentUserId && user && currentUserId !== user.userId && followStatus === 'blocked';

  if (!user) return <UserProfileHeaderSkeleton />;

  return (
    <div
      className={styles.userProfileHeader__container}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      <div className={styles.userProfileHeader__header}>
        <Button variant="text" onPress={() => setIsImageViewerOpen(true)}>
          <UserAvatar
            userId={user.userId}
            className={styles.userProfileHeader__avatar}
            textPlaceholderClassName={styles.userProfileHeader__avatar__placeholder}
            pageId={pageId}
            componentId={componentId}
          />
        </Button>
        <UserName
          name={user.displayName ?? user.userId}
          pageId={pageId}
          componentId={componentId}
        />
        {user.isBrand && (
          <div className={styles.userProfileHeader__badge__container}>
            <UserOfficialBadge className={styles.userProfileHeader__badge} />
          </div>
        )}
      </div>

      <UserDescription description={user.description} pageId={pageId} componentId={componentId} />

      <div className={styles.userProfileHeader__relationship}>
        <UserFollowing userId={user.userId} pageId={pageId} componentId={componentId} />
        <div className={styles.userProfileHeader__relationship__separator}></div>
        <UserFollower userId={user.userId} pageId={pageId} componentId={componentId} />
      </div>
      {pendingCount > 0 && (
        <Button
          className={styles.pendingCountButton}
          onPress={() => AmityUserProfileHeaderComponentBehavior?.goToPendingFollowRequestPage?.()}
        >
          <div className={styles.pendingCountButton__inner}>
            <div className={styles.pendingCountButton__notification}>
              <NotificationIndicator className={styles.pendingCountButton__notification__icon} />
              <Typography.BodyBold className={styles.pendingCountButton__notification__text}>
                New follow requests
              </Typography.BodyBold>
            </div>
            <div>
              <Typography.Caption>{`${pendingCount} request${pendingCount > 0 ? 's' : ''} need your approval`}</Typography.Caption>
            </div>
          </div>
        </Button>
      )}

      {isShowFollowButton && (
        <FollowUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => followUser(user.userId)}
        />
      )}

      {isShowFollowingButton && (
        <FollowingUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => {
            onPressFollowingButton(user.userId);
          }}
        />
      )}

      {isShowPendingButton && (
        <PendingUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() => cancelFollow(user.userId)}
        />
      )}

      {isShowUnBlockButton && (
        <UnblockUserButton
          pageId={pageId}
          componentId={componentId}
          onClick={() =>
            unblockUser({
              pageId,
              componentId,
              userId: user.userId,
              displayName: user.displayName ?? user.userId,
            })
          }
        />
      )}

      {isImageViewerOpen && user.avatarFileId && (
        <SingleImageViewer
          fileId={user.avatarFileId}
          onClose={() => setIsImageViewerOpen(false)}
          pageId={pageId}
          componentId={componentId}
        />
      )}
    </div>
  );
};
