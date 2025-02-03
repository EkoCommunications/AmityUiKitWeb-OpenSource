import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './MyCommunitiesSideBarTitle.module.css';

type MyCommunitiesSideBarTitleProps = {
  pageId?: string;
  componentId?: string;
  className?: string;
  activeCommunity?: string;
};

export const MyCommunitiesSideBarTitle = ({
  pageId = '*',
  componentId = '*',
}: MyCommunitiesSideBarTitleProps) => {
  const elementId = 'my_communities_sidebar_title';
  const { config, accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    elementId,
    componentId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.myCommunitiesSideBarTitle}
    >
      {config.text}
    </Typography.TitleBold>
  );
};
