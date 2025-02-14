import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollMultipleSelectionTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const PollMultipleSelectionTitle = ({
  pageId = '*',
  componentId = '*',
}: PollMultipleSelectionTitleProps) => {
  const elementId = 'poll_multiple_selection_title';

  const { config, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.TitleBold data-qa-anchor={accessibilityId} style={themeStyles}>
      {config.text}
    </Typography.TitleBold>
  );
};
