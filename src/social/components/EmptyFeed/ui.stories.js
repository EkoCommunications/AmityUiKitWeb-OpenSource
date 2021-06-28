import React from 'react';

import { PostTargetType } from '@amityco/js-sdk';

import StyledEmptyFeed from '.';

export default {
  title: 'Ui Only/Social/Feed',
};

export const UiEmptyFeed = props => <StyledEmptyFeed {...props} />;

UiEmptyFeed.storyName = 'Empty';

UiEmptyFeed.argTypes = {
  canPost: { control: { type: 'boolean' } },
  targetType: { control: { type: 'select', options: Object.values(PostTargetType) } },
};
