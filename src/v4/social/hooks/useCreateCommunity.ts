import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const baseCommunitySchema = z.object({
  displayName: z.string().max(30),
  description: z.string().max(180).optional(),
  categoryIds: z.string().array().optional(),
  avatarFileId: z.string().nullable().optional(),
  tags: z.string().array().optional(),
  isPublic: z.boolean(),
  userIds: z.string().array(),
});

export const createCommunitySchema = baseCommunitySchema
  .extend({ userIds: z.string().array().optional() })
  .refine((data) => {
    if (!data.isPublic && data.userIds?.length === 0) {
      return false;
    }
    return true;
  });

export type CreateFormValues = z.infer<typeof createCommunitySchema>;

export const editCommunitySchema = baseCommunitySchema.partial();

export type EditFormValues = z.infer<typeof editCommunitySchema>;

export type FormValues = CreateFormValues | EditFormValues;

export const useCreateCommunity = () => {
  const defaultValues = {
    avatarFileId: undefined,
    description: '',
    displayName: '',
    isPublic: true,
    tags: [],
    userIds: [],
    categoryIds: [],
  };

  return useForm({
    defaultValues,
    resolver: zodResolver(createCommunitySchema),
  });
};

export const useEditCommunity = (initialValue: Amity.Community) => {
  return useForm({
    defaultValues: {
      avatarFileId: initialValue?.avatarFileId,
      description: initialValue?.description,
      displayName: initialValue?.displayName,
      isPublic: initialValue?.isPublic,
      tags: initialValue?.tags ?? [],
      categoryIds: initialValue?.categoryIds ?? [],
    },
    resolver: zodResolver(editCommunitySchema),
  });
};
