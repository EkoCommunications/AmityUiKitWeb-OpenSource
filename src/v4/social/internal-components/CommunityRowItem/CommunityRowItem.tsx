import React from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { CommunityRowImage } from '~/v4/social/elements/CommunityRowImage/CommunityRowImage';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton/CommunityJoinButton';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName/CommunityDisplayName';
import { CommunityMembersCount } from '~/v4/social/elements/CommunityMembersCount/CommunityMembersCount';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityJoinedButton } from '~/v4/social/elements/CommunityJoinedButton/CommunityJoinedButton';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge/CommunityOfficialBadge';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import styles from './CommunityRowItem.module.css';

type CommunityRowItemProps<TShowJoinButton extends boolean | undefined> = {
  community: Amity.Community;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  order?: number;
  minCategoryCharacters?: number;
  maxCategoryCharacters?: number;
  maxCategoriesLength?: number;
  showJoinButton?: TShowJoinButton;
  onClick: (communityId: string) => void;
  onCategoryClick: (categoryId: string) => void;
} & (TShowJoinButton extends true
  ? {
      onJoinButtonClick: (communityId: string) => void;
      onLeaveButtonClick: (communityId: string) => void;
    }
  : {
      onJoinButtonClick?: undefined | null;
      onLeaveButtonClick?: undefined | null;
    });

const formatOrder = (order: number) => (order < 10 ? `0${order}` : `${order}`);

export const CommunityRowItem = <T extends boolean | undefined>({
  order,
  onClick,
  community,
  pageId = '*',
  showJoinButton,
  onCategoryClick,
  elementId = '*',
  onJoinButtonClick,
  componentId = '*',
  onLeaveButtonClick,
  maxCategoriesLength,
  maxCategoryCharacters,
  minCategoryCharacters,
}: CommunityRowItemProps<T>) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const avatarUrl = useImage({ fileId: community.avatarFileId, imageSize: 'medium' });

  return (
    <Button
      type="button"
      style={themeStyles}
      key={community.communityId}
      className={styles.communityRowItem}
      onPress={() => onClick(community.communityId)}
      data-has-categories={community.categoryIds.length > 0}
    >
      <div className={styles.communityRowItem__image}>
        <CommunityRowImage pageId={pageId} componentId={componentId} imgSrc={avatarUrl} />
        {typeof order === 'number' ? (
          <Typography.BodyBold className={styles.communityRowItem__order}>
            {formatOrder(order)}
          </Typography.BodyBold>
        ) : null}
      </div>
      <div className={styles.communityRowItem__content}>
        <div className={styles.communityRowItem__communityName}>
          {!community.isPublic && (
            <CommunityPrivateBadge pageId={pageId} componentId={componentId} />
          )}
          <CommunityDisplayName pageId={pageId} componentId={componentId} community={community} />
          {community.isOfficial && (
            <CommunityOfficialBadge pageId={pageId} componentId={componentId} />
          )}
        </div>
        {community.categoryIds.length > 0 && (
          <CommunityCategories
            truncate
            pageId={pageId}
            community={community}
            componentId={componentId}
            onClick={onCategoryClick}
            maxCategoriesLength={maxCategoriesLength}
            minCategoryCharacters={minCategoryCharacters}
            maxCategoryCharacters={maxCategoryCharacters}
          />
        )}
        <CommunityMembersCount
          pageId={pageId}
          componentId={componentId}
          memberCount={community.membersCount}
        />
      </div>
      {!!showJoinButton &&
        (community.isJoined ? (
          <CommunityJoinedButton
            pageId={pageId}
            componentId={componentId}
            className={styles.communityRowItem__joinButton}
            data-has-categories={community.categoryIds.length > 0}
            onClick={() => onLeaveButtonClick?.(community.communityId)}
          />
        ) : (
          <CommunityJoinButton
            pageId={pageId}
            componentId={componentId}
            className={styles.communityRowItem__joinButton}
            data-has-categories={community.categoryIds.length > 0}
            onClick={() => onJoinButtonClick?.(community.communityId)}
          />
        ))}
    </Button>
  );
};
