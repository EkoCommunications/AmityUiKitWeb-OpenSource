import React, { createContext, useContext, useState, useEffect } from 'react';
import { AmityReactionType } from './CustomReactionProvider';
import { useTheme } from './ThemeProvider';

export const getCustomizationKeys = ({
  page,
  component,
  element,
}: {
  page: string;
  component: string;
  element: string;
}) => {
  if (element !== '*') {
    return [
      `${page}/${component}/${element}`,
      `*/${component}/${element}`,
      `${page}/*/${element}`,
      `*/*/${element}`,
      `${page}/${component}/*`,
      `*/${component}/*`,
      `${page}/*/*`,
    ];
  } else if (component !== '*') {
    return [`${page}/${component}/*`, `${page}/*/*`, `*/${component}/*`];
  } else if (page !== '*') {
    return [`${page}/*/*`];
  }

  return [];
};

export type GetConfigReturnValue = IconConfiguration &
  TextConfiguration &
  ThemeConfiguration &
  CustomConfiguration;

interface CustomizationContextValue {
  config: Config | null;
  parseConfig: (config: Config) => void;
  isExcluded: (path: string) => boolean;
  getConfig: (
    path: string,
  ) => IconConfiguration & TextConfiguration & ThemeConfiguration & CustomConfiguration;
}

type ThemeValue = {
  primary_color: string;
  secondary_color: string;
  secondary_shade1_color: string;
  secondary_shade2_color: string;
  secondary_shade3_color: string;
  secondary_shade4_color: string;
  base_color: string;
  base_shade1_color: string;
  base_shade2_color: string;
  base_shade3_color: string;
  base_shade4_color: string;
  base_shade5_color: string;
  alert_color: string;
  background_color: string;
  base_inverse_color: string;
};

export type Theme = {
  light: ThemeValue;
  dark: ThemeValue;
};

type ThemeConfiguration = {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Partial<Theme['light']>;
    dark?: Partial<Theme['dark']>;
  };
};

export interface Config {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Theme['light'];
    dark?: Theme['dark'];
  };
  excludes?: string[];
  message_reactions?: AmityReactionType[];
  customizations?: {
    [key: string]: IconConfiguration & TextConfiguration & ThemeConfiguration & CustomConfiguration;
  };
}

type DefaultConfig = {
  preferred_theme: 'light' | 'dark' | 'default';
  theme: {
    light: Theme['light'];
    dark: Theme['dark'];
  };
  excludes: string[];
  customizations?: {
    [key: string]: IconConfiguration & TextConfiguration & ThemeConfiguration & CustomConfiguration;
  };
};

const CustomizationContext = createContext<CustomizationContextValue>({
  config: null,
  parseConfig: () => {},
  isExcluded: () => false,
  getConfig: () => ({}),
});

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

interface CustomizationProviderProps {
  children: React.ReactNode;
  initialConfig: Config | undefined;
}

type IconConfiguration = {
  icon?: string;
  image?: string;
};
type TextConfiguration = {
  text?: string;
};
type CustomConfiguration = {
  [key: string]: string | undefined | boolean | Array<string> | number | Record<string, unknown>;
};

