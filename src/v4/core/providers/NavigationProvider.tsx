import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import { AmityStoryMediaType } from '~/v4/social/pages/DraftsPage/DraftsPage';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { NavigationContext as NavigationContextV3 } from '~/social/providers/NavigationProvider';
import { AmityPostCategory } from '~/v4/social/components/PostContent/PostContent';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import {
  AmityCommunitySetupPageMode,
  MemberCommunitySetup,
} from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { AmityRoute } from './AmityUIKitProvider';

export enum PageTypes {
  Explore = 'explore',
  NewsFeed = 'newsfeed',
  CommunityFeed = 'communityFeed',
  CommunityEdit = 'communityEdit',
  Category = 'category',
  ViewStoryPage = 'ViewStoryPage',
  SocialHomePage = 'SocialHomePage',
  PostDetailPage = 'PostDetailPage',
  CommunityProfilePage = 'CommunityProfilePage',
  CommunitySetupPage = 'CommunitySetupPage',
  UserProfilePage = 'UserProfilePage',
  EditUserProfilePage = 'EditUserProfilePage',
  UserRelationshipPage = 'UserRelationshipPage',
  BlockedUsersPage = 'BlockedUsersPage',
  UserPendingFollowRequestPage = 'UserPendingFollowRequestPage',
  SocialGlobalSearchPage = 'SocialGlobalSearchPage',
  SelectPostTargetPage = 'SelectPostTargetPage',
  DraftPage = 'DraftPage',
  PostComposerPage = 'PostComposerPage',
  MyCommunitiesSearchPage = 'MyCommunitiesSearchPage',
  StoryTargetSelectionPage = 'StoryTargetSelectionPage',
  PollTargetSelectionPage = 'PollTargetSelectionPage',
  AllCategoriesPage = 'AllCategoriesPage',
  CommunitiesByCategoryPage = 'CommunitiesByCategoryPage',
  CommunityAddCategoryPage = 'CommunityAddCategoryPage',
  CommunityAddMemberPage = 'CommunityAddMemberPage',
  CommunitySettingPage = 'CommunitySettingPage',
  CommunityPostPermissionPage = 'CommunityPostPermissionPage',
  CommunityStorySettingPage = 'CommunityStorySettingPage',
  PendingPostsPage = 'PendingPostsPage',
  CommunityMembershipPage = 'CommunityMembershipPage',
  CommunityCreatePage = 'CommunityCreatePage',
  PollPostComposerPage = 'PollPostComposerPage',
}

