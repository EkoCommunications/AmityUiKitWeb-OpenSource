import React from 'react';
import { MentionData } from './utils';
import { Button } from '~/v4/core/natives/Button';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { MentionTypeaheadOption } from './plugins/MentionPlugin';
import { BrandBadge } from '~/v4/social/internal-components/BrandBadge';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar/UserAvatar';
import styles from './MentionItem.module.css';

type MentionItemProps = {
  pageId?: string;
  isSelected: boolean;
  onClick: () => void;
  componentId?: string;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption<MentionData>;
};

export function MentionItem({
  option,
  onClick,
  isSelected,
  onMouseEnter,
  pageId = '*',
  componentId = '*',
}: MentionItemProps) {
  const { user } = useUser({ userId: option.data.userId });

  return (
    <Button
      key={option.key}
      onPress={onClick}
      ref={option.setRefElement}
      aria-selected={isSelected}
      onHoverStart={onMouseEnter}
      data-is-selected={isSelected}
      className={styles.userMentionItem__item}
      data-qa-anchor={`${pageId}/${componentId}/mention_item`}
    >
      <div>
        <UserAvatar
          pageId={pageId}
          componentId={componentId}
          userId={option.data.userId}
          className={styles.userMentionItem__avatar}
        />
      </div>
      <div className={styles.userMentionItem__rightPane}>
        <p className={styles.userMentionItem__displayName}>{user?.displayName}</p>
        {user?.isBrand ? <BrandBadge className={styles.userMentionItem__brandIcon} /> : null}
      </div>
    </Button>
  );
}
