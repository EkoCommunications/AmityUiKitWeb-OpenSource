import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';

import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { ShareButton } from '~/v4/social/elements/ShareButton';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { Typography } from '~/v4/core/components';
import AngleRight from '~/v4/icons/AngleRight';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { CommentButton } from '~/v4/social/elements/CommentButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useMutation } from '@tanstack/react-query';
import { ReactionRepository } from '@amityco/ts-sdk';
import { PollContent } from './PollContent/PollContent';
import Crying from './Crying';
import Happy from './Happy';
import Fire from './Fire';
import Love from './Love';
import Like from './Like';
import { TextContent } from './TextContent';
import { ImageContent } from './ImageContent';
import { VideoContent } from './VideoContent';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import usePost from '~/v4/core/hooks/objects/usePost';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import { ReactionList } from '~/v4/social/components/ReactionList/ReactionList';
import { usePostedUserInformation } from '~/v4/core/hooks/usePostedUserInformation';
import millify from 'millify';
import { Button } from '~/v4/core/natives/Button';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import dayjs from 'dayjs';
import { useVisibilitySensor } from '~/v4/social/hooks/useVisibilitySensor';
import { AnnouncementBadge } from '~/v4/social/elements/AnnouncementBadge';
import { PinBadge } from '~/v4/social/elements/PinBadge';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import clsx from 'clsx';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import styles from './PostContent.module.css';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';

export enum AmityPostContentComponentStyle {
  FEED = 'feed',
  DETAIL = 'detail',
}

export enum AmityPostCategory {
  GENERAL = 'general',
  ANNOUNCEMENT = 'announcement',
  PIN = 'pin',
  PIN_AND_ANNOUNCEMENT = 'pin_and_announcement',
}

interface PostTitleProps {
  post: Amity.Post;
  pageId?: string;
  componentId?: string;
  hideTarget?: boolean;
}

