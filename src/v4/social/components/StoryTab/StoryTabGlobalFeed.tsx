import React, { useRef, useEffect } from 'react';
import styles from './StoryTabGlobalFeed.module.css';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { StoryTabItem } from './StoryTabItem';
import { useGlobalStoryTargets } from '~/v4/social/hooks/collections/useGlobalStoryTargets';

const STORIES_PER_PAGE = 10;

export const StoryTabGlobalFeed: React.FC = () => {
  const { stories, isLoading, hasMore, loadMoreStories } = useGlobalStoryTargets({
    seenState: 'smart' as Amity.StorySeenQuery,
    limit: STORIES_PER_PAGE,
  });
  const { onClickStory } = useNavigation();
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const lastStory = entries[0];

          if (lastStory.isIntersecting && hasMore) {
            loadMoreStories();
          }
        },
        { root: containerRef.current, rootMargin: '0px', threshold: 0.9 },
      );

      if (stories.length > 0) {
        const lastStoryElement = containerRef.current.children[stories.length - 1];
        if (lastStoryElement) {
          observerRef.current.observe(lastStoryElement);
        }
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [stories, hasMore, loadMoreStories]);

  if (isLoading) {
    return (
      <div className={styles.storyTabContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={styles.storyTabSkeleton}>
            <div className={styles.storyTabSkeletonAvatar} />
            <div className={styles.storyTabSkeletonUsername} />
          </div>
        ))}
      </div>
    );
  }

  if (stories?.length === 0) return null;

  return (
    <div className={styles.storyTabContainer} ref={containerRef}>
      {stories.map((story) => {
        return (
          <StoryTabItem
            key={story.targetId}
            targetId={story.targetId}
            hasUnseen={story.hasUnseen}
            onClick={() =>
              onClickStory(
                story.targetId,
                'globalFeed',
                stories.map((s) => s.targetId),
              )
            }
            size={64}
          />
        );
      })}
    </div>
  );
};