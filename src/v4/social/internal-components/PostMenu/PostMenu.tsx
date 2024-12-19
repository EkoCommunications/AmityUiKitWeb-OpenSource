import React, { useMemo } from 'react';
import { PollRepository, PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { Button } from '~/v4/core/natives/Button';
import { usePostFlaggedByMe } from '~/v4/core/hooks/usePostFlaggedByMe';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Typography } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { EditPostTitle } from '~/v4/social/elements/EditPostTitle';
import FlagIcon from '~/v4/icons/Flag';
import { PenIcon } from '~/v4/icons/Pen';
import { TrashIcon } from '~/v4/icons/Trash';
import styles from './PostMenu.module.css';
import { CreatePost } from '~/v4/icons/CreatePost';
import usePost from '~/v4/core/hooks/objects/usePost';
import usePoll from '~/v4/social/hooks/usePoll';
import { ClosePollIcon } from '~/v4/icons/ClosePoll';

interface PostMenuProps {
  post: Amity.Post;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  onCloseMenu: () => void;
  onPostDeleted?: (post: Amity.Post) => void;
}

export const PostMenu = ({
  post,
  pageId = '*',
  componentId = '*',
  elementId = '*',
  onCloseMenu,
  onPostDeleted,
}: PostMenuProps) => {
  const { success, error } = useNotifications();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { post: childPost } = usePost(post.children?.[0]);
  const { item: poll } = usePoll(childPost?.data?.pollId);

  const shouldCall = useMemo(() => post?.targetType === 'community', [post?.targetType]);

  const { community } = useCommunity({
    communityId: post?.targetId,
    shouldCall,
  });

  const { isCommunityModerator, isOwner } = usePostPermissions({ post, community });
  const { AmityPostContentComponentBehavior } = usePageBehavior();
  const { removeDrawerData } = useDrawer();

  const { showEditPostButton, showDeletePostButton, showReportPostButton } = useMemo(() => {
    if (isCommunityModerator) {
      if (isOwner) {
        return {
          showEditPostButton: true,
          showDeletePostButton: true,
          showReportPostButton: false,
        };
      } else {
        return {
          showEditPostButton: false,
          showDeletePostButton: true,
          showReportPostButton: true,
        };
      }
    } else {
      if (isOwner) {
        return {
          showEditPostButton: true,
          showDeletePostButton: true,
          showReportPostButton: false,
        };
      } else {
        return {
          showEditPostButton: false,
          showDeletePostButton: false,
          showReportPostButton: true,
        };
      }
    }
  }, [isCommunityModerator, isOwner]);

  const showClosePollButton = useMemo(() => {
    if (poll && poll.status === 'open' && isOwner) return true;
    return false;
  }, [isOwner, poll]);

  const isPollPost = useMemo(() => {
    return !!poll;
  }, [poll]);

  const { isFlaggedByMe, isLoading, mutateReportPost, mutateUnReportPost } = usePostFlaggedByMe({
    post,
    isFlaggable: showReportPostButton,
    onReportSuccess: () => {
      success({ content: 'Post reported.' });
    },
    onReportError: () => {
      error({ content: 'Failed to report post.' });
    },
    onUnreportSuccess: () => {
      success({ content: 'Post unreported.' });
    },
    onUnreportError: () => {
      error({ content: 'Failed to unreport post.' });
    },
  });

  const { confirm } = useConfirmContext();

  const { mutateAsync: mutateDeletePost } = useMutation({
    mutationFn: async () => {
      onCloseMenu();
      return PostRepository.hardDeletePost(post.postId);
    },
    onSuccess: () => {
      success({ content: 'Post deleted.' });
      onPostDeleted?.(post);
    },
    onError: () => {
      error({ content: 'Failed to delete post.' });
    },
  });

  const { mutateAsync: mutateClosePoll } = useMutation({
    mutationFn: async () => {
      if (!poll) return;
      return PollRepository.closePoll(poll.pollId);
    },
    onSuccess: () => {
      success({ content: 'Poll closed.' });
      onPostDeleted?.(post);
    },
    onError: () => {
      error({ content: 'Oops, something went wrong.' });
    },
  });

  const onDeleteClick = () => {
    onCloseMenu();
    confirm({
      title: 'Delete post',
      content: 'This post will be permanently deleted.',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: () => mutateDeletePost(),
      pageId,
      componentId,
    });
  };

  const onClosePollClick = () => {
    onCloseMenu();
    confirm({
      title: 'Close poll?',
      content: `The Poll duration you've set will be ignored and your poll will be closed immediately.`,
      cancelText: 'Cancel',
      okText: 'Close poll',
      onOk: () => mutateClosePoll(),
      pageId,
      componentId,
    });
  };

  return (
    <div className={styles.postMenu}>
      {showClosePollButton && (
        <Button
          data-qa-anchor={`${pageId}/${componentId}/report_post_button`}
          className={styles.postMenu__item}
          onPress={() => onClosePollClick()}
        >
          <ClosePollIcon className={styles.postMenu__closePoll__icon} />
          <Typography.BodyBold className={styles.postMenu__reportPost__text}>
            Close poll
          </Typography.BodyBold>
        </Button>
      )}
      {showReportPostButton && !isLoading ? (
        <Button
          data-qa-anchor={`${pageId}/${componentId}/report_post_button`}
          className={styles.postMenu__item}
          onPress={() => {
            onCloseMenu();
            if (isFlaggedByMe) {
              mutateUnReportPost();
            } else {
              mutateReportPost();
            }
            removeDrawerData();
          }}
        >
          <FlagIcon className={styles.postMenu__reportPost__icon} />
          <Typography.BodyBold className={styles.postMenu__reportPost__text}>
            {isFlaggedByMe ? 'Unreport post' : 'Report post'}
          </Typography.BodyBold>
        </Button>
      ) : null}
      {showEditPostButton && !isPollPost ? (
        <Button
          data-qa-anchor={`${pageId}/${componentId}/edit_post`}
          className={styles.postMenu__item}
          onPress={() => {
            if (isDesktop) {
              onCloseMenu();
              return openPopup({
                pageId,
                view: 'desktop',
                isDismissable: false,
                header: <EditPostTitle pageId="post_composer_page" />,
                children: <PostComposerPage mode={Mode.EDIT} post={post} />,
                onClose: ({ close }) => {
                  confirm({
                    onOk: close,
                    type: 'confirm',
                    okText: 'Discard',
                    cancelText: 'Keep editing',
                    title: 'Discard this post?',
                    pageId: 'post_composer_page',
                    content: 'The post will be permanently deleted. It cannot be undone.',
                  });
                },
              });
            }
            removeDrawerData();
            AmityPostContentComponentBehavior?.goToPostComposerPage?.({
              mode: Mode.EDIT,
              post,
            });
          }}
        >
          <CreatePost className={styles.postMenu__editPost__icon} />
          <Typography.BodyBold className={styles.postMenu__editPost__text}>
            Edit post
          </Typography.BodyBold>
        </Button>
      ) : null}
      {showDeletePostButton ? (
        <Button
          data-qa-anchor={`${pageId}/${componentId}/delete_post`}
          className={styles.postMenu__item}
          onPress={() => onDeleteClick()}
        >
          <TrashIcon className={styles.postMenu__deletePost__icon} />
          <Typography.BodyBold className={styles.postMenu__deletePost__text}>
            Delete post
          </Typography.BodyBold>
        </Button>
      ) : null}
    </div>
  );
};
