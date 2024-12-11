import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityEditTitleProps {
  pageId?: string;
  className?: string;
  componentId?: string;
}

export const CommunityEditTitle = ({
  className,
  pageId = '*',
  componentId = '*',
}: CommunityEditTitleProps) => {
  const elementId = 'community_edit_title';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Title style={themeStyles} data-qa-anchor={accessibilityId} className={className}>
      {config.text}
    </Typography.Title>
  );
};
