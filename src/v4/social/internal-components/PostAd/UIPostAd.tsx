import React, { useState } from 'react';
import { Avatar, Typography } from '~/v4/core/components';
import { AdsBadge } from '~/v4/social/internal-components/AdsBadge/AdsBadge';
import Broadcast from '~/v4/icons/Broadcast';
import InfoCircle from '~/v4/icons/InfoCircle';
import { Button } from '~/v4/core/natives/Button';
import { AdInformation } from '~/v4/social/internal-components/AdInformation/AdInformation';

import styles from './UIPostAd.module.css';
import clsx from 'clsx';

interface UIPostAdProps {
  ad: Amity.Ad;
  avatarUrl: string;
  adImageUrl: string;
  themeStyles?: React.CSSProperties;
  onCallToActionClick?: (link: string) => void;
}

export const UIPostAd = ({
  ad,
  avatarUrl,
  adImageUrl,
  themeStyles,
  onCallToActionClick,
}: UIPostAdProps) => {
  const [isAdvertisementInfoOpen, setIsAdvertisementInfoOpen] = useState(false);

  const handleCallToActionClick = () => {
    onCallToActionClick?.(ad.callToActionUrl);
  };

  return (
    <div className={styles.container} style={themeStyles}>
      <div className={styles.innerContainer}>
        <div className={styles.header}>
          <div className={styles.header__avatar}>
            <Avatar avatarUrl={avatarUrl} defaultImage={<Broadcast />} />
          </div>
          <div className={styles.header__detail}>
            <Typography.BodyBold className={styles.header__title}>
              {ad.advertiser?.name}
            </Typography.BodyBold>
            <AdsBadge />
          </div>
        </div>
        <div>
          <Typography.Body className={styles.content__text}>{ad.body}</Typography.Body>
          <div className={styles.content__imageContainer}>
            <img className={styles.content__image} src={adImageUrl} />
          </div>
        </div>
      </div>
      <Button className={styles.infoIcon__button} onPress={() => setIsAdvertisementInfoOpen(true)}>
        <InfoCircle className={styles.infoIcon} />
      </Button>

      <Button
        className={styles.footer}
        data-has-url={!!ad.callToActionUrl}
        onPress={handleCallToActionClick}
      >
        <div className={styles.footer__left}>
          <Typography.Body className={styles.footer__content__description}>
            {ad.description}
          </Typography.Body>
          <Typography.BodyBold className={styles.footer__content__headline}>
            {ad.headline}
          </Typography.BodyBold>
        </div>
        {ad.callToActionUrl ? (
          <div className={styles.footer__right}>
            <Button className={styles.footer__content__button} onPress={handleCallToActionClick}>
              <Typography.CaptionBold className={styles.footer__content__button__text}>
                {ad.callToAction}
              </Typography.CaptionBold>
            </Button>
          </div>
        ) : null}
      </Button>
      <AdInformation
        ad={ad}
        isOpen={isAdvertisementInfoOpen}
        onOpenChange={(open) => setIsAdvertisementInfoOpen(open)}
      />
    </div>
  );
};
