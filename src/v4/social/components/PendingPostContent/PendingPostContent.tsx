import React, { useMemo, useState } from 'react';
import styles from './PendingPostContent.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button/Button';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import clsx from 'clsx';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import Trash from '~/v4/icons/Trash';
import { PostAcceptButton } from '~/v4/social/elements/PostAcceptButton';
import { PostDeclineButton } from '~/v4/social/elements/PostDeclineButton/PostDeclineButton';
import { PostRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { TextContent } from '~/v4/social/components/PostContent/TextContent';
import { ChildrenPostContent } from '~/v4/social/components/PostContent';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import usePost from '~/v4/core/hooks/objects/usePost';
import dayjs from 'dayjs';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type PendingPostContentProps = {
  pageId?: string;
  post?: Amity.Post;
  canReviewCommunityPosts?: boolean;
  refresh?: () => void;
};

export const PendingPostContent = ({
  pageId = '*',
  post: initialPost,
  canReviewCommunityPosts = false,
  refresh,
}: PendingPostContentProps) => {
  const componentId = 'pending_post_content';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { currentUserId } = useSDK();
  const { post: postData } = usePost(initialPost?.postId);

  const { setDrawerData, removeDrawerData } = useDrawer();
  const notification = useNotifications();
  const { info } = useConfirmContext();

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [clickedImageIndex, setClickedImageIndex] = useState<number | null>(null);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);

  const post = useMemo(() => {
    if (initialPost != null && postData != null) {
      if (dayjs(initialPost?.updatedAt).unix() > dayjs(postData?.updatedAt).unix()) {
        return initialPost;
      }
      return postData;
    }
    if (postData != null) {
      return postData;
    }
    if (initialPost != null) {
      return initialPost;
    }
  }, [initialPost, postData]);

  const handleApprovePost = async (postId: string) => {
    if (postId == null) return;

    try {
      await PostRepository.approvePost(postId);
      notification.success({
        content: 'Post accepted.',
      });
    } catch (error) {
      info({
        content: 'Failed to accept post. Post has been reviewed.',
        onOk: () => {
          refresh?.();
        },
      });
    }
  };

  const handleDeclinePost = async (postId: string) => {
    if (postId == null) return;

    try {
      await PostRepository.declinePost(postId);
      notification.success({
        content: 'Post declined.',
      });
    } catch (error) {
      info({
        content: 'Failed to decline post. Post has been reviewed',
        onOk: () => {
          refresh?.();
        },
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (postId == null) return;

    try {
      await PostRepository.deletePost(postId);
      removeDrawerData();
      notification.success({
        content: 'Post deleted.',
      });
    } catch (error) {
      info({
        content: 'Failed to delete post. Post has been deleted.',
        onOk: () => {
          refresh?.();
        },
      });
    }
  };

  const isMyPost = (postedUserId: string) => {
    return postedUserId === currentUserId;
  };

  const openImageViewer = (imageIndex: number) => {
    setIsImageViewerOpen(true);
    setClickedImageIndex(imageIndex);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setClickedImageIndex(null);
  };

  const openVideoViewer = (imageIndex: number) => {
    setIsVideoViewerOpen(true);
    setClickedVideoIndex(imageIndex);
  };

  const closeVideoViewer = () => {
    setIsVideoViewerOpen(false);
    setClickedVideoIndex(null);
  };

  return (
    <>
      <div
        data-qa-anchor={accessibilityId}
        style={themeStyles}
        className={styles.pendingPostContent__container}
        key={post.postId}
      >
        <div className={styles.pendingPostContent__bar}>
          <div className={styles.pendingPostContent__userDetail}>
            <UserAvatar pageId={pageId} componentId={componentId} userId={post?.postedUserId} />
            <div>
              <Typography.BodyBold
                renderer={({ typoClassName }) => (
                  <div
                    className={clsx(typoClassName, styles.pendingPostContent__username)}
                    data-qa-anchor={`${pageId}/${componentId}/username`}
                  >
                    {post.creator.displayName}
                  </div>
                )}
              />
              <div className={styles.pendingPostContent__information__subtitle}>
                <Timestamp timestamp={post.createdAt} />
                {post.createdAt !== post.editedAt && (
                  <Typography.Caption
                    data-qa-anchor={`${pageId}/${componentId}/post_edited_text`}
                    className={styles.pendingPostContent__editedTag}
                  >
                    (edited)
                  </Typography.Caption>
                )}
              </div>
            </div>
          </div>
          {isMyPost(post.postedUserId) && (
            <div className={styles.pendingPostContent__wrapRightMenu}>
              <Popover
                containerClassName={styles.pendingPostContent__actionButton}
                trigger={{
                  pageId,
                  componentId,
                  onClick: ({ closePopover }) =>
                    setDrawerData({
                      content: (
                        <Button
                          className={styles.pendingPostContent__item}
                          data-qa-anchor={`${pageId}/${componentId}/delete_post`}
                          onPress={() => {
                            closePopover();
                            handleDeletePost(post.postId);
                            removeDrawerData();
                          }}
                        >
                          <Trash className={styles.pendingPostContent__deletePost__icon} />
                          <Typography.Title className={styles.pendingPostContent__deletePost__text}>
                            Delete post
                          </Typography.Title>
                        </Button>
                      ),
                    }),
                }}
              >
                {({ closePopover }) => (
                  <Button
                    className={styles.pendingPostContent__item}
                    data-qa-anchor={`${pageId}/${componentId}/delete_post`}
                    onPress={() => {
                      closePopover();
                      handleDeletePost(post.postId);
                    }}
                  >
                    <Trash className={styles.pendingPostContent__deletePost__icon} />
                    <Typography.Title className={styles.pendingPostContent__deletePost__text}>
                      Delete post
                    </Typography.Title>
                  </Button>
                )}
              </Popover>
            </div>
          )}
        </div>
        <div className={styles.pendingPostContent__textPost}>
          <TextContent
            pageId={pageId}
            componentId={componentId}
            text={post?.data?.text}
            mentioned={post?.metadata?.mentioned}
            mentionees={post?.mentioness}
          />
          {post.children.length > 0 && (
            <ChildrenPostContent
              pageId={pageId}
              componentId={componentId}
              post={post}
              onImageClick={openImageViewer}
              onVideoClick={openVideoViewer}
            />
          )}
        </div>
        {canReviewCommunityPosts && (
          <div className={styles.pendingPostContent__buttonWrapper}>
            <PostAcceptButton
              pageId={pageId}
              componentId={componentId}
              onClick={() => handleApprovePost(post.postId)}
            />
            <PostDeclineButton
              pageId={pageId}
              componentId={componentId}
              onClick={() => handleDeclinePost(post.postId)}
            />
          </div>
        )}
        {isImageViewerOpen && typeof clickedImageIndex === 'number' ? (
          <ImageViewer
            post={post}
            onClose={closeImageViewer}
            initialImageIndex={clickedImageIndex}
          />
        ) : null}
        {isVideoViewerOpen && typeof clickedVideoIndex === 'number' ? (
          <VideoViewer
            post={post}
            onClose={closeVideoViewer}
            initialVideoIndex={clickedVideoIndex}
          />
        ) : null}
      </div>
    </>
  );
};
