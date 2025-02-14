import clsx from 'clsx';
import React, { useEffect } from 'react';
import useImage from '~/core/hooks/useImage';
import { Button } from '~/v4/core/natives/Button';
import { Carousel } from '~/v4/core/components/Carousel';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import { CommunityCardImage } from '~/v4/social/elements/CommunityCardImage';
import { RecommendedCommunityCardSkeleton } from './RecommendedCommunityCardSkeleton';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton/CommunityJoinButton';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { CommunityJoinedButton } from '~/v4/social/elements/CommunityJoinedButton/CommunityJoinedButton';
import styles from './RecommendedCommunities.module.css';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type RecommendedCommunityCardProps = {
  pageId: string;
  componentId: string;
  community: Amity.Community;
  onClick: (communityId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onJoinButtonClick: (communityId: string) => void;
  onLeaveButtonClick: (communityId: string) => void;
};

const RecommendedCommunityCard = ({
  pageId,
  onClick,
  community,
  componentId,
  onCategoryClick,
  onJoinButtonClick,
  onLeaveButtonClick,
}: RecommendedCommunityCardProps) => {
  const avatarUrl = useImage({ fileId: community.avatarFileId, imageSize: 'medium' });

  return (
    <Button
      className={styles.recommendedCommunityCard}
      onPress={() => onClick(community.communityId)}
    >
      <div className={styles.recommendedCommunityCard__imageWrapper}>
        <CommunityCardImage
          pageId={pageId}
          imgSrc={avatarUrl}
          componentId={componentId}
          className={styles.recommendedCommunityCard__image}
        />
      </div>
      <div className={styles.recommendedCommunityCard__content}>
        <div className={styles.recommendedCommunities__contentTitle}>
          {!community.isPublic && (
            <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>
        <div className={styles.recommendedCommunityCard__bottom}>
          <div className={styles.recommendedCommunityCard__content__left}>
            <CommunityCategories
              truncate
              pageId={pageId}
              community={community}
              maxCategoriesLength={2}
              componentId={componentId}
              onClick={onCategoryClick}
              className={styles.recommendedCommunityCard__category}
            />
            <CommunityMembersCount
              pageId={pageId}
              componentId={componentId}
              memberCount={community.membersCount}
            />
          </div>
          <div className={styles.recommendedCommunities__content__right}>
            {community.isJoined ? (
              <CommunityJoinedButton
                pageId={pageId}
                componentId={componentId}
                onClick={() => onLeaveButtonClick(community.communityId)}
              />
            ) : (
              <CommunityJoinButton
                pageId={pageId}
                componentId={componentId}
                onClick={() => onJoinButtonClick(community.communityId)}
              />
            )}
          </div>
        </div>
      </div>
    </Button>
  );
};

interface RecommendedCommunitiesProps {
  pageId?: string;
}

export const RecommendedCommunities = ({ pageId = '*' }: RecommendedCommunitiesProps) => {
  const componentId = 'recommended_communities';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { goToCommunitiesByCategoryPage, goToCommunityProfilePage } = useNavigation();

  const {
    recommendedCommunities,
    isLoading,
    fetchRecommendedCommunities,
    refetchRecommendedCommunities,
  } = useExplore();

  useEffect(() => {
    fetchRecommendedCommunities();
  }, []);

  const { joinCommunity, leaveCommunity } = useCommunityActions({
    onJoinSuccess: () => {
      refetchRecommendedCommunities();
    },
  });

  const handleJoinButtonClick = (communityId: string) => {
    if (!online) {
      notification.info({
        content: 'Failed to join community. Please try again.',
      });
      return;
    }
    joinCommunity(communityId);
  };

  const handleLeaveButtonClick = (communityId: string) => {
    if (!online) {
      notification.info({
        content: 'Failed to leave community. Please try again.',
      });
      return;
    }
    leaveCommunity(communityId);
  };

  return (
    <Carousel
      scrollOffset={400}
      iconClassName={styles.recommendedCommunityCard__arrowIcon}
      isHidden={isLoading || recommendedCommunities.length < 3}
      leftArrowClassName={clsx(styles.recommendedCommunityCard__arrow, styles.left)}
      rightArrowClassName={clsx(styles.recommendedCommunityCard__arrow, styles.right)}
    >
      <div
        style={themeStyles}
        data-qa-anchor={accessibilityId}
        className={styles.recommendedCommunities}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <RecommendedCommunityCardSkeleton key={index} />
            ))
          : recommendedCommunities.length === 0
            ? null
            : recommendedCommunities.map((community) => (
                <RecommendedCommunityCard
                  pageId={pageId}
                  community={community}
                  componentId={componentId}
                  key={community.communityId}
                  onJoinButtonClick={handleJoinButtonClick}
                  onLeaveButtonClick={handleLeaveButtonClick}
                  onClick={(communityId) => goToCommunityProfilePage(communityId)}
                  onCategoryClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
                />
              ))}
      </div>
    </Carousel>
  );
};