export const defaultConfig: DefaultConfig = {
  preferred_theme: 'default',
  theme: {
    light: {
      primary_color: '#1054de',
      secondary_color: '#292b32',
      secondary_shade1_color: '#636878',
      secondary_shade2_color: '#898e9e',
      secondary_shade3_color: '#a5a9b5',
      secondary_shade4_color: '#ebecef',
      base_color: '#292b32',
      base_shade1_color: '#636878',
      base_shade2_color: '#898e9e',
      base_shade3_color: '#a5a9b5',
      base_shade4_color: '#ebecef',
      base_shade5_color: '#F9F9FA',
      alert_color: '#FA4D30',
      background_color: '#FFFFFF',
      base_inverse_color: '#000000',
    },
    dark: {
      primary_color: '#1054de',
      secondary_color: '#ebecef',
      secondary_shade1_color: '#a5a9b5',
      secondary_shade2_color: '#898e9e',
      secondary_shade3_color: '#40434e',
      secondary_shade4_color: '#292b32',
      base_color: '#ebecef',
      base_shade1_color: '#a5a9b5',
      base_shade2_color: '#6e7487',
      base_shade3_color: '#40434e',
      base_shade4_color: '#292b32',
      base_shade5_color: '#f9f9fa',
      alert_color: '#FA4D30',
      background_color: '#191919',
      base_inverse_color: '#FFFFFF',
    },
  },
  excludes: [],
  customizations: {
    'select_target_page/*/*': {
      theme: {},
      title: 'Share to',
    },
    'select_target_page/*/back_button': {
      back_icon: 'back.png',
    },
    'camera_page/*/*': {
      resolution: '720p',
    },
    'camera_page/*/close_button': {
      close_icon: 'close.png',
    },
    'create_story_page/*/*': {},
    'create_story_page/*/back_button': {
      back_icon: 'back.png',
      background_color: '#1234DB',
    },
    'create_story_page/*/aspect_ratio_button': {
      aspect_ratio_icon: 'aspect_ratio.png',
      background_color: '1234DB',
    },
    'create_story_page/*/story_hyperlink_button': {
      hyperlink_button_icon: 'hyperlink_button.png',
      background_color: '#1234DB',
    },
    'create_story_page/*/hyper_link': {
      hyper_link_icon: 'hyper_link.png',
      background_color: '#1234DB',
    },
    'create_story_page/*/share_story_button': {
      share_icon: 'share_story_button.png',
      background_color: '#1234DB',
      hide_avatar: false,
    },
    'story_page/*/*': {},
    'story_page/*/progress_bar': {
      progress_color: '#UD1234',
      background_color: '#AB1234',
    },
    'story_page/*/overflow_menu': {
      overflow_menu_icon: 'threeDot.png',
    },
    'story_page/*/close_button': {
      close_icon: 'close.png',
    },
    'story_page/*/story_impression_button': {
      impression_icon: 'impressionIcon.png',
    },
    'story_page/*/story_comment_button': {
      comment_icon: 'comment.png',
      background_color: '#2b2b2b',
    },
    'story_page/*/story_reaction_button': {
      reaction_icon: 'like.png',
      background_color: '#2b2b2b',
    },
    'story_page/*/create_new_story_button': {
      create_new_story_icon: 'plus.png',
      background_color: '#ffffff',
    },
    'story_page/*/speaker_button': {
      mute_icon: 'mute.png',
      unmute_icon: 'unmute.png',
      background_color: '#1243EE',
    },
    'story_page/*/arrow_left_button': {
      arrow_left_icon: 'arrow_left.png',
      background_color: '#1243EE',
    },
    'story_page/*/arrow_right_button': {
      arrow_right_icon: 'arrow_right.png',
      background_color: '#1243EE',
    },
    '*/edit_comment_component/*': {
      theme: {},
    },
    '*/edit_comment_component/edit_cancel_button': {
      cancel_icon: '',
      cancel_button_text: 'Cancel',
      background_color: '',
    },
    '*/edit_comment_component/save_button': {
      save_icon: '',
      save_button_text: 'Save',
      background_color: '#1243EE',
    },
    '*/hyper_link_config_component/*': {
      theme: {},
    },
    '*/hyper_link_config_component/done_button': {
      done_icon: '',
      done_button_text: 'Done',
      background_color: '#1243EE',
    },
    '*/hyper_link_config_component/edit_cancel_button': {
      cancel_icon: '',
      cancel_button_text: 'Cancel',
    },
    '*/comment_tray_component/*': {
      theme: {},
    },
    '*/comment_tray_component/comment_bubble_deleted_view': {
      comment_bubble_deleted_icon: 'comment_bubble_deleted.png',
      text: 'This reply has been deleted',
    },
    '*/story_tab_component/*': {},
    '*/story_tab_component/story_ring': {
      progress_color: ['#339AF9', '#78FA58'],
      background_color: '#AB1234',
    },
    '*/story_tab_component/create_new_story_button': {
      create_new_story_icon: 'plus.png',
      background_color: '#1243EE',
    },
    '*/*/close_button': {
      close_icon: 'close.png',
    },
    'social_home_page/top_navigation/header_label': {
      text: 'Community',
    },
    'social_home_page/top_navigation/global_search_button': {
      icon: 'searchButtonIcon',
    },
    'social_home_page/top_navigation/post_creation_button': {
      icon: 'postCreationIcon',
    },
    'social_home_page/*/newsfeed_button': {
      text: 'Newsfeed',
    },
    'social_home_page/*/explore_button': {
      text: 'Explore',
    },
    'social_home_page/*/my_communities_button': {
      text: 'My Communities',
    },
    'social_home_page/empty_newsfeed/illustration': {
      icon: 'emptyFeedIcon',
    },
    'social_home_page/empty_newsfeed/title': {
      text: 'Your Feed is empty',
    },
    'social_home_page/empty_newsfeed/description': {
      text: 'Find community or create your own.',
    },
    'social_home_page/empty_newsfeed/explore_communities_button': {
      icon: 'exploreCommunityIcon',
      text: 'Explore Community',
    },
    'social_home_page/empty_newsfeed/create_community_button': {
      icon: 'createCommunityIcon',
      text: 'Create Community',
    },
    'social_home_page/my_communities/community_avatar': {},
    'social_home_page/my_communities/community_display_name': {},
    'social_home_page/my_communities/community_private_badge': {
      icon: 'lockIcon',
    },
    'social_home_page/my_communities/community_official_badge': {
      icon: 'officalBadgeIcon',
    },
    'social_home_page/my_communities/community_category_name': {},
    'social_home_page/my_communities/community_members_count': {},
    'social_home_page/newsfeed_component/*': {},
    'social_home_page/global_feed_component/*': {},
    'social_home_page/post_composer/image_button': {
      icon: 'ImageIcon',
    },
    'social_home_page/post_composer/video_button': {
      icon: 'VideoIcon',
    },
    'social_home_page/post_composer/story_button': {
      icon: 'ImageIcon',
    },
    'global_search_page/*/*': {},
    'post_detail_page/*/back_button': {
      icon: 'backButtonIcon',
    },
    'post_detail_page/*/menu_button': {
      icon: 'menuIcon',
    },
    '*/*/moderator_badge': {
      icon: 'badgeIcon',
      text: 'Moderator',
    },
    '*/post_content/timestamp': {},
    '*/post_content/menu_button': {
      icon: 'menuIcon',
    },
    '*/post_content/post_content_view_count': {},
    '*/post_content/reaction_button': {
      icon: 'likeButtonIcon',
      text: 'Like',
    },
    '*/post_content/comment_button': {
      icon: 'commentButtonIcon',
      text: 'Comment',
    },
    '*/post_content/share_button': {
      icon: 'shareButtonIcon',
      text: 'Share',
    },
    'post_composer_page/*/*': {},
    'post_composer_page/*/close_button': {
      image: 'platformValue',
    },
    'post_composer_page/*/community_display_name': {},
    'post_composer_page/*/create_new_post_button': {
      text: 'Post',
    },
    'post_composer_page/*/edit_post_button': {
      text: 'Save',
    },
    'post_composer_page/*/edit_post_title': {
      text: 'Edit post',
    },
    'post_composer_page/media_attachment/*': {},
    'post_composer_page/media_attachment/camera_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/image_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/video_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/file_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/detailed_button': {
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/*': {},
    'post_composer_page/detailed_media_attachment/camera_button': {
      text: 'Camera',
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/image_button': {
      text: 'Photo',
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/video_button': {
      text: 'Video',
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/file_button': {
      text: 'Attachment',
      image: 'platformValue',
    },
    'social_home_page/*/*': {},
    'social_home_page/create_post_menu/*': {},
    'social_home_page/create_post_menu/create_post_button': {
      text: 'Post',
      image: 'Post',
    },
    'social_home_page/create_post_menu/create_story_button': {
      text: 'Story',
      image: 'Story',
    },
    'social_home_page/create_post_menu/create_poll_button': {
      text: 'Poll',
      image: 'Poll',
    },
    'social_home_page/create_post_menu/create_livestream_button': {
      text: 'Livestream',
      image: 'Livestream',
    },
    'select_post_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_post_target_page/*/my_timeline_avatar': {},
    'select_post_target_page/*/title': {
      text: 'Post to',
    },
    'select_post_target_page/*/my_timeline_text': {
      text: 'My Timeline',
    },
    'select_story_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_story_target_page/*/title': {
      text: 'Share to',
    },
    'select_story_target_page/*/my_timeline_text': {
      text: 'My Timeline',
    },
    '*/*/community_official_badge': {
      image: 'platformValue',
    },
    '*/*/community_private_badge': {
      image: 'platformValue',
    },
    'social_global_search_page/*/*': {},
    'social_global_search_page/top_search_bar/*': {
      text: 'Search community and user',
    },
    'social_global_search_page/top_search_bar/search_icon': {
      icon: 'search',
    },
    'social_global_search_page/top_search_bar/clear_button': {
      icon: 'clear',
    },
    'social_global_search_page/top_search_bar/cancel_button': {
      text: 'Cancel',
    },
    'social_global_search_page/community_search_result/community_avatar': {},
    'social_global_search_page/community_search_result/community_display_name': {},
    'social_global_search_page/community_search_result/community_private_badge': {
      icon: 'lockIcon',
    },
    'social_global_search_page/community_search_result/community_official_badge': {
      icon: 'officialBadgeIcon',
    },
    'social_global_search_page/community_search_result/community_category_name': {},
    'social_global_search_page/community_search_result/community_members_count': {},
    'my_communities_search_page/top_search_bar/*': {
      text: 'Search my community',
    },
    'my_communities_search_page/*/community_avatar': {},
    'my_communities_search_page/*/community_display_name': {},
    'my_communities_search_page/*/community_private_badge': {
      icon: 'lockIcon',
    },
    'my_communities_search_page/*/community_official_badge': {
      icon: 'officialBadgeIcon',
    },
    'my_communities_search_page/*/community_category_name': {},
    'my_communities_search_page/*/community_members_count': {},
    'my_communities_search_page/top_search_bar/cancel_button': {
      text: 'Cancel',
    },
    'community_profile_page/*/*': {},
    'community_profile_page/community_feed/*': {},
    '*/post_content/announcement_badge': {
      image: 'value',
    },
    '*/post_content/pin_badge': {
      image: 'value',
    },
    '*/post_content/non_member_section': {
      image: 'value',
    },
    'community_profile_page/community_header/*': {},
    'community_profile_page/community_header/community_cover': {},
    'community_profile_page/community_header/community_name': {},
    'community_profile_page/community_header/community_verify_badge': {
      image: 'value',
    },
    'community_profile_page/community_header/community_category': {},
    'community_profile_page/community_header/community_description': {},
    'community_profile_page/community_header/community_info': {},
    'community_profile_page/community_header/community_join_button': {
      image: 'value',
    },
    'community_profile_page/community_header/community_pending_post': {
      image: 'value',
    },
    'community_profile_page/community_header/back_button': {
      image: 'value',
    },
    'community_profile_page/community_header/menu_button': {
      image: 'value',
    },
    'community_profile_page/community_profile_tab/*': {},
    'community_profile_page/community_profile_tab/community_feed_tab_button': {
      image: 'value',
    },
    'community_profile_page/community_profile_tab/community_pin_tab_button': {
      image: 'value',
    },
    'community_profile_page/community_pin/*': {},
    'community_profile_page/community_pin/community_create_post_button': {
      image: 'value',
    },
    'community_profile_page/post_content/*': {},
    'community_profile_page/*/create_post_button': {
      text: 'Post',
    },
    'community_profile_page/*/create_story_button': {
      text: 'Story',
    },
    'community_profile_page/*/create_poll_button': {
      text: 'Poll',
    },

    'pending_posts_page/*/*': {},
    'pending_posts_page/*/back_button': {
      image: 'value',
    },
    'pending_posts_page/*/title': {
      text: 'Pending posts ',
    },
    'pending_posts_page/pending_post_content/*': {},
    'pending_posts_page/pending_post_content/timestamp': {},
    'pending_posts_page/pending_post_content/post_accept_button': {
      text: 'Accept',
    },
    'pending_posts_page/pending_post_content/post_decline_button': {
      text: 'Decline',
    },
    'social_home_page/explore_community_categories/*': {},
    'social_home_page/recommended_communities/*': {},
    'social_home_page/*/explore_empty_image': {
      image: 'value',
    },
    'social_home_page/explore_empty/title': {
      text: 'Your explore is empty',
    },
    'social_home_page/explore_empty/description': {
      text: 'Find community or create your own.',
    },
    'social_home_page/explore_empty/explore_create_community': {
      text: 'Create community',
    },
    'social_home_page/explore_community_empty/title': {
      text: 'No community yet',
    },
    'social_home_page/explore_community_empty/description': {
      text: `Let's create your own communities`,
    },
    'social_home_page/explore_community_empty/explore_create_community': {
      text: 'Create community',
    },
    'social_home_page/*/explore_trending_title': {
      text: 'Trending now',
    },
    'social_home_page/*/explore_recommended_title': {
      text: 'Recommended for you',
    },
    'social_home_page/trending_communities/*': {},
    'all_categories_page/*/*': {},
    'communities_by_category_page/*/*': {},
    '*/*/community_join_button': {
      text: 'Join',
    },
    '*/*/community_joined_button': {
      text: 'Joined',
    },
    'communities_by_category_page/*/community_empty_image': {},
    'communities_by_category_page/*/community_empty_title': {
      text: 'No community yet',
    },
    '*/community_sidebar/community_sidebar_title': {
      text: 'Community',
    },
    '*/community_sidebar/newsfeed_sidebar_menu_item': {
      text: 'Newsfeed',
      icon: 'Newspaper',
    },
    '*/community_sidebar/explore_sidebar_menu_item': {
      text: 'Explore',
      icon: 'Global',
    },
    '*/community_sidebar/my_communities_sidebar_title': {
      text: 'My Communities',
    },
    '*/community_sidebar/create_community_sidebar_menu_item': {
      text: 'Create community',
      icon: 'Plus',
    },
    'user_profile_page/*/*': {},
    'user_profile_page/*/back_button': {
      image: 'value',
    },
    'user_profile_page/*/menu_button': {
      image: 'value',
    },
    'user_profile_page/*/user_feed_tab_button': {
      image: 'Feed',
    },
    'user_profile_page/*/user_image_feed_tab_button': {
      image: 'ImageFeed',
    },
    'user_profile_page/*/user_video_feed_tab_button': {
      image: 'VideoFeed',
    },
    'user_profile_page/user_profile_header/*': {},
    'user_profile_page/user_feed/*': {},
    'user_profile_page/user_image_feed/*': {},
    'user_profile_page/user_video_feed/*': {},
    'user_profile_page/post_composer/image_button': {
      icon: 'ImageIcon',
    },
    'user_profile_page/post_composer/video_button': {
      icon: 'VideoIcon',
    },
    'user_profile_page/post_composer/story_button': {
      icon: 'ImageIcon',
    },
    'user_relationship_page/*/*': {},
    'user_pending_follow_request_page/*/*': {},
    'user_profile_page/user_profile_header/follow_user_button': {
      text: 'Follow',
      image: 'Plus',
    },
    'user_profile_page/user_profile_header/following_user_button': {
      text: 'Following',
      image: 'FollowingUser',
    },
    'user_profile_page/user_profile_header/pending_user_button': {
      text: 'Cancel request',
      image: 'PendingUser',
    },
    'user_profile_page/user_profile_header/unblock_user_button': {
      text: 'Unblock',
      image: 'UnblockUser',
    },
    'user_profile_page/user_profile_header/user_avatar': {},
    'user_profile_page/user_profile_header/user_name': {},
    'user_profile_page/user_profile_header/user_description': {},
    'user_profile_page/user_profile_header/user_following': {
      text: 'following',
    },
    'user_profile_page/user_profile_header/user_follower': {
      text: 'followers',
    },
    'user_profile_page/user_feed/empty_user_feed': {
      text: 'No posts yet',
      image: 'EmptyPost',
    },
    'user_profile_page/user_feed/private_user_feed': {
      text: 'This account is private',
      image: 'PrivateFeed',
    },
    'user_profile_page/user_feed/private_user_feed_info': {
      text: 'Follow this user to see their posts.',
    },
    'user_profile_page/user_feed/blocked_user_feed': {
      text: 'You’ve blocked this user',
      image: 'BlockedUser',
    },
    'user_profile_page/user_feed/blocked_user_feed_info': {
      text: 'Unblock to see their posts.',
    },
    'user_profile_page/user_image_feed/empty_user_image_feed': {
      text: 'No photos yet',
      image: 'EmptyImagePost',
    },
    'user_profile_page/user_image_feed/private_user_image_feed': {
      text: 'This account is private',
      image: 'PrivateFeed',
    },
    'user_profile_page/user_image_feed/private_user_image_feed_info': {
      text: 'Follow this user to see their posts.',
    },
    'user_profile_page/user_image_feed/blocked_user_image_feed': {
      text: 'You’ve blocked this user',
      image: 'BlockedUser',
    },
    'user_profile_page/user_image_feed/blocked_user_image_feed_info': {
      text: 'Unblock to see their posts.',
    },
    'user_profile_page/user_video_feed/empty_user_video_feed': {
      text: 'No videos yet',
      image: 'EmptyVideoPost',
    },
    'user_profile_page/user_video_feed/private_user_video_feed': {
      text: 'This account is private',
      image: 'PrivateFeed',
    },
    'user_profile_page/user_video_feed/private_user_video_feed_info': {
      text: 'Follow this user to see their posts.',
    },
    'user_profile_page/user_video_feed/blocked_user_video_feed': {
      text: 'You’ve blocked this user',
      image: 'BlockedUser',
    },
    'user_profile_page/user_video_feed/blocked_user_video_feed_info': {
      text: 'Unblock to see their posts.',
    },
    'edit_user_profile_page/*/*': {},
    'edit_user_profile_page/*/back_button': {},
    'edit_user_profile_page/*/title': {
      text: 'Edit profile',
    },
    'edit_user_profile_page/*/user_display_name_title': {
      text: 'Display name',
    },
    'edit_user_profile_page/*/user_about_title': {
      text: 'About',
    },
    'edit_user_profile_page/*/update_user_profile_button': {
      text: 'Save',
    },
    'blocked_users_page/*/*': {},
    'blocked_users_page/*/back_button': {
      image: 'ArrowLeft',
    },
    'blocked_users_page/*/title': {
      text: 'Manage blocked users',
    },
    'blocked_users_page/*/user_list_unblock_user_button': {
      text: 'Unblock',
    },
    'community_setup_page/*/*': {},
    'community_setup_page/*/close_button': {
      image: 'value',
    },
    'community_setup_page/*/title': {
      text: 'Create community',
    },
    'community_setup_page/*/community_edit_title': {
      text: 'Edit community',
    },
    'community_setup_page/*/community_name_title': {
      text: 'Community name',
    },
    'community_setup_page/*/community_about_title': {
      text: 'About',
    },
    'community_setup_page/*/community_category_title': {
      text: 'Categories',
    },
    'community_setup_page/*/community_privacy_title': {
      text: 'Privacy',
    },
    'community_setup_page/*/community_privacy_private_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_title': {
      text: 'Private',
    },
    'community_setup_page/*/community_privacy_private_description': {
      text: 'Only members invited by the moderators can join, view, and search the posts in this community.',
    },
    'community_setup_page/*/community_privacy_public_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_public_title': {
      text: 'Public',
    },
    'community_setup_page/*/community_privacy_public_description': {
      text: 'Anyone can join, view, and search the posts in this community.',
    },
    'community_setup_page/*/community_add_member_title': {
      text: 'Member',
    },
    'community_setup_page/*/community_add_member_button': {
      text: 'Add',
      image: 'value',
    },
    'community_setup_page/*/community_create_button': {
      text: 'Create community',
      image: 'value',
    },
    'community_setup_page/*/community_edit_button': {
      text: 'Save',
      image: 'value',
    },
    'community_setup_page/*/image_button': {
      text: 'Photo',
      image: 'value',
    },
    'community_setup_page/*/camera_button': {
      text: 'Camera',
      image: 'value',
    },
    'community_add_category_page/*/*': {},
    'community_add_member_page/*/*': {},
    'community_membership_page/*/*': {},
    'community_setting_page/*/*': {},

    'community_setting_page/*/edit_profile': {
      text: 'Edit profile',
    },
    'community_setting_page/*/members': {
      text: 'Members',
    },
    'community_setting_page/*/notifications': {
      text: 'Notifications',
    },
    'community_setting_page/*/post_permission': {
      text: 'Post permission',
    },
    'community_setting_page/*/story_setting': {
      text: 'Story comments',
    },
    'community_setting_page/*/leave_community': {
      text: 'Leave community',
    },
    'community_setting_page/*/close_community': {
      text: 'Close community',
    },
    'community_setting_page/*/close_community_description': {
      text: 'Closing this community will remove the community  page and all its content and comments.',
    },
    'community_post_permission_page/*/*': {},
    'community_story_setting_page/*/*': {},
    'community_notification_page/*/*': {},
    'community_posts_notification_page/*/*': {},
    'community_comments_notification_page/*/*': {},
    'community_stories_notification_page/*/*': {},
    'poll_post_composer_page/*/*': {},
    'poll_post_composer_page/*/poll_question_title': {
      text: 'Poll question',
    },
    'poll_post_composer_page/*/poll_options_title': {
      text: 'Options',
    },
    'poll_post_composer_page/*/poll_options_desc': {
      text: 'Poll must contain at least 2 options.',
    },
    'poll_post_composer_page/*/poll_add_option_button': {
      text: 'Add option',
      image: 'plusIcon',
    },
    'poll_post_composer_page/*/poll_duration_title': {
      text: 'Poll duration',
    },
    'poll_post_composer_page/*/poll_duration_desc': {
      text: 'You can always close the poll before the set duration.',
    },
    'poll_post_composer_page/*/poll_multiple_selection_title': {
      text: 'Multiple selection',
    },
    'poll_post_composer_page/*/poll_multiple_selection_desc': {
      text: 'Let participants vote more than one option',
    },
    'poll_post_composer_page/*/create_new_post_button': {
      text: 'Post',
    },
    'select_poll_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_poll_target_page/*/my_timeline_avatar': {},
    'select_poll_target_page/*/title': {
      text: 'Post to',
    },
    'select_poll_target_page/*/my_timeline_text': {
      text: 'My Timeline',
    },
  },
};

export const getDefaultConfig: CustomizationContextValue['getConfig'] = (path: string) => {
  const [page, component, element] = path.split('/');

  const customizationKeys = getCustomizationKeys({ page, component, element });

  return new Proxy<
    IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
  >(
    {},
    {
      get(target, prop: string) {
        for (const key of customizationKeys) {
          if (defaultConfig?.customizations?.[key]?.[prop]) {
            return defaultConfig.customizations[key][prop];
          }
        }
      },
    },
  );
};

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<Config | null>(null);

  const currentTheme = useTheme();

  useEffect(() => {
    if (validateConfig(initialConfig)) {
      parseConfig(initialConfig);
    } else {
      console.error('Invalid configuration provided to CustomizationProvider');
    }
  }, [initialConfig]);

  const validateConfig = (config: Config): boolean => {
    return true;
  };

  const parseConfig = (newConfig: Config) => {
    setConfig(newConfig);
  };

  const isExcluded = (path: string) => {
    const [page, component, element] = path.split('/');

    const customizationKeys = getCustomizationKeys({ page, component, element });

    return (
      config?.excludes?.some((excludedPath) => {
        return customizationKeys.some((key) => key === excludedPath);
      }) || false
    );
  };

  const getConfig: CustomizationContextValue['getConfig'] = (path: string) => {
    const [page, component, element] = path.split('/');

    const customizationKeys = getCustomizationKeys({ page, component, element });

    const buildThemeProxyHandler = (
      themeName: 'light' | 'dark',
    ): ProxyHandler<
      IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
    > => ({
      get(_, prop: keyof ThemeValue) {
        for (const key of customizationKeys) {
          if (config?.customizations?.[key]?.theme?.[themeName]?.[prop]) {
            return config.customizations[key].theme?.[themeName]?.[prop];
          }
        }

        if (config?.theme?.[themeName]?.[prop]) {
          return config.theme[themeName]?.[prop];
        }

        for (const key of customizationKeys) {
          if (defaultConfig.customizations?.[key]?.theme?.[themeName]?.[prop]) {
            return defaultConfig.customizations[key].theme?.[themeName]?.[prop];
          }
        }

        return defaultConfig.theme[themeName][prop];
      },
    });

    return new Proxy<
      IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
    >(
      {},
      {
        get(target, prop: string) {
          if (prop === 'theme') {
            return {
              light: new Proxy({}, buildThemeProxyHandler('light')),
              dark: new Proxy({}, buildThemeProxyHandler('dark')),
            };
          }

          if (prop === 'preferred_theme') {
            return config?.preferred_theme ?? defaultConfig.preferred_theme;
          }

          for (const key of customizationKeys) {
            if (config?.customizations?.[key]?.[prop]) {
              return config.customizations[key][prop];
            }
          }

          for (const key of customizationKeys) {
            if (defaultConfig?.customizations?.[key]?.[prop]) {
              return defaultConfig.customizations[key][prop];
            }
          }
        },
      },
    );
  };

  const contextValue: CustomizationContextValue = {
    config,
    parseConfig,
    isExcluded,
    getConfig,
  };

  return (
    <CustomizationContext.Provider value={contextValue}>{children}</CustomizationContext.Provider>
  );
};
