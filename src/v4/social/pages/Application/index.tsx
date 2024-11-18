import React, { useState } from 'react';

import { SocialHomePage } from '~/v4/social/pages/SocialHomePage';
import { PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { PostDetailPage } from '~/v4/social/pages/PostDetailPage';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { StoryProvider } from '~/v4/social/providers/StoryProvider';
import { SocialGlobalSearchPage } from '~/v4/social/pages/SocialGlobalSearchPage';
import { ViewStoryPage } from '~/v4/social/pages/StoryPage';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import { MyCommunitiesSearchPage } from '~/v4/social/pages/MyCommunitiesSearchPage/MyCommunitiesSearchPage';

import styles from './Application.module.css';
import {
  AmityDraftStoryPage,
  CommunityAddCategoryPage,
  CommunityMembershipPage,
  CommunityPostPermissionPage,
  CommunityStorySettingPage,
} from '..';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import CommunityFeed from '~/social/pages/CommunityFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import ProfileSettings from '~/social/components/ProfileSettings';
import { CommunityProfilePage } from '~/v4/social/pages/CommunityProfilePage';
import { CommunityTabProvider } from '~/v4/core/providers/CommunityTabProvider';
import { AllCategoriesPage } from '~/v4/social/pages/AllCategoriesPage';
import { CommunitiesByCategoryPage } from '~/v4/social/pages/CommunitiesByCategoryPage';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import { CommunitySetupPage } from '~/v4/social/pages/CommunitySetupPage';
import { CommunitySetupProvider } from '~/v4/social/providers/CommunitySetupProvider';
import { CommunityAddMemberPage } from '~/v4/social/pages/CommunityAddMemberPage/CommunityAddMemberPage';
import { CommunitySettingPage } from '~/v4/social/pages/CommunitySettingPage';
import { PendingPostsPage } from '~/v4/social/pages/PendingPostsPage';

const Application = () => {
  const { page, onBack } = useNavigation();

  const [open, setOpen] = useState(false);
  const [socialSettings, setSocialSettings] = useState<Amity.SocialSettings | null>(null);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <StoryProvider>
      <CommunitySetupProvider>
        <div className={styles.applicationContainer}>
          {page.type === PageTypes.SocialHomePage && <SocialHomePage />}
          {page.type === PageTypes.SocialGlobalSearchPage && <SocialGlobalSearchPage />}
          {page.type === PageTypes.PostDetailPage && (
            <PostDetailPage
              id={page.context?.postId}
              hideTarget={page.context?.hideTarget}
              category={page.context?.category}
            />
          )}
          {page.type === PageTypes.StoryTargetSelectionPage && <StoryTargetSelectionPage />}
          {page.type === PageTypes.CommunityProfilePage && (
            <CommunityTabProvider>
              <CommunityProfilePage communityId={page.context.communityId} />
            </CommunityTabProvider>
          )}
          {page.type === PageTypes.ViewStoryPage && (
            <ViewStoryPage type={page.context.storyType} targetId={page.context?.targetId} />
          )}
          {page.type === PageTypes.DraftPage && (
            <AmityDraftStoryPage
              targetId={page.context?.targetId}
              targetType={page.context?.targetType}
              mediaType={page.context?.mediaType}
            />
          )}
          {page.type === PageTypes.PostComposerPage && (
            <PostComposerPage
              mode={page.context?.mode}
              targetId={page.context?.targetId}
              targetType={page.context?.targetType}
              community={page.context?.community}
              post={page.context?.post}
            />
          )}
          {page.type === PageTypes.SelectPostTargetPage && <SelectPostTargetPage />}
          {page.type === PageTypes.MyCommunitiesSearchPage && <MyCommunitiesSearchPage />}
          {page.type === PageTypes.AllCategoriesPage && <AllCategoriesPage />}
          {page.type === PageTypes.CommunitiesByCategoryPage && (
            <CommunitiesByCategoryPage categoryId={page.context.categoryId} />
          )}
          {page.type === PageTypes.CommunitySetupPage && (
            <CommunitySetupPage mode={page.context?.mode} community={page.context?.community} />
          )}
          {page.type === PageTypes.CommunityAddCategoryPage && (
            <CommunityAddCategoryPage category={page.context.categories} />
          )}
          {page.type === PageTypes.CommunityAddMemberPage && (
            <CommunityAddMemberPage
              member={page.context?.members}
              communityId={page.context?.communityId}
              onAddedAction={page.context?.onAddedAction}
            />
          )}
          {/* V3 */}
          {page.type === PageTypes.CommunityFeed && (
            <CommunityFeed
              communityId={page.context.communityId}
              isNewCommunity={page.context.isNewCommunity}
              isOpen={open}
              toggleOpen={toggleOpen}
            />
          )}
          {page.type === PageTypes.UserFeed && (
            <UserFeedPage userId={page.context.userId} socialSettings={socialSettings} />
          )}
          {page.type === PageTypes.CommunityEdit && (
            <CommunityEditPage communityId={page.context.communityId} tab={page.context.tab} />
          )}

          {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.context.userId} />}
          {page.type === PageTypes.CommunityCreatePage && (
            <CommunityCreationModal isOpen={true} onClose={onBack} />
          )}
          {page.type === PageTypes.CommunitySettingPage && (
            <CommunitySettingPage community={page.context.community} />
          )}
          {page.type === PageTypes.CommunityPostPermissionPage && (
            <CommunityPostPermissionPage community={page.context.community} />
          )}
          {page.type === PageTypes.CommunityStorySettingPage && (
            <CommunityStorySettingPage community={page.context.community} />
          )}
          {page.type === PageTypes.PendingPostsPage && (
            <PendingPostsPage communityId={page.context.communityId} />
          )}
          {page.type === PageTypes.CommunityMembershipPage && (
            <CommunityMembershipPage community={page.context.community} />
          )}

          {/*End of V3 */}
        </div>
      </CommunitySetupProvider>
    </StoryProvider>
  );
};

export default Application;
