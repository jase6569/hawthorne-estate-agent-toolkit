import { z } from "zod";

export const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const healthScoreSchema = z.object({
  propertyId: z.string().optional(),
  propertyName: z.string().min(2),
  photos: z.coerce.number().int().min(0).max(100),
  floorplan: z.coerce.boolean(),
  videoTour: z.coerce.boolean(),
  epc: z.coerce.boolean(),
  staging: z.coerce.boolean(),
  gardenPhotos: z.coerce.boolean(),
  kitchenPhotos: z.coerce.boolean(),
  bathroomPhotos: z.coerce.boolean(),
  descriptionComplete: z.coerce.boolean(),
  socialPosted: z.coerce.boolean(),
});

export const viewingFeedbackSchema = z.object({
  propertyId: z.string().optional(),
  propertyName: z.string().min(2),
  viewerName: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  liked: z.string().min(2),
  disliked: z.string().min(2),
  priceOpinion: z.string().min(2),
  wouldRecommend: z.coerce.boolean(),
  interested: z.coerce.boolean(),
  comments: z.string().min(2),
});

export const commissionSchema = z.object({
  propertyPrice: z.coerce.number().positive(),
  commissionPercent: z.coerce.number().positive(),
  vatEnabled: z.coerce.boolean(),
});

export const qrSchema = z.object({
  propertyUrl: z.string().url(),
});

export const checklistSchema = z.object({
  propertyId: z.string().optional(),
  propertyName: z.string().min(2),
  title: z.string().min(2),
  items: z.array(
    z.object({
      label: z.string().min(2),
      done: z.boolean(),
    }),
  ).min(1),
});

export const vendorReportSchema = z.object({
  propertyId: z.string().optional(),
  propertyName: z.string().min(2),
  notes: z.string().min(2),
  offers: z.array(
    z.object({
      amount: z.coerce.number().positive(),
      buyer: z.string().min(2),
      status: z.string().min(2),
    }),
  ).default([]),
});

export const settingsSchema = z.object({
  name: z.string().min(2),
  notificationsEnabled: z.coerce.boolean(),
});