import { CommunityPostSettings } from '@amityco/ts-sdk';
import { useMemo } from 'react';
import usePostsCollection from '~/social/hooks/collections/usePostsCollection';
import useSDK from '~/core/hooks/useSDK';
import { Permissions } from '~/social/constants';
import useCommunityModeratorsCollection from '~/social/hooks/collections/useCommunityModeratorsCollection';

const useCommunityPostPermission = ({
  post,
  childrenPosts = [],
  community,
  // userId,
}: {
  post?: Amity.Post | null;
  childrenPosts?: Amity.Post[];
  community?: Amity.Community | null;
}) => {
  const { currentUserId } = useSDK();
  const { moderators } = useCommunityModeratorsCollection(community?.communityId);
  const { client } = useSDK();

  const { posts: reviewingPosts } = usePostsCollection({
    targetType: 'community',
    targetId: community?.communityId,
    feedType: 'reviewing',
  });

  const isEditable = useMemo(() => {
    if (
      childrenPosts.find(
        (childPost) => childPost.dataType === 'liveStream' || childPost.dataType === 'poll',
      )
    ) {
      return false;
    }
    return true;
  }, [childrenPosts]);

  const moderator = moderators.find((moderator) => moderator.userId === currentUserId);

  const isMyPost = post?.postedUserId === currentUserId;
  const isPostUnderReview = useMemo(() => {
    if (community?.postSetting != CommunityPostSettings.ANYONE_CAN_POST) {
      return reviewingPosts.find((reviewingPost) => reviewingPost.postId === post?.postId) != null;
    }
    return false;
  }, [community, reviewingPosts]);

  const isModerator = moderator != null;

  const permissions: {
    canEdit: boolean;
    canReport: boolean;
    canDelete: boolean;
    canReview: boolean;
  } = {
    canEdit: false,
    canReport: false,
    canDelete: false,
    canReview: false,
  };

  if (isMyPost) {
    if (!isPostUnderReview && isEditable) {
      permissions.canEdit = true;
    }
    permissions.canDelete = true;
  } else {
    if (community != null) {
      const canEdit =
        client
          ?.hasPermission(Permissions.EditCommunityFeedPostPermission)
          .community(community.communityId) ?? false;

      permissions.canEdit = canEdit && isEditable;

      const canDelete =
        client
          ?.hasPermission(Permissions.DeleteCommunityFeedPostPermission)
          .community(community.communityId) ?? false;

      permissions.canDelete = canDelete;
    } else {
      const canDelete =
        client?.hasPermission(Permissions.EditUserFeedPostPermission).currentUser() ?? false;

      permissions.canDelete = canDelete;
    }

    if (!isPostUnderReview) {
      permissions.canReport = true;
    }

    if (isPostUnderReview && isModerator) {
      permissions.canReview = true;
    }
  }

  return {
    isPostUnderReview,
    isModerator,
    ...permissions,
  };
};

export default useCommunityPostPermission;
