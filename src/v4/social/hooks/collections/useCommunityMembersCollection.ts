import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useCommunityMembersCollection({
  queryParams,
  shouldCall = true,
}: {
  queryParams?: Parameters<typeof CommunityRepository.Membership.getMembers>[0];
  shouldCall?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: {
      ...(queryParams as Parameters<typeof CommunityRepository.Membership.getMembers>[0]),
      includeDeleted: false,
      limit: 20,
      sortBy: 'displayName',
    },
    shouldCall: !!queryParams?.communityId && shouldCall,
  });

  return {
    members: items,
    ...rest,
  };
}
