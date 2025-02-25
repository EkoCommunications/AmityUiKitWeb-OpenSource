import React from 'react';
import Truncate from 'react-truncate-markup';
import { FileTrigger } from 'react-aria-components';
import { StoryRing } from '~/v4/social/elements/StoryRing/StoryRing';
import clsx from 'clsx';
import { useGetActiveStoriesByTarget } from '~/v4/social/hooks/useGetActiveStories';
import { useCommunityInfo } from '~/v4/social/hooks/useCommunityInfo';
import { CreateNewStoryButton } from '~/v4/social/elements/CreateNewStoryButton';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import styles from './StoryTabCommunity.module.css';
import { Typography } from '~/v4/core/components';
import { canCreatePostCommunity } from '~/v4/social/utils';
import useSDK from '~/v4/core/hooks/useSDK';

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="7.25" fill="#FA4D30" stroke="#fff" strokeWidth="1.5"></circle>
      <path
        fill="#fff"
        d="M9.25 10.75C9.25 11.453 8.687 12 8 12c-.703 0-1.25-.547-1.25-1.25 0-.688.547-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25zM6.89 4.406A.378.378 0 017.267 4h1.453c.219 0 .39.188.375.406l-.203 4.25A.387.387 0 018.516 9H7.469a.387.387 0 01-.375-.344l-.203-4.25z"
      ></path>
    </svg>
  );
};

interface StoryTabCommunityFeedProps {
  pageId?: string;
  componentId?: string;
  communityId: string;
  onStoryClick: () => void;
  onFileChange: (file: File | null) => void;
}

export const StoryTabCommunityFeed: React.FC<StoryTabCommunityFeedProps> = ({
  pageId = '*',
  componentId = '*',
  communityId,
  onFileChange,
  onStoryClick,
}) => {
  const { client } = useSDK();
  const { community } = useCommunityInfo(communityId);
  const { hasStoryPermission } = useStoryPermission(communityId);
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const { stories } = useGetActiveStoriesByTarget({
    targetId: communityId,
    targetType: 'community',
    options: { orderBy: 'asc', sortBy: 'createdAt' },
  });

  const hasStories = stories?.length > 0;
  const storiesWithoutAds = stories.filter((story) => !(story as Amity.Ad).adId) as Amity.Story[];
  const hasUnSeen = storiesWithoutAds.some((story) => !story?.isSeen);
  const uploading = storiesWithoutAds.some((story) => story?.syncState === 'syncing');
  const isErrored = storiesWithoutAds.some((story) => story?.syncState === 'error');

  const handleOnClick = () => {
    if (Array.isArray(stories) && stories.length === 0) return;
    onStoryClick();
  };

  if (isExcluded) return null;

  if (
    (!hasStories && !hasStoryPermission) ||
    // if community has setting to only allow admin to post
    (community && !canCreatePostCommunity(client, community))
  )
    return null;

  return (
    <div
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={clsx(styles.storyTabContainer)}
    >
      <div className={clsx(styles.storyWrapper)}>
        {hasStories && (
          <StoryRing
            pageId={pageId}
            componentId={componentId}
            hasUnseen={hasUnSeen}
            uploading={uploading}
            isErrored={isErrored}
            size={48}
          />
        )}

        <button className={clsx(styles.storyAvatarContainer)} onClick={handleOnClick}>
          <CommunityAvatar pageId={pageId} componentId={componentId} community={community} />
        </button>

        {hasStoryPermission && community && canCreatePostCommunity(client, community) && (
          <FileTrigger
            onSelect={(e) => {
              const files = Array.from(e as FileList);
              onFileChange(files[0]);
            }}
          >
            <CreateNewStoryButton pageId={pageId} componentId={componentId} />
          </FileTrigger>
        )}
        {isErrored && <ErrorIcon className={clsx(styles.errorIcon)} />}
      </div>
      <Typography.Caption data-qa-anchor={`${pageId}/${componentId}/story_title`}>
        Story
      </Typography.Caption>
    </div>
  );
};
