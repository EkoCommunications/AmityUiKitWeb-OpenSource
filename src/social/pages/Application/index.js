import React from 'react';
import styled from 'styled-components';

import { PageTypes } from '~/social/constants';

import MainLayout from '~/social/layouts/Main';

import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import CommunityFeedPage from '~/social/pages/CommunityFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import ProfileSettings from '~/social/components/ProfileSettings';
import { useNavigation } from '~/social/providers/NavigationProvider';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
`;

const SocialSearch = styled(UiKitSocialSearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

const Community = () => {
    const { page } = useNavigation();

    return (
        <ApplicationContainer>
            <MainLayout>
                {page.type === PageTypes.Explore && <ExplorePage />}

                {page.type === PageTypes.NewsFeed && <NewsFeedPage />}

                {page.type === PageTypes.CommunityFeed && (
                    <CommunityFeedPage communityId={page.communityId} isNewCommunity={page.isNewCommunity} />
                )}

                {page.type === PageTypes.CommunityEdit && (
                    <CommunityEditPage communityId={page.communityId} tab={page.tab} />
                )}

                {page.type === PageTypes.Category && (
                    <CategoryCommunitiesPage categoryId={page.categoryId} />
                )}

                {page.type === PageTypes.UserFeed && <UserFeedPage userId={page.userId} />}

                {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}
            </MainLayout>
        </ApplicationContainer>
    );
};

export default Community;
