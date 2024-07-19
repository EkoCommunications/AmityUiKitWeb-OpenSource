import { StoryRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useGetStoryByStoryId = (storyId: string | undefined) => {
  const story = useLiveObject({
    fetcher: StoryRepository.getStoryByStoryId,
    params: storyId,
    shouldCall: () => !!storyId,
  });

  return story;
};

export default useGetStoryByStoryId;