type Page =
  | {
      type: PageTypes.Explore | PageTypes.NewsFeed;
      context: { communityId?: string };
    }
  | {
      type: PageTypes.CommunityFeed;
      context: {
        communityId: string;
        isNewCommunity: boolean;
      };
    }
  | {
      type: PageTypes.CommunityEdit;
      context: {
        communityId: string;
        tab: string;
      };
    }
  | {
      type: PageTypes.Category;
      context: {
        categoryId: string;
        communityId?: string;
      };
    }
  | {
      type: PageTypes.ViewStoryPage;
      context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      };
    }
  | {
      type: PageTypes.PostDetailPage;
      context: {
        postId: string;
        communityId?: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
      };
    }
  | { type: PageTypes.CommunityProfilePage; context: { communityId: string; page?: number } }
  | { type: PageTypes.UserProfilePage; context: { userId: string; communityId?: string } }
  | { type: PageTypes.EditUserProfilePage; context: { userId: string } }
  | {
      type: PageTypes.UserRelationshipPage;
      context: { userId: string; selectedTab: UserRelationshipPageTabs };
    }
  | { type: PageTypes.UserPendingFollowRequestPage; context: { userId: string } }
  | { type: PageTypes.BlockedUsersPage }
  | { type: PageTypes.SocialHomePage; context: { communityId?: string } }
  | { type: PageTypes.SocialGlobalSearchPage; context: { tab?: string } }
  | { type: PageTypes.MyCommunitiesSearchPage; context: { communityId?: string } }
  | { type: PageTypes.SelectPostTargetPage }
  | {
      type: PageTypes.DraftPage;
      context: {
        communityId?: string;
        mediaType: AmityStoryMediaType;
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      };
    }
  | {
      type: PageTypes.PostComposerPage;
      context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        mode: Mode;
        community?: Amity.Community;
        post?: Amity.Post;
      };
    }
  | {
      type: PageTypes.StoryTargetSelectionPage;
    }
  | {
      type: PageTypes.AllCategoriesPage;
    }
  | {
      type: PageTypes.CommunitiesByCategoryPage;
      context: {
        categoryId: string;
      };
    }
  | {
      type: PageTypes.CommunitySetupPage;
      context: {
        mode: AmityCommunitySetupPageMode;
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityAddCategoryPage;
      context: {
        categories?: Amity.Category[];
      };
    }
  | {
      type: PageTypes.PollPostComposerPage;
      context: {
        targetId: string | null;
        targetType: 'community' | 'user';
      };
    }
  | {
      type: PageTypes.CommunityAddMemberPage;
      context: {
        members?: MemberCommunitySetup[];
        communityId?: string;
        onAddedAction?: (userId: string[]) => void;
      };
    }
  | {
      type: PageTypes.CommunitySettingPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityPostPermissionPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityStorySettingPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.PendingPostsPage;
      context: {
        communityId: string;
      };
    }
  | {
      type: PageTypes.CommunityMembershipPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.PollTargetSelectionPage;
    };

type ContextValue = {
  page: Page;
  prevPage?: Page;
  onChangePage: (type: string) => void;
  onClickCategory: (categoryId: string) => void;
  onClickCommunity: (communityId: string) => void;
  onClickUser: (userId: string, pageType?: string) => void;
  onCommunityCreated: (communityId: string) => void;
  onEditCommunity: (communityId: string, tab?: string) => void;
  onMessageUser: (userId: string) => void;
  onBack: (page?: number) => void;
  goToUserProfilePage: (userId: string) => void;
  goToEditUserPage: (userId: string) => void;
  goToUserRelationshipPage: (userId: string, selectedTab: UserRelationshipPageTabs) => void;
  goToPendingFollowRequestPage: () => void;
  goToBlockedUsersPage: () => void;
  goToPostDetailPage: (postId: string, hideTarget?: boolean, category?: AmityPostCategory) => void;
  goToCommunityProfilePage: (communityId: string, page?: number) => void;
  goToSocialGlobalSearchPage: (tab?: string) => void;
  goToMyCommunitiesSearchPage: () => void;
  goToSelectPostTargetPage: () => void;
  goToSelectPollPostTargetPage: () => void;
  goToStoryTargetSelectionPage: () => void;
  goToPollPostComposerPage: (context: {
    targetId: string | null;
    targetType: 'community' | 'user';
  }) => void;
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
  goToViewStoryPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
  setNavigationBlocker?: (
    params:
      | {
          title: ReactNode;
          content: ReactNode;
          okText: ReactNode;
        }
      | null
      | undefined,
  ) => void;
  goToPostComposerPage: (
    context:
      | {
          mode: Mode.CREATE;
          targetId: string | null;
          targetType: 'community' | 'user';
          community?: Amity.Community;
        }
      | { mode: Mode.EDIT; post: Amity.Post },
  ) => void;
  goToStoryCreationPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
  goToSocialHomePage: () => void;
  goToAllCategoriesPage: () => void;
  goToCommunitiesByCategoryPage: (context: { categoryId: string }) => void;
  goToCreateCommunityPage?: (context: { mode: AmityCommunitySetupPageMode }) => void;

  goToAddCategoryPage?: (context: { categories?: Amity.Category[] }) => void;
  goToAddMemberPage?: (context: {
    members?: MemberCommunitySetup[];
    communityId?: string;
    onAddedAction?: (userId: string[]) => void;
  }) => void;
  goToCommunitySettingPage?: (community: Amity.Community) => void;
  goToEditCommunityPage?: (context: {
    mode: AmityCommunitySetupPageMode;
    community: Amity.Community;
  }) => void;
  goToMembershipPage?: (community: Amity.Community) => void;
  goToPostPermissionPage?: (community: Amity.Community) => void;
  goToStorySettingPage?: (community: Amity.Community) => void;
  goToPendingPostPage?: (communityId: string) => void;

  //V3 functions
  onClickStory: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => void;
};

let defaultValue: ContextValue = {
  page: { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
  onChangePage: (type: string) => {},
  onClickCategory: (categoryId: string) => {},
  onClickCommunity: (communityId: string) => {},
  onClickUser: (userId: string) => {},
  onCommunityCreated: (communityId: string) => {},
  onEditCommunity: (communityId: string) => {},
  onMessageUser: (userId: string) => {},
  goToUserProfilePage: (userId: string) => {},
  goToEditUserPage: (userId: string) => {},
  goToUserRelationshipPage: (userId: string, selectedTab: UserRelationshipPageTabs) => {},
  goToPendingFollowRequestPage: () => {},
  goToBlockedUsersPage: () => {},
  goToPostDetailPage: (postId: string, hideTarget?: boolean, category?: AmityPostCategory) => {},
  goToViewStoryPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    storyType: 'communityFeed' | 'globalFeed';
  }) => {},
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => {},
  goToCommunityProfilePage: (communityId: string, page?: number) => {},
  goToSocialGlobalSearchPage: (tab?: string) => {},
  goToSelectPostTargetPage: () => {},
  goToStoryTargetSelectionPage: () => {},
  goToSelectPollPostTargetPage: () => {},
  goToPollPostComposerPage: () => {},
  goToPostComposerPage: () => {},
  goToStoryCreationPage: () => {},
  goToSocialHomePage: () => {},
  goToMyCommunitiesSearchPage: () => {},
  goToAllCategoriesPage: () => {},
  goToCommunitiesByCategoryPage: (context: { categoryId: string }) => {},
  goToCreateCommunityPage: () => {},
  goToAddCategoryPage: () => {},
  goToAddMemberPage: () => {},
  goToCommunitySettingPage: (community: Amity.Community) => {},
  goToEditCommunityPage: () => {},
  goToMembershipPage: (community: Amity.Community) => {},
  goToPostPermissionPage: (community: Amity.Community) => {},
  goToStorySettingPage: (community: Amity.Community) => {},
  goToPendingPostPage: (communityId: string) => {},

  setNavigationBlocker: () => {},
  onBack: (page?: number) => {},
  //V3 functions
  onClickStory: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => {},
};

