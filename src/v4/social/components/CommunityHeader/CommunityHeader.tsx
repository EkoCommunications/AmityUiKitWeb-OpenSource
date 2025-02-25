import React from 'react';
import styles from './CommunityHeader.module.css';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { CommunityPendingPost } from '~/v4/social/elements/CommunityPendingPost';
import { CommunityCover } from '~/v4/social/elements/CommunityCover';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton';
import { useCommunityInfo } from '~/v4/social/hooks/useCommunityInfo';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityDescription } from '~/v4/social/elements/CommunityDescription';
import { CommunityName } from '~/v4/social/elements/CommunityName';
import { CommunityInfo } from '~/v4/social/elements/CommunityInfo';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

interface CommunityProfileHeaderProps {
  pageId?: string;
  community: Amity.Community;
  isSticky?: boolean;
  page?: number;
}

export const CommunityHeader: React.FC<CommunityProfileHeaderProps> = ({
  pageId = '*',
  community,
  isSticky,
  page,
}) => {
  const componentId = 'community_header';
  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { currentUserId } = useSDK();
  const { online } = useNetworkState();
  const notification = useNotifications();

  const {
    avatarFileUrl,
    joinCommunity,
    pendingPostsCount,
    reviewingPosts,
    canReviewCommunityPosts,
  } = useCommunityInfo(community.communityId);

  const isPostOwner = reviewingPosts.some((post) => post.postedUserId === currentUserId);

  //TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
  const isShowPendingPost =
    community.isJoined &&
    pendingPostsCount > 0 &&
    reviewingPosts.length > 0 &&
    (canReviewCommunityPosts || isPostOwner) &&
    ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
      .needApprovalOnPostCreation ||
      community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED);

  return (
    <>
      <CommunityCover
        pageId={pageId}
        componentId={componentId}
        image={avatarFileUrl}
        community={community}
        onBack={() => onBack(page)}
        isSticky={!isDesktop && isSticky}
        onClickMenu={() => {
          AmityCommunityProfilePageBehavior?.goToCommunitySettingPage?.({
            community: community,
          });
        }}
      />
      <div className={styles.content}>
        <div className={styles.communityProfile__name}>
          {!community.isPublic && (
            <CommunityPrivateBadge
              pageId={pageId}
              componentId={componentId}
              className={styles.communityProfile__privateIcon}
            />
          )}
          <CommunityName pageId={pageId} componentId={componentId} name={community.displayName} />
          {community.isOfficial && (
            <CommunityOfficialBadge className={styles.communityProfile__privateIcon} />
          )}
        </div>

        <div className={styles.communityProfile__communityCategories}>
          <CommunityCategories
            pageId={pageId}
            componentId={componentId}
            community={community}
            minCategoryCharacters={10}
          />
        </div>

        <CommunityDescription
          pageId={pageId}
          componentId={componentId}
          description={community.description || ''}
        />

        <div className={styles.communityProfile__communityInfo__container}>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.postsCount}
            text={`post${community.postsCount === 1 ? '' : 's'}`}
          />
          <div className={styles.divider}></div>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.membersCount}
            text={`member${community.membersCount === 1 ? '' : 's'}`}
            onClick={() => {
              AmityCommunityProfilePageBehavior?.goToMembershipPage?.({
                community: community,
              });
            }}
          />
        </div>

        {!community.isJoined && community.isPublic && (
          <div className={styles.communityProfile__joinButton__container}>
            <CommunityJoinButton
              size="medium"
              pageId={pageId}
              onClick={() => {
                if (!online) {
                  notification.info({
                    content: 'Failed to join community. Please try again.',
                  });
                  return;
                }
                joinCommunity();
              }}
              componentId={componentId}
              className={styles.communityProfile__joinButton}
            />
          </div>
        )}
        <div>
          <StoryTab type="communityFeed" pageId={pageId} communityId={community.communityId} />
        </div>

        {isShowPendingPost && (
          <div className={styles.communityProfile__pendingPost__container}>
            <CommunityPendingPost
              pageId={pageId}
              componentId={componentId}
              pendingPostsCount={pendingPostsCount}
              onClick={() => {
                AmityCommunityProfilePageBehavior?.goToPendingPostPage?.({
                  communityId: community.communityId,
                });
              }}
              isPostOwner={isPostOwner}
              canReviewCommunityPosts={canReviewCommunityPosts}
            />
          </div>
        )}
      </div>

      <div className={styles.communityProfile__divider} />
    </>
  );
};
