import React from 'react';
import styles from './StorySetting.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { IconComponent } from '~/v4/core/IconComponent';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components/Typography';
import AngleRight from '~/v4/icons/AngleRight';
import { PlusCircle } from '~/v4/icons/PlusCircle';

type StorySettingProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const StorySetting = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: StorySettingProps) => {
  const elementId = 'story_setting';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.storySetting__button}
    >
      <div className={styles.storySetting__leftWrap}>
        <IconComponent
          defaultIcon={() => (
            <PlusCircle className={clsx(styles.storySetting__icon, defaultIconClassName)} />
          )}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIconName={defaultConfig.icon}
          configIconName={config.icon}
        />
        {config.text && <Typography.Body>{config.text}</Typography.Body>}
      </div>
      <div>
        <AngleRight className={styles.storySetting__angleRight} />
      </div>
    </Button>
  );
};