if (process.env.NODE_ENV !== 'production') {
  defaultValue = {
    page: { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
    onChangePage: (type) => console.log(`NavigationContext onChangePage(${type})`),
    onClickCategory: (categoryId) =>
      console.log(`NavigationContext onClickCategory(${categoryId})`),
    onClickCommunity: (communityId) =>
      console.log(`NavigationContext onClickCommunity(${communityId})`),
    onClickUser: (userId) => console.log(`NavigationContext onClickUser(${userId})`),
    goToViewStoryPage: ({ targetId, storyType, targetType }) =>
      console.log(`NavigationContext goToViewStoryPage(${targetId}, ${storyType}, ${targetType})`),
    onCommunityCreated: (communityId) =>
      console.log(`NavigationContext onCommunityCreated(${communityId})`),
    onEditCommunity: (communityId) =>
      console.log(`NavigationContext onEditCommunity({${communityId})`),
    onMessageUser: (userId) => console.log(`NavigationContext onMessageUser(${userId})`),
    onBack: (page?: number) => console.log(`NavigationContext onBack(${page})`),
    goToUserProfilePage: (userId) =>
      console.log(`NavigationContext goToUserProfilePage(${userId})`),
    goToEditUserPage: (userId) => console.log(`NavigationContext goToEditUserPage(${userId})`),
    goToUserRelationshipPage: (userId, selectedTab) =>
      console.log(`NavigationContext goToUserRelationshipPage(${userId}, ${selectedTab})`),
    goToPendingFollowRequestPage: () =>
      console.log(`NavigationContext goToPendingFollowRequestPage()`),
    goToBlockedUsersPage: () => console.log(`NavigationContext goToBlockedUsersPage()`),
    goToPostDetailPage: (postId, hideTarget, category) =>
      console.log(`NavigationContext goToPostDetailPage(${postId} ${hideTarget} ${category})`),
    goToCommunityProfilePage: (communityId, page) =>
      console.log(`NavigationContext goToCommunityProfilePage(${communityId} ${page})`),
    goToSocialGlobalSearchPage: (tab) =>
      console.log(`NavigationContext goToSocialGlobalSearchPage(${tab})`),
    goToSelectPostTargetPage: () => console.log('NavigationContext goToTargetPage()'),
    goToSelectPollPostTargetPage: () =>
      console.log(`NavigationContext goToSelectPollPostTargetPage()`),
    goToPollPostComposerPage: (context) =>
      console.log(`NavigationContext goToPollPostComposerPage(${context})`),
    goToStoryTargetSelectionPage: () =>
      console.log('NavigationContext goToStoryTargetSelectionPage()'),
    goToDraftStoryPage: (data) => console.log(`NavigationContext goToDraftStoryPage()`),
    goToPostComposerPage: () => console.log(`NavigationContext goToPostComposerPage()`),
    goToStoryCreationPage: () => console.log('NavigationContext goToStoryCreationPage()'),
    goToSocialHomePage: () => console.log('NavigationContext goToSocialHomePage()'),
    goToMyCommunitiesSearchPage: () =>
      console.log('NavigationContext goToMyCommunitiesSearchPage()'),
    goToAllCategoriesPage: () => console.log('NavigationContext goToAllCategoriesPage()'),
    goToCommunitiesByCategoryPage: (context) =>
      console.log(`NavigationContext goToCommunitiesByCategoryPage(${context})`),
    goToCreateCommunityPage: () => console.log('NavigationContext goToCreateCommunityPage()'),
    goToEditCommunityPage: () => console.log('NavigationContext goToEditCommunityPage()'),
    goToAddCategoryPage: () => console.log('NavigationContext goToAddCategoryPage()'),
    goToAddMemberPage: () => console.log('NavigationContext goToAddMemberPage()'),
    goToCommunitySettingPage: (community) =>
      console.log(`NavigationContext goToCommunitySettingPage(${community})`),

    //V3 functions
    onClickStory: (storyId, storyType, targetIds) =>
      console.log(`NavigationContext onClickStory(${storyId}, ${storyType}, ${targetIds})`),
  };
}

export const NavigationContext = createContext<ContextValue>(defaultValue);

export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  askForConfirmation?: (params: {
    title: React.ReactNode;
    content: React.ReactNode;
    okText: React.ReactNode;
    onSuccess: () => void;
    onCancel: () => void;
  }) => void;
  children: React.ReactNode;
  onChangePage?: (
    data:
      | { type: string; [x: string]: string | boolean }
      | {
          type: string;
          context: {
            [x: string]: string | boolean;
          };
        },
  ) => void;
  onClickCategory?: (categoryId: string) => void;
  onClickCommunity?: (communityId: string) => void;
  onClickUser?: (userId: string) => void;
  goToViewStoryPage?: (context: {
    storyId: string;
    storyType: 'communityFeed' | 'globalFeed';
    targetType: Amity.StoryTargetType;
  }) => void;
  goToDraftStoryPage?: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
  goToAllCategoriesPage?: () => void;
  goToCommunitiesByCategoryPage?: (context: { categoryId: string }) => void;
  goToCreateCommunityPage?: (context: { mode: AmityCommunitySetupPageMode }) => void;
  goToEditCommunityPage?: (context: {
    mode: AmityCommunitySetupPageMode;
    community: Amity.Community;
  }) => void;

  onCommunityCreated?: (communityId: string) => void;
  goToCommunityCreatePage?: () => void;
  onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
  onEditUser?: (userId: string) => void;
  onMessageUser?: (userId: string) => void;
  onBack?: (page?: number) => void;
  //V3 functions
  onClickStory?: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => void;
  activeRoute?: AmityRoute;
  onRouteChange?: (route: AmityRoute) => void;
}

