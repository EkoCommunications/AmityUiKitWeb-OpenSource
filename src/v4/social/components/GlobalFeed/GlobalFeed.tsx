import React, { useState } from 'react';
import { PostContent, PostContentSkeleton } from '~/v4/social/components/PostContent';
import { EmptyNewsfeed } from '~/v4/social/components/EmptyNewsFeed/EmptyNewsFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostAd } from '~/v4/social/internal-components/PostAd/PostAd';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import { ClickableArea } from '~/v4/core/natives/ClickableArea';
import styles from './GlobalFeed.module.css';
import { Divider } from '~/v4/social/elements/Divider';
import useGlobalPinnedPostsCollection from '~/v4/social/hooks/collections/useGlobalPinnedPostsCollection';

interface GlobalFeedProps {
  pageId?: string;
  componentId?: string;
  items: Array<Amity.Post | Amity.Ad>;
  isLoading: boolean;
  onFeedReachBottom: () => void;
  onPostDeleted?: (post: Amity.Post) => void;
}

const isAmityAd = (item: Amity.Post | Amity.Ad): item is Amity.Ad => {
  return (item as Amity.Ad)?.adId !== undefined;
};

export const GlobalFeed = ({
  pageId = '*',
  componentId = '*',
  items,
  isLoading,
  onFeedReachBottom,
  onPostDeleted,
}: GlobalFeedProps) => {
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { globalFeaturedPosts, isLoading: isGlobalFeaturedPostsLoading } =
    useGlobalPinnedPostsCollection();

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  const { AmityGlobalFeedComponentBehavior } = usePageBehavior();

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      onFeedReachBottom();
    },
  });

  if (
    !isLoading &&
    items.length === 0 &&
    !isGlobalFeaturedPostsLoading &&
    globalFeaturedPosts?.length === 0
  ) {
    return <EmptyNewsfeed pageId={pageId} />;
  }

  const getItemKey = (item: Amity.Post | Amity.Ad, prevItem: Amity.Post | Amity.Ad | undefined) => {
    if (isAmityAd(item)) {
      if (prevItem && isAmityAd(prevItem)) {
        return `${prevItem.adId}-${item.adId}`;
      } else {
        return `${prevItem.postId}-${item.adId}`;
      }
    }
    return item.postId;
  };

  return (
    <div className={styles.global_feed} style={themeStyles} data-qa-anchor={accessibilityId}>
      {globalFeaturedPosts?.map((item) => (
        <React.Fragment key={item.post.postId}>
          <ClickableArea
            elementType="div"
            className={styles.global_feed__postContainer}
            onPress={() =>
              AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({
                hideTarget: true,
                postId: item?.post?.postId,
                category: AmityPostCategory.ANNOUNCEMENT,
              })
            }
          >
            <PostContent
              pageId={pageId}
              post={item.post}
              category={AmityPostCategory.ANNOUNCEMENT}
              style={AmityPostContentComponentStyle.FEED}
              onPostDeleted={() => onPostDeleted?.(item?.post)}
              onClick={() => {
                AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({
                  hideTarget: true,
                  postId: item?.post?.postId,
                  category: AmityPostCategory.ANNOUNCEMENT,
                });
              }}
            />
          </ClickableArea>
          <Divider />
        </React.Fragment>
      ))}
      {items.map((item, index) => (
        <React.Fragment key={getItemKey(item, items[Math.max(0, index - 1)])}>
          <Divider isShown={index !== 0} />
          {isAmityAd(item) ? (
            <PostAd ad={item} />
          ) : (
            <ClickableArea
              elementType="div"
              className={styles.global_feed__postContainer}
              onPress={() =>
                AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({ postId: item.postId })
              }
            >
              <PostContent
                pageId={pageId}
                post={item}
                category={AmityPostCategory.GENERAL}
                style={AmityPostContentComponentStyle.FEED}
                onClick={() => {
                  AmityGlobalFeedComponentBehavior?.goToPostDetailPage?.({ postId: item.postId });
                }}
                onPostDeleted={onPostDeleted}
              />
            </ClickableArea>
          )}
        </React.Fragment>
      ))}
      <Divider isShown={items.length > 0} />
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <PostContentSkeleton />
              <Divider isShown={index !== 5} />
            </div>
          ))
        : null}
      {!isLoading && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.global_feed__intersection}
        />
      )}
    </div>
  );
};
