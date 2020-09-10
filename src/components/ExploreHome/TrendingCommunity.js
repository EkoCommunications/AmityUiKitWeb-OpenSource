import React from 'react';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';
import { customizableComponent } from 'hocs/customization';
import CommunityName from 'components/CommunityName';

import {
  Avatar,
  TrendingCommunityContainer,
  CommunityInfo,
  Description,
  TrendingFooter,
} from './styles';

const TrendingCommunity = ({ community, onClick }) => (
  <TrendingCommunityContainer onClick={onClick}>
    <Avatar avatar={community.avatar} size="big" />
    <CommunityInfo>
      <CommunityName community={community} />
      <Truncate lines={2}>
        <Description>{community.description}</Description>
      </Truncate>

      <TrendingFooter>Category • {toHumanString(community.postsCount)} members</TrendingFooter>
    </CommunityInfo>
  </TrendingCommunityContainer>
);

export default customizableComponent('TrendingCommunity', TrendingCommunity);