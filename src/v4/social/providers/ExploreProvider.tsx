import React, { createContext, useContext, useState } from 'react';
import useCategoriesCollection from '~/v4/core/hooks/collections/useCategoriesCollection';
import { useRecommendedCommunitiesCollection } from '~/v4/core/hooks/collections/useRecommendedCommunitiesCollection';
import { useTrendingCommunitiesCollection } from '~/v4/core/hooks/collections/useTrendingCommunitiesCollection';

type ExploreContextType = {
  fetchTrendingCommunities: () => void;
  fetchRecommendedCommunities: () => void;
  fetchCommunityCategories: () => void;
  refetchRecommendedCommunities: () => void;
  isLoading: boolean;
  isCategoryLoading: boolean;
  error: Error | null;
  trendingCommunities: Amity.Community[];
  recommendedCommunities: Amity.Community[];
  noRecommendedCommunities: boolean;
  noTrendingCommunities: boolean;
  isEmpty: boolean;
  isCommunityEmpty: boolean;
  categories: Amity.Category[];
  refresh: () => void;
};

const ExploreContext = createContext<ExploreContextType>({
  fetchTrendingCommunities: () => {},
  fetchRecommendedCommunities: () => {},
  fetchCommunityCategories: () => {},
  refetchRecommendedCommunities: () => {},
  trendingCommunities: [],
  recommendedCommunities: [],
  categories: [],
  isEmpty: false,
  noRecommendedCommunities: false,
  noTrendingCommunities: false,
  isCommunityEmpty: false,
  isLoading: false,
  isCategoryLoading: false,
  error: null,
  refresh: () => {},
});

export const useExplore = () => useContext(ExploreContext);

type ExploreProviderProps = {
  children: React.ReactNode;
};

export const ExploreProvider: React.FC<ExploreProviderProps> = ({ children }) => {
  const [trendingCommunitiesEnable, setTrendingCommunitiesEnable] = useState(false);
  const [recommendedCommunitiesEnable, setRecommendedCommunitiesEnable] = useState(false);
  const [communityCategoriesEnable, setCommunityCategoriesEnable] = useState(false);

  const trendingData = useTrendingCommunitiesCollection({
    params: { limit: 5 },
    enabled: trendingCommunitiesEnable,
  });

  const recommendedData = useRecommendedCommunitiesCollection({
    params: { limit: 4 },
    enabled: recommendedCommunitiesEnable,
  });

  const categoriesData = useCategoriesCollection({
    query: {
      limit: 5,
      sortBy: 'name',
    },
    enabled: communityCategoriesEnable,
  });

  const isLoading = trendingData.isLoading || recommendedData.isLoading || categoriesData.isLoading;
  const error = trendingData.error && recommendedData.error && categoriesData.error;

  const refetchRecommendedCommunities = () => recommendedData.refresh();

  const refresh = () => {
    trendingData.refresh();
    refetchRecommendedCommunities();
    categoriesData.refresh();
  };

  const noCategories = categoriesData.categories.length === 0 && !categoriesData.isLoading;

  const noRecommendedCommunities =
    recommendedData.recommendedCommunities.length === 0 && !recommendedData.isLoading;

  const noTrendingCommunities =
    trendingData.trendingCommunities.length === 0 && !trendingData.isLoading;

  const isCommunityEmpty = noRecommendedCommunities && noTrendingCommunities;

  const isEmpty = noCategories && isCommunityEmpty;

  const fetchTrendingCommunities = () => setTrendingCommunitiesEnable(true);
  const fetchRecommendedCommunities = () => setRecommendedCommunitiesEnable(true);
  const fetchCommunityCategories = () => setCommunityCategoriesEnable(true);

  return (
    <ExploreContext.Provider
      value={{
        fetchTrendingCommunities,
        fetchRecommendedCommunities,
        fetchCommunityCategories,
        refetchRecommendedCommunities,
        trendingCommunities: trendingData.trendingCommunities,
        recommendedCommunities: recommendedData.recommendedCommunities,
        categories: categoriesData.categories,
        noRecommendedCommunities,
        noTrendingCommunities,
        isEmpty,
        isCommunityEmpty,
        isLoading,
        isCategoryLoading: categoriesData.isLoading,
        error,
        refresh,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
