import React, { useRef } from 'react';
import styles from './CommunitySearchResult.module.css';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityCategoryName } from '~/v4/social/elements/CommunityCategoryName';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useCategoriesByIds from '~/social/hooks/useCategoriesByIds';

const CommunityCategories = ({
  community,
  pageId,
  componentId,
}: {
  community: Amity.Community;
  pageId: string;
  componentId: string;
}) => {
  const categories = useCategoriesByIds(community.categoryIds);

  return (
    <>
      {categories.map((category) => (
        <CommunityCategoryName
          pageId={pageId}
          componentId={componentId}
          categoryName={category.name}
        />
      ))}
    </>
  );
};

interface CommunitySearchResultProps {
  pageId?: string;
  communityCollection: Amity.Community[];
  onLoadMore: () => void;
}

export const CommunitySearchResult = ({
  pageId = '*',
  communityCollection = [],
  onLoadMore,
}: CommunitySearchResultProps) => {
  const componentId = 'community_search_result';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  const intersectionRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({ onIntersect: () => onLoadMore(), ref: intersectionRef });

  return (
    <div className={styles.communitySearchResult} style={themeStyles}>
      {communityCollection.map((community: Amity.Community) => (
        <div key={community.communityId} className={styles.communitySearchResult__communityItem}>
          <div className={styles.communitySearchResult__communityItem__leftPane}>
            <CommunityAvatar pageId={pageId} componentId={componentId} community={community} />
          </div>
          <div className={styles.communitySearchResult__communityItem__rightPane}>
            <div className={styles.communityItem__communityName}>
              {!community.isPublic && (
                <div className={styles.communityItem__communityName__private}>
                  <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
                </div>
              )}
              <CommunityDisplayName
                pageId={pageId}
                componentId={componentId}
                community={community}
              />
              {community.isOfficial && (
                <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
              )}
            </div>
            <div className={styles.communityItem__communityCategory}>
              <CommunityCategories
                pageId={pageId}
                componentId={componentId}
                community={community}
              />
            </div>
            <div className={styles.communityItem__communityMemberCount}>
              <CommunityMembersCount
                pageId={pageId}
                componentId={componentId}
                memberCount={community.membersCount}
              />
            </div>
          </div>
        </div>
      ))}
      <div ref={intersectionRef} />
    </div>
  );
};
