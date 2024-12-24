import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import {
  AspectRatioButton,
  HyperLinkButton,
  ShareStoryButton,
  HyperLink,
} from '~/v4/social/elements';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { StoryRepository } from '@amityco/ts-sdk';
import { HyperLinkConfig } from '~/v4/social/components';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useCommunityInfo } from '~/social/components/CommunityInfo/hooks';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { VideoPreview } from '~/v4/social/internal-components/VideoPreview';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { RoundedBackButton } from '~/v4/social/elements/RoundedBackButton';
import ColorThief from 'colorthief';

import styles from './DraftsPage.module.css';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { BottomSheet } from '~/v4/core/components';
import { set } from 'lodash';

export type AmityStoryMediaType = { type: 'image'; url: string } | { type: 'video'; url: string };

export type AmityDraftStoryPageProps = {
  targetId: string;
  targetType: Amity.StoryTargetType;
  mediaType?: AmityStoryMediaType;
};

export type HyperLinkFormInputs = {
  url: string;
  customText?: string;
};

export const PlainDraftStoryPage = ({
  targetId,
  targetType,
  mediaType,
  onDiscardCreateStory,
}: AmityDraftStoryPageProps & {
  onDiscardCreateStory: () => void;
}) => {
  const { isDesktop } = useResponsive();
  const [isLoading, setIsLoading] = useState(false);
  const { openPopup, closePopup } = usePopupContext();
  const { onBack, prevPage } = useNavigation();
  const pageId = 'create_story_page';
  const { accessibilityId, themeStyles } = useAmityPage({
    pageId,
  });

  const { file, setFile } = useStoryContext();
  const { community } = useCommunityInfo(targetId);

  const { confirm } = useConfirmContext();
  const notification = useNotifications();

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [hyperLink, setHyperLink] = useState<
    {
      data: { url: string; customText: string };
      type: Amity.StoryItemType;
    }[]
  >([
    {
      data: {
        url: '',
        customText: '',
      },
      type: 'hyperlink' as Amity.StoryItemType,
    },
  ]);

  const [imageMode, setImageMode] = useState<'fit' | 'fill'>('fit');
  const [colors, setColors] = useState<string[]>([]);

  const currentHyperlinkUrl = useMemo(() => {
    return hyperLink.filter((link) => link.type === 'hyperlink')?.[0].data.url;
  }, [hyperLink]);

  const currentHyperlinkText = useMemo(() => {
    return hyperLink.filter((link) => link.type === 'hyperlink')?.[0].data.customText;
  }, [hyperLink]);

  const onClickImageMode = () => {
    setImageMode(imageMode === 'fit' ? 'fill' : 'fit');
    if (imageMode === 'fill') {
      setColors([]);
    }
  };

  const onCreateStory = async ({
    file,
    imageMode,
    metadata,
    items,
  }: {
    file: File | null;
    imageMode: 'fit' | 'fill';
    metadata?: Amity.Metadata;
    items?: Amity.StoryItem[];
  }) => {
    setIsLoading(true);
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('files', file);
      setFile(null);
      if (mediaType?.type === 'image' && targetId) {
        StoryRepository.createImageStory(
          targetType,
          targetId,
          formData,
          metadata,
          imageMode,
          items,
        );
      } else if (mediaType?.type === 'video' && targetId) {
        StoryRepository.createVideoStory(targetType, targetId, formData, metadata, items);
      }
      if (prevPage?.type === PageTypes.StoryTargetSelectionPage) onBack(2);
      else onBack();
      notification.success({
        content: 'Successfully shared story',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        notification.info({
          content: error.message ?? 'Failed to share story',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const discardCreateStory = () => {
    confirm({
      pageId,
      title: 'Discard this story?',
      content: 'The story will be permanently discarded. It cannot be undone.',
      cancelText: 'Cancel',
      okText: 'Discard',
      onOk: () => {
        setFile(null);
        onDiscardCreateStory();
      },
    });
  };

  const onSubmitHyperLink: SubmitHandler<HyperLinkFormInputs> = ({ url, customText = '' }) => {
    setHyperLink([
      {
        data: {
          url,
          customText,
        },
        // TODO: fix type
        type: 'hyperlink' as Amity.StoryItemType,
      },
    ]);

    setOpenBottomSheet(false);

    if (isDesktop) closePopup();
    else setOpenBottomSheet(false);
  };

  const onRemoveHyperLink = () => {
    setHyperLink([
      {
        data: {
          url: '',
          customText: '',
        },
        type: 'hyperlink' as Amity.StoryItemType,
      },
    ]);
  };

  const renderHyperLinkComponent = (onClose: () => void) => {
    return (
      <div className={styles.addHyperlinkContainer}>
        <HyperLinkConfig
          pageId={pageId}
          url={currentHyperlinkUrl}
          customText={currentHyperlinkText}
          onClose={onClose}
          onSubmit={onSubmitHyperLink}
          onRemove={onRemoveHyperLink}
        />
      </div>
    );
  };

  const handleOnClickHyperLinkActionButton = () => {
    if (hyperLink[0]?.data?.url) {
      notification.info({
        content: 'Can’t add more than one link to your story.',
      });
      return;
    }

    if (!isDesktop) {
      setOpenBottomSheet(true);
    } else {
      openPopup({
        pageId,
        view: 'desktop',
        children: renderHyperLinkComponent(closePopup),
      });
    }
  };

  const handleOnEditHyperlink = () => {
    if (!isDesktop) {
      setOpenBottomSheet(true);
    } else {
      openPopup({
        pageId,
        view: 'desktop',
        children: renderHyperLinkComponent(closePopup),
      });
    }
  };

  const extractColorsFromImage = useCallback(async (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 2);
      if (palette) {
        setColors(palette.map((color) => `rgb(${color.join(',')})`));
      }
    };
  }, []);

  useEffect(() => {
    const extractColors = async () => {
      if (mediaType?.type === 'image') {
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          await extractColorsFromImage(imageUrl);
        } else if (mediaType.url) {
          await extractColorsFromImage(mediaType.url);
        }
      }
    };

    extractColors();
  }, [file, mediaType, extractColorsFromImage]);

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles} className={styles.storyWrapper}>
      <div id="asc-uikit-create-story" className={styles.draftPageContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <RoundedBackButton pageId={pageId} onPress={discardCreateStory} />
            <div className={styles.topRightButtons}>
              {mediaType?.type === 'image' && (
                <AspectRatioButton pageId={pageId} onPress={onClickImageMode} />
              )}
              <HyperLinkButton pageId={pageId} onPress={handleOnClickHyperLinkActionButton} />
            </div>
          </div>
        </div>
        {mediaType?.type === 'image' ? (
          <div
            className={styles.mainContainer}
            style={{
              background: `linear-gradient(
                180deg,
                ${colors[0] || 'var(--asc-color-black)'} 0%,
                ${colors[1] || 'var(--asc-color-black)'} 100%
              )`,
            }}
          >
            <img
              className={styles.previewImage}
              src={file ? URL.createObjectURL(file) : mediaType.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: imageMode === 'fit' ? 'contain' : 'cover',
              }}
              alt="Draft"
              onLoad={(e) => {
                if (imageMode === 'fill') {
                  extractColorsFromImage((e.target as HTMLImageElement).src);
                }
              }}
            />
          </div>
        ) : mediaType?.type === 'video' ? (
          <video
            className={styles.videoPreview}
            src={file ? URL.createObjectURL(file) : mediaType.url}
            autoPlay
            loop
            muted
            controls={false}
            playsInline
          />
        ) : null}
        {currentHyperlinkUrl && (
          <div className={styles.hyperLinkContainer}>
            <HyperLink onClick={handleOnEditHyperlink}>
              {currentHyperlinkText || currentHyperlinkUrl.replace(/^https?:\/\//, '')}
            </HyperLink>
          </div>
        )}
        <div className={styles.footer}>
          <ShareStoryButton
            community={community}
            pageId={pageId}
            onClick={() =>
              !isLoading &&
              onCreateStory({
                file,
                imageMode,
                metadata: {},
                items: currentHyperlinkUrl ? hyperLink : [],
              })
            }
          />
        </div>
      </div>
      <BottomSheet
        isOpen={openBottomSheet}
        children={renderHyperLinkComponent(() => {
          setOpenBottomSheet(false);
        })}
        mountPoint={document.getElementById('asc-uikit-create-story') as HTMLElement}
        onClose={() => setOpenBottomSheet(false)}
        style={themeStyles}
      />
    </div>
  );
};

export const AmityDraftStoryPage = (props: AmityDraftStoryPageProps) => {
  const { AmityDraftStoryPageBehavior } = usePageBehavior();

  return (
    <PlainDraftStoryPage
      {...props}
      onDiscardCreateStory={() => AmityDraftStoryPageBehavior?.closeAction?.()}
    />
  );
};

export default AmityDraftStoryPage;