const getDefaultRoute = (activeRoute?: AmityRoute): Page => {
  if (activeRoute?.route === 'community') {
    if (activeRoute?.id) {
      return {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId: activeRoute.id,
        },
      };
    }
  }
  if (activeRoute?.route === 'user') {
    if (activeRoute?.id) {
      return {
        type: PageTypes.UserProfilePage,
        context: {
          userId: activeRoute.id,
        },
      };
    }
  }

  if (activeRoute?.route === 'post') {
    if (activeRoute?.id) {
      return {
        type: PageTypes.PostDetailPage,
        context: {
          postId: activeRoute?.id,
        },
      };
    }
  }

  return { type: PageTypes.SocialHomePage, context: { communityId: undefined } };
};

export default function NavigationProvider({
  askForConfirmation,
  children,
  activeRoute,
  onRouteChange,
  onChangePage: onChangePageProp,
  onClickCategory,
  onClickCommunity,
  onClickUser,
  onCommunityCreated,
  onEditCommunity,
  onEditUser,
  onMessageUser,
  onBack,
}: NavigationProviderProps) {
  const [pages, setPages] = useState<Page[]>([getDefaultRoute(activeRoute)]);
  const currentPage = useMemo(() => pages[pages.length - 1], [pages]);
  const prevPage = useMemo(() => pages[pages.length - 2], [pages]);
  const [navigationBlocker, setNavigationBlocker] = useState<
    | {
        title: ReactNode;
        content: ReactNode;
        okText: ReactNode;
      }
    | null
    | undefined
  >();

  const confirmation = askForConfirmation ?? confirm;

  const pushPage = useCallback(async (newPage) => {
    setPages((prevState) => [...prevState, newPage]);
  }, []);

  const popPage = (page?: number) => {
    setPages((prevState) => {
      const pagesToRemove = page && page > 0 ? page : 1;

      if (prevState.length > pagesToRemove) {
        return prevState.slice(0, -pagesToRemove);
      }
      return prevState;
    });
  };

  const onChangePage = onChangePageProp
    ? async (
        data:
          | { type: string; [x: string]: string | boolean }
          | {
              type: string;
              context: {
                [x: string]: string | boolean;
              };
            },
      ) => {
        onChangePageProp(data);
      }
    : null;

  const handleChangePage = useCallback(
    (type) => {
      pushPage({ type });
    },
    [pushPage],
  );

  const handleClickCommunity = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCommunity) return onClickCommunity(communityId);

      pushPage(next);
    },
    [onClickCommunity, pushPage],
  );

  const handleCommunityCreated = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        communityId,
        isNewCommunity: true,
      };

      if (onChangePage) return onChangePage(next);
      if (onCommunityCreated) return onCommunityCreated(communityId);

      pushPage(next);
    },
    [onChangePage, onCommunityCreated, pushPage],
  );

  const handleClickCategory = useCallback(
    (categoryId) => {
      const next = {
        type: PageTypes.Category,
        categoryId,
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCategory) return onClickCategory(categoryId);

      pushPage(next);
    },
    [onChangePage, onClickCategory, pushPage],
  );

  const handleClickUser = useCallback(
    (userId, pageType) => {
      const next = {
        type: pageType ?? PageTypes.UserProfilePage,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onClickUser) return onClickUser(userId);

      pushPage(next);
    },
    [onChangePage, onClickUser, pushPage],
  );

  const handleEditUser = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.EditUserProfilePage,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      pushPage(next);
    },
    [onChangePage, onEditUser, pushPage],
  );

  const goToEditUserPage = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.EditUserProfilePage,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      pushPage(next);
    },
    [onChangePage, onEditUser, pushPage],
  );

  const goToUserRelationshipPage = useCallback(
    (userId, selectedTab) => {
      const next = {
        type: PageTypes.UserRelationshipPage,
        context: {
          userId,
          selectedTab,
        },
      };

      if (onChangePage) return onChangePage(next);

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPendingFollowRequestPage = useCallback(() => {
    const next = {
      type: PageTypes.UserPendingFollowRequestPage,
    };

    if (onChangePage) return onChangePage(next);

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToBlockedUsersPage = useCallback(() => {
    const next = {
      type: PageTypes.BlockedUsersPage,
    };

    if (onChangePage) return onChangePage(next);

    pushPage(next);
  }, [onChangePage, pushPage]);

  const handleEditCommunity = useCallback(
    (communityId, tab) => {
      const next = {
        type: PageTypes.CommunityEdit,
        context: {
          communityId,
          tab,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditCommunity) return onEditCommunity(communityId, { tab });

      pushPage(next);
    },
    [onChangePage, onEditCommunity, pushPage],
  );

  const handleMessageUser = useCallback(
    (userId) => {
      const next = {
        type: 'conversation',
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onMessageUser) return onMessageUser(userId);
    },
    [onChangePage, onMessageUser],
  );

  const handleBack = useCallback(
    (page?: number) => {
      if (onBack) {
        onBack(page);
      }
      popPage(page);
    },
    [onChangePage, onBack, popPage],
  );

  const goToViewStoryPage = useCallback(
    ({ targetId, storyType, targetType }) => {
      const next = {
        type: PageTypes.ViewStoryPage,
        context: {
          targetId,
          storyType,
          targetType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToUserProfilePage = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.UserProfilePage,
        context: {
          userId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPostDetailPage = useCallback(
    (postId, hideTarget, category) => {
      const next = {
        type: PageTypes.PostDetailPage,
        context: {
          postId,
          hideTarget,
          category,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCommunityProfilePage = useCallback(
    (communityId, page = 1) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId,
          page,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToSocialGlobalSearchPage = useCallback(
    (tab?: string) => {
      const next = {
        type: PageTypes.SocialGlobalSearchPage,
        context: { tab },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );
  const goToSelectPostTargetPage = useCallback(() => {
    const next = {
      type: PageTypes.SelectPostTargetPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToStoryTargetSelectionPage = useCallback(() => {
    const next = {
      type: PageTypes.StoryTargetSelectionPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToSelectPollPostTargetPage = useCallback(() => {
    const next = {
      type: PageTypes.PollTargetSelectionPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToStoryCreationPage = useCallback(
    ({ targetId, targetType, mediaType, storyType }) => {
      const next = {
        type: PageTypes.DraftPage,
        context: {
          targetId,
          targetType,
          mediaType,
          storyType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToDraftStoryPage = useCallback(
    (targetId, targetType, mediaType, storyType) => {
      const next = {
        type: PageTypes.DraftPage,
        context: {
          targetId,
          targetType,
          mediaType,
          storyType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToSocialHomePage = useCallback(() => {
    const next = {
      type: PageTypes.SocialHomePage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToPostComposerPage = useCallback(
    (
      context:
        | {
            mode: Mode.CREATE;
            targetId: string | null;
            targetType: 'community' | 'user';
            community?: Amity.Community;
          }
        | { mode: Mode.EDIT; post: Amity.Post },
    ) => {
      const next = {
        type: PageTypes.PostComposerPage,
        context,
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCreateCommunityPage = useCallback(() => {
    const next = {
      type: PageTypes.CommunitySetupPage,
      context: {
        mode: AmityCommunitySetupPageMode.CREATE,
      },
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToEditCommunityPage = useCallback(
    ({ mode, community }) => {
      const next = {
        type: PageTypes.CommunitySetupPage,
        context: {
          mode,
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToMyCommunitiesSearchPage = useCallback(() => {
    const next = {
      type: PageTypes.MyCommunitiesSearchPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToAllCategoriesPage = useCallback(() => {
    const next = {
      type: PageTypes.AllCategoriesPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToCommunitiesByCategoryPage = useCallback(
    (context) => {
      const next = {
        type: PageTypes.CommunitiesByCategoryPage,
        context,
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToAddCategoryPage = useCallback(
    ({ categories }) => {
      const next = {
        type: PageTypes.CommunityAddCategoryPage,
        context: {
          categories,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToAddMemberPage = useCallback(
    ({ member, communityId, onAddedAction }) => {
      const next = {
        type: PageTypes.CommunityAddMemberPage,
        context: {
          member,
          communityId,
          onAddedAction,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const handleClickStory = useCallback(
    (targetId, storyType, targetIds) => {
      const next = {
        type: PageTypes.ViewStoryPage,
        context: {
          targetId,
          storyType,
          targetIds,
        },
      };

      if (onChangePage) return onChangePage(next);

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCommunitySettingPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunitySettingPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPostPermissionPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityPostPermissionPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToStorySettingPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityStorySettingPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPendingPostPage = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.PendingPostsPage,
        context: {
          communityId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToMembershipPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityMembershipPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPollPostComposerPage = useCallback(
    ({ targetId, targetType }) => {
      const next = {
        type: PageTypes.PollPostComposerPage,
        context: {
          targetId,
          targetType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  useEffect(() => {
    if (currentPage.type === PageTypes.CommunityProfilePage) {
      onRouteChange?.({
        route: 'community',
        id: currentPage.context.communityId,
      });
    } else if (currentPage.type === PageTypes.UserProfilePage) {
      onRouteChange?.({ route: 'user', id: currentPage.context.userId });
    } else if (currentPage.type === PageTypes.PostDetailPage) {
      onRouteChange?.({ route: 'post', id: currentPage.context.postId });
    } else {
      onRouteChange?.({ route: '', id: undefined });
    }
  }, [currentPage]);

  return (
    <NavigationContext.Provider
      value={{
        page: currentPage,
        prevPage,
        onChangePage: handleChangePage,
        onClickCategory: handleClickCategory,
        onClickCommunity: handleClickCommunity,
        onClickUser: handleClickUser,
        onCommunityCreated: handleCommunityCreated,
        onEditCommunity: handleEditCommunity,
        onMessageUser: handleMessageUser,
        onBack: handleBack,
        goToUserProfilePage,
        goToPostDetailPage,
        goToEditUserPage,
        goToSocialGlobalSearchPage,
        goToCommunityProfilePage,
        goToViewStoryPage,
        goToSelectPostTargetPage,
        goToStoryTargetSelectionPage,
        goToSelectPollPostTargetPage,
        goToStoryCreationPage,
        goToDraftStoryPage,
        goToPostComposerPage,
        goToSocialHomePage,
        goToMyCommunitiesSearchPage,
        goToAllCategoriesPage,
        goToCommunitiesByCategoryPage,
        goToCreateCommunityPage,
        goToEditCommunityPage,
        goToAddCategoryPage,
        goToAddMemberPage,
        goToCommunitySettingPage,
        goToPostPermissionPage,
        goToStorySettingPage,
        goToPendingPostPage,
        goToMembershipPage,
        goToPollPostComposerPage,
        setNavigationBlocker,
        goToUserRelationshipPage,
        goToPendingFollowRequestPage,
        goToBlockedUsersPage,
        onClickStory: handleClickStory,
      }}
    >
      <NavigationContextV3.Provider
        value={{
          page: currentPage as any, //TODO : Fix any type
          onChangePage: handleChangePage,
          onClickCategory: handleClickCategory,
          onClickCommunity: handleClickCommunity,
          onClickUser: handleClickUser,
          onCommunityCreated: handleCommunityCreated,
          onEditCommunity: handleEditCommunity,
          onEditUser: handleEditUser,
          onMessageUser: handleMessageUser,
          onBack: handleBack,
          setNavigationBlocker,
          goToDraftStoryPage,
          onClickStory: handleClickStory,
        }}
      >
        {children}
      </NavigationContextV3.Provider>
    </NavigationContext.Provider>
  );
}