const PostTitle = ({ pageId, componentId, post, hideTarget }: PostTitleProps) => {
  const shouldCallCommunity = useMemo(() => post?.targetType === 'community', [post?.targetType]);
  const shouldCallUser = useMemo(
    () => post?.targetType === 'user' && post?.postedUserId !== post?.targetId,
    [post?.targetType, post?.postedUserId, post?.targetId],
  );

  const { community: targetCommunity } = useCommunity({
    communityId: post?.targetId,
    shouldCall: shouldCallCommunity,
  });

  const { user: targetUser } = useUser({
    userId: post?.targetId,
    shouldCall: shouldCallUser,
  });

  const { goToCommunityProfilePage, onClickUser } = useNavigation();

  const showTargetCommunity = targetCommunity && !hideTarget;
  const showTargetUser = targetUser && !hideTarget;
  const showBrandBadge = post.creator.isBrand;
  const showPrivateBadge = targetCommunity?.isPublic === false;
  const showOfficialBadge = targetCommunity?.isOfficial === true;

  const showTarget = showTargetCommunity || showTargetUser;

  return (
    <div className={styles.postTitle} data-show-target-community={showTargetCommunity === true}>
      {post.creator && (
        <div
          className={styles.postTitle__user__container}
          data-show-brand-badge={showBrandBadge === true}
          data-show-target={showTarget === true}
        >
          <Button
            onPress={() => onClickUser(post.creator.userId)}
            data-qa-anchor={`${pageId}/${componentId}/username`}
          >
            <Typography.BodyBold className={styles.postTitle__text}>
              {post.creator.displayName}
            </Typography.BodyBold>
          </Button>
          {showBrandBadge ? <BrandBadge className={styles.postTitle__brandIcon} /> : null}
          {showTarget ? (
            <AngleRight
              data-qa-anchor={`${pageId}/${componentId}/arrow_right`}
              className={styles.postTitle__icon}
            />
          ) : null}
        </div>
      )}
      {showTargetCommunity && (
        <div
          className={styles.postTitle__community}
          data-show-private-badge={showPrivateBadge === true}
          data-show-official-badge={showOfficialBadge === true}
        >
          {showPrivateBadge && <CommunityPrivateBadge />}
          <Button
            className={styles.postTitle__communityText}
            data-qa-anchor={`${pageId}/${componentId}/community_name`}
            onPress={() => goToCommunityProfilePage(targetCommunity.communityId)}
          >
            <Typography.BodyBold>{targetCommunity.displayName}</Typography.BodyBold>
          </Button>
          {showOfficialBadge && <CommunityOfficialBadge />}
        </div>
      )}
      {showTargetUser && (
        <div
          className={styles.postTitle__user__container}
          data-show-brand-badge={targetUser?.isBrand === true}
          data-show-target={false}
        >
          <Button onPress={() => onClickUser(targetUser.userId)}>
            <Typography.BodyBold className={styles.postTitle__text}>
              {targetUser.displayName}
            </Typography.BodyBold>
          </Button>
          {targetUser?.isBrand === true ? (
            <BrandBadge className={styles.postTitle__brandIcon} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export const ChildrenPostContent = ({
  pageId,
  componentId,
  post,
  disabledContent = false,
  onImageClick,
  onVideoClick,
}: {
  pageId?: string;
  componentId?: string;
  post: Amity.Post[];
  disabledContent?: boolean;
  onImageClick: (imageIndex: number) => void;
  onVideoClick: (videoIndex: number) => void;
}) => {
  return (
    <>
      <PollContent
        pageId={pageId}
        componentId={componentId}
        post={post}
        disabled={disabledContent}
      />
      <ImageContent
        pageId={pageId}
        componentId={componentId}
        post={post}
        onImageClick={onImageClick}
      />
      <VideoContent
        pageId={pageId}
        componentId={componentId}
        post={post}
        onVideoClick={onVideoClick}
      />
    </>
  );
};

interface PostContentProps {
  post: Amity.Post;
  onClick?: () => void;
  onPostDeleted?: (post: Amity.Post) => void;
  style: AmityPostContentComponentStyle;
  category: AmityPostCategory;
  hideMenu?: boolean;
  hideTarget?: boolean;
  pageId?: string;
  disabledContent?: boolean;
  isGlobalFeaturePost?: boolean;
  className?: string;
}

export const PostContent = ({
  pageId = '*',
  post,
  onClick,
  onPostDeleted,
  category,
  hideMenu = false,
  hideTarget = false,
  style,
  disabledContent = false,
  isGlobalFeaturePost = false,
  className,
}: PostContentProps) => {
  const componentId = 'post_content';
  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [clickedImageIndex, setClickedImageIndex] = useState<number | null>(null);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);

  const [reactionByMe, setReactionByMe] = useState<string | null>(null);
  const [reactionsCount, setReactionsCount] = useState<number>(0);
  const { page } = useNavigation();

  const elementRef = useRef<HTMLDivElement>(null);

  const shouldCall = useMemo(() => post?.targetType === 'community', [post?.targetType]);

  const { community: targetCommunity } = useCommunity({
    communityId: post?.targetId,
    shouldCall,
  });

  const { isCommunityModerator } = usePostedUserInformation({
    post,
    community: targetCommunity,
  });

  useEffect(() => {
    if (post == null) return;
    setReactionByMe(post.myReactions?.[0] || null);
  }, [post?.myReactions]);

  useEffect(() => {
    if (post == null) return;
    setReactionsCount(post?.reactionsCount || 0);
  }, [post?.reactionsCount]);

  const { mutateAsync: mutateAddReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      if (reactionByMe && reactionByMe !== reactionKey) {
        try {
          await ReactionRepository.removeReaction('post', post?.postId, reactionByMe);
        } catch {
          console.log();
        }
      }
      return ReactionRepository.addReaction('post', post?.postId, reactionKey);
    },
    onMutate: (reactionKey) => {
      setShouldSubscribe(true);
      setReactionsCount(reactionsCount + 1);
      setReactionByMe(reactionKey);
    },
  });

  const { mutateAsync: mutateRemoveReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      return ReactionRepository.removeReaction('post', post?.postId, reactionKey);
    },
    onMutate: () => {
      setShouldSubscribe(true);
      setReactionsCount(Math.max(0, reactionsCount - 1));
      setReactionByMe(null);
    },
  });

  const handleReactionClick = (reactionKey: string) => {
    if (reactionByMe) {
      mutateRemoveReactionAsync(reactionByMe);
    } else {
      mutateAddReactionAsync(reactionKey);
    }
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

  const onEditFeaturePost = ({ onConfirm }: { onConfirm: () => void }) => {
    confirm({
      title: 'Edit globally featured post?',
      content: `The post you're editing has been featured globally. If you edit your post, it will need to be re-approved and will no longer be globally featured.`,
      cancelText: 'Cancel',
      okText: 'Edit',
      onOk: onConfirm,
    });
  };

  const handleUnpinPost = async () => {};

  const handleEditPost = () => {};

  const handleDeletePost = () => {};

  const isNotJoinedCommunity = !targetCommunity?.isJoined && post?.targetType === 'community';

  const hasLike = post?.reactions?.like > 0;
  const hasLove = post?.reactions?.love > 0;
  const hasFire = post?.reactions?.fire > 0;
  const hasHappy = post?.reactions?.happy > 0;
  const hasCrying = post?.reactions?.crying > 0;

  const hasReaction = hasLike || hasLove || hasFire || hasHappy || hasCrying;

  //TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
  const shouldShowConfirmEdit =
    isGlobalFeaturePost &&
    ((targetCommunity as Amity.Community & { needApprovalOnPostCreation?: boolean })
      ?.needApprovalOnPostCreation ||
      targetCommunity?.postSetting === 'ADMIN_REVIEW_POST_REQUIRED');

  const { isVisible } = useVisibilitySensor({
    threshold: 0.6,
    elementRef,
  });

  useEffect(() => {
    if (page.type === PageTypes.PostDetailPage) return;
    if (isVisible) {
      post.analytics?.markAsViewed();
    }
  }, [post, isVisible, page.type]);

  return (
    <div
      data-qa-anchor={accessibilityId}
      ref={elementRef}
      className={clsx(styles.postContent, className)}
      style={themeStyles}
    >
      {(category === AmityPostCategory.ANNOUNCEMENT ||
        category === AmityPostCategory.PIN_AND_ANNOUNCEMENT) && (
        <AnnouncementBadge pageId={pageId} componentId={componentId} />
      )}
      <div className={styles.postContent__bar} data-type={style}>
        <div className={styles.postContent__bar__userAvatar}>
          <UserAvatar pageId={pageId} componentId={componentId} userId={post?.postedUserId} />
        </div>
        <div className={styles.postContent__bar__detail}>
          <div>
            <PostTitle
              post={post}
              hideTarget={hideTarget}
              pageId={pageId}
              componentId={componentId}
            />
          </div>
          <div className={styles.postContent__bar__information__subtitle}>
            {isCommunityModerator ? (
              <div className={styles.postContent__bar__information__subtitle__moderator}>
                <ModeratorBadge pageId={pageId} componentId={componentId} />
                <span className={styles.postContent__bar__information__subtitle__separator}>•</span>
              </div>
            ) : null}
            <Timestamp timestamp={post.createdAt} />
            {post.createdAt !== post.editedAt && (
              <Typography.Caption
                data-qa-anchor={`${pageId}/${componentId}/post_edited_text`}
                className={styles.postContent__bar__information__editedTag}
              >
                (edited)
              </Typography.Caption>
            )}
          </div>
        </div>

        <div className={styles.postContent__wrapRightMenu}>
          {(category === AmityPostCategory.PIN ||
            category === AmityPostCategory.PIN_AND_ANNOUNCEMENT) && (
            <PinBadge pageId={pageId} componentId={componentId} />
          )}
          {style === AmityPostContentComponentStyle.FEED && (
            <Popover
              containerClassName={styles.postContent__bar__actionButton}
              trigger={{
                pageId,
                componentId,
                onClick: ({ closePopover }) =>
                  setDrawerData({
                    content: (
                      <PostMenu
                        post={post}
                        pageId={pageId}
                        componentId={componentId}
                        onPostDeleted={onPostDeleted}
                        onConfirmEditPost={
                          shouldShowConfirmEdit
                            ? ({ onConfirm }) => {
                                closePopover();
                                removeDrawerData();
                                onEditFeaturePost({ onConfirm });
                              }
                            : undefined
                        }
                        onCloseMenu={() => {
                          closePopover();
                          removeDrawerData();
                        }}
                      />
                    ),
                  }),
              }}
            >
              {({ closePopover }) => (
                <PostMenu
                  post={post}
                  pageId={pageId}
                  componentId={componentId}
                  onPostDeleted={onPostDeleted}
                  onConfirmEditPost={
                    shouldShowConfirmEdit
                      ? ({ onConfirm }) => {
                          closePopover();
                          removeDrawerData();
                          onEditFeaturePost({ onConfirm });
                        }
                      : undefined
                  }
                  onCloseMenu={() => {
                    closePopover();
                    removeDrawerData();
                  }}
                />
              )}
            </Popover>
          )}
        </div>
      </div>
      <div className={styles.postContent__content_and_reactions}>
        <div className={styles.postContent__content}>
          <TextContent
            pageId={pageId}
            componentId={componentId}
            text={post?.data?.text}
            mentioned={post?.metadata?.mentioned}
            mentionees={post?.mentioness}
            post={post}
          />
          {post.children.length > 0 ? (
            <ChildrenPostContent
              pageId={pageId}
              componentId={componentId}
              post={post}
              onImageClick={openImageViewer}
              onVideoClick={openVideoViewer}
              disabledContent={isNotJoinedCommunity || disabledContent}
            />
          ) : null}
        </div>
        {style === AmityPostContentComponentStyle.DETAIL ? (
          <div className={styles.postContent__reactions_and_comments}>
            <div
              className={styles.postContent__reactionsBar}
              onClick={() => {
                const reactionList = (
                  <ReactionList pageId={pageId} referenceId={post.postId} referenceType={'post'} />
                );
                isDesktop
                  ? openPopup({ view: 'desktop', children: reactionList })
                  : setDrawerData({ content: reactionList });
              }}
            >
              {hasReaction ? (
                <div className={styles.postContent__reactionsBar__reactions}>
                  {hasCrying && (
                    <Crying className={styles.postContent__reactionsBar__reactions__icon} />
                  )}
                  {hasHappy && (
                    <Happy className={styles.postContent__reactionsBar__reactions__icon} />
                  )}
                  {hasFire && (
                    <Fire className={styles.postContent__reactionsBar__reactions__icon} />
                  )}
                  {hasLove && (
                    <Love className={styles.postContent__reactionsBar__reactions__icon} />
                  )}
                  {hasLike && (
                    <Like className={styles.postContent__reactionsBar__reactions__icon} />
                  )}
                </div>
              ) : null}
              <Typography.Caption
                data-qa-anchor={`${pageId}/${componentId}/like_count`}
                className={styles.postContent__reactionsBar__reactions__count}
              >
                {`${millify(post?.reactionsCount || 0)} ${
                  post?.reactionsCount === 1 ? 'like' : 'likes'
                }`}
              </Typography.Caption>
            </div>

            <Typography.Caption
              data-qa-anchor={`${pageId}/${componentId}/comment_count`}
              className={styles.postContent__commentsCount}
            >
              {`${post?.commentsCount || 0} ${post?.commentsCount === 1 ? 'comment' : 'comments'}`}
            </Typography.Caption>
          </div>
        ) : null}
        {isNotJoinedCommunity && page.type !== PageTypes.PostDetailPage ? (
          <>
            <div className={styles.postContent__divider} />
            <Typography.Body className={styles.postContent__notMember}>
              Join community to interact with all posts
            </Typography.Body>
          </>
        ) : targetCommunity &&
          !targetCommunity?.isJoined &&
          page.type === PageTypes.PostDetailPage ? null : (
          <>
            <div className={styles.postContent__divider} />
            <div className={styles.postContent__reactionBar}>
              <div className={styles.postContent__reactionBar__leftPane}>
                <ReactionButton
                  pageId={pageId}
                  componentId={componentId}
                  reactionsCount={
                    style === AmityPostContentComponentStyle.FEED ? reactionsCount : undefined
                  }
                  myReaction={reactionByMe}
                  defaultIconClassName={styles.postContent__reactionBar__leftPane__icon}
                  imgIconClassName={styles.postContent__reactionBar__leftPane__iconImg}
                  onReactionClick={handleReactionClick}
                />
                <CommentButton
                  pageId={pageId}
                  componentId={componentId}
                  commentsCount={
                    style === AmityPostContentComponentStyle.FEED ? post.commentsCount : undefined
                  }
                  defaultIconClassName={styles.postContent__reactionBar__leftPane__icon}
                  imgIconClassName={styles.postContent__reactionBar__leftPane__iconImg}
                  onPress={() => onClick?.()}
                />
              </div>
              <div className={styles.postContent__reactionBar__rightPane}>
                <ShareButton pageId={pageId} componentId={componentId} />
              </div>
            </div>
          </>
        )}
      </div>
      {isImageViewerOpen && typeof clickedImageIndex === 'number' ? (
        <ImageViewer post={post} onClose={closeImageViewer} initialImageIndex={clickedImageIndex} />
      ) : null}
      {isVideoViewerOpen && typeof clickedVideoIndex === 'number' ? (
        <VideoViewer post={post} onClose={closeVideoViewer} initialVideoIndex={clickedVideoIndex} />
      ) : null}
    </div>
  );
};
