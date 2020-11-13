import React from 'react';

import useOneUser from '~/mock/useOneCommunity';

import UserFeedPage from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKUserFeedPage = props => {
  const [user, isLoading] = useOneUser();
  if (isLoading) return <p>Loading...</p>;
  return <UserFeedPage userId={user.userId} {...props} />;
};

SDKUserFeedPage.storyName = 'User Profile Page';

SDKUserFeedPage.argTypes = {
  onClickUser: { action: 'onClickUser(userId)' },
  onEditUser: { action: 'onEditUser()' },
  onMessageUser: { action: 'onMessageUser()' },
};