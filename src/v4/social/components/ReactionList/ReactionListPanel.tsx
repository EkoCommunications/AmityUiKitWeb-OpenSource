import styles from './ReactionList.module.css';
import React, { Fragment, useMemo } from 'react';
import { Avatar, Typography } from '~/v4/core/components';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { ReactionIcon } from '~/v4/social/components/ReactionList/ReactionIcon';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import useSDK from '~/core/hooks/useSDK';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';

export const ReactionListPanel = ({
  filteredReactions,
  removeReaction,
  hasMore,
  loadMore,
  isLoading,
  currentRef,
}: {
  filteredReactions: Amity.Reactor[];
  removeReaction: (reaction: string) => Promise<void>;
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  currentRef: HTMLDivElement | null;
}) => {
  const { currentUserId } = useSDK();
  const { config } = useCustomReaction();
  const reactionList = useMemo(() => config.map(({ name }) => name), [config]);

  if (!currentRef || !filteredReactions) return null;

  return (
    <div className={styles.infiniteScrollContainer}>
      <InfiniteScroll
        scrollableTarget={currentRef}
        scrollThreshold={0.7}
        hasMore={hasMore}
        next={loadMore}
        loader={isLoading ? <span key={0}>Loading...</span> : null}
        dataLength={filteredReactions.length || 0}
        style={{ display: 'flex', width: '100%' }}
        height={currentRef.clientHeight}
      >
        <div className={styles.userList}>
          {filteredReactions.map((reaction) => {
            return (
              <Fragment key={reaction.reactionId}>
                <div className={styles.userItem}>
                  <div className={styles.userDetailsContainer}>
                    <div className={styles.userDetailsProfile}>
                      <Avatar
                        data-qa-anchor="user_avatar_view"
                        size="small"
                        avatar={reaction.user?.avatar?.fileUrl}
                      />
                      <Typography.BodyBold data-qa-anchor="user_display_name">
                        {reaction.user?.displayName}
                        {currentUserId === reaction.user?.userId && (
                          <>
                            <br />
                            <div onClick={() => removeReaction(reaction.reactionName)}>
                              <Typography.Caption className={styles.removeBtn}>
                                <FormattedMessage id="livechat.reaction.label.removeReaction" />
                              </Typography.Caption>
                            </div>
                          </>
                        )}
                      </Typography.BodyBold>
                    </div>

                    <div className={styles.userDetailsReaction}>
                      {reactionList.includes(reaction.reactionName) ? (
                        <ReactionIcon
                          reactionConfigItem={
                            config.find(({ name }) => name === reaction.reactionName)!
                          }
                          className={styles.reactionIcon}
                        />
                      ) : (
                        <FallbackReaction className={styles.reactionIcon} />
                      )}
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};