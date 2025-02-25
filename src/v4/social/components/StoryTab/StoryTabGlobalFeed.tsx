import React, { useRef, useEffect } from 'react';
import styles from './StoryTabGlobalFeed.module.css';
import { StoryTabItem } from './StoryTabItem';
import { useGlobalStoryTargets } from '~/v4/social/hooks/collections/useGlobalStoryTargets';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Carousel } from '~/v4/core/components/Carousel';
import clsx from 'clsx';

const STORIES_PER_PAGE = 10;

interface StoryTabGlobalFeedProps {
  pageId?: string;
  componentId?: string;
  goToViewStoryPage: (data: {
    storyTarget: Amity.StoryTarget;
    storyTargets: Amity.StoryTarget[];
  }) => void;
}

export const StoryTabGlobalFeed = ({
  pageId = '*',
  componentId = '*',
  goToViewStoryPage,
}: StoryTabGlobalFeedProps) => {
  const { isExcluded, accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { stories, isLoading, hasMore, loadMoreStories, refresh } = useGlobalStoryTargets({
    seenState: 'smart' as Amity.StorySeenQuery,
    limit: STORIES_PER_PAGE,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const lastStory = entries[0];

        if (lastStory.isIntersecting && hasMore) {
          loadMoreStories();
        }
      },
      { root: containerRef.current, rootMargin: '0px', threshold: 0.9 },
    );

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, [containerRef?.current]);

  if (isExcluded) return null;

  if (!isLoading && stories?.length === 0) return null;

  return (
    <Carousel
      scrollOffset={300}
      isHidden={isLoading || stories.length <= 6}
      iconClassName={styles.storyTabGlobalFeeed__arrowIcon}
      leftArrowClassName={clsx(styles.storyTabGlobalFeeed__arrow, styles.left)}
      rightArrowClassName={clsx(styles.storyTabGlobalFeeed__arrow, styles.right)}
    >
      <div
        data-qa-anchor={accessibilityId}
        style={themeStyles}
        className={styles.storyTabContainer}
        ref={containerRef}
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className={styles.storyTabSkeleton}>
                <div className={styles.storyTabSkeletonAvatar} />
                <div className={styles.storyTabSkeletonUsername} />
              </div>
            ))
          : stories.map((story) => {
              return (
                <StoryTabItem
                  pageId={pageId}
                  componentId={componentId}
                  key={story.targetId}
                  targetId={story.targetId}
                  hasUnseen={story.hasUnseen}
                  isErrored={story.failedStoriesCount > 0}
                  onClick={() =>
                    goToViewStoryPage({
                      storyTargets: stories,
                      storyTarget: story,
                    })
                  }
                  size={64}
                />
              );
            })}
        <div ref={observerRef} style={{ height: '1px', width: '1px' }} />
      </div>
    </Carousel>
  );
};
