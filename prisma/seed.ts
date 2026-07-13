import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "agent@hawthorne.systems" },
    update: {},
    create: {
      name: "Hawthorne Demo Agent",
      email: "agent@hawthorne.systems",
      passwordHash,
      notificationsEnabled: true,
    },
  });

  const property = await prisma.property.upsert({
    where: { id: "demo-property-1" },
    update: {},
    create: {
      id: "demo-property-1",
      userId: user.id,
      title: "14 Cedar Avenue",
      address: "Cheltenham, GL50 4AF",
      price: 475000,
      notes: "Well-presented three-bedroom family home with garden.",
    },
  });

  await prisma.propertyHealthScore.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      propertyName: property.title,
      score: 87,
      inputs: {
        photos: 18,
        floorplan: true,
        videoTour: true,
        epc: true,
        staging: true,
        gardenPhotos: true,
        kitchenPhotos: true,
        bathroomPhotos: true,
        descriptionComplete: true,
        socialPosted: false,
      },
      suggestions: ["Add one more exterior image for mobile listings.", "Post to social channels for wider reach."],
    },
  });

  await prisma.viewingFeedback.createMany({
    data: [
      {
        userId: user.id,
        propertyId: property.id,
        propertyName: property.title,
        viewerName: "Sarah M.",
        rating: 4,
        liked: "Light-filled kitchen and quiet road.",
        disliked: "Bathroom felt slightly dated.",
        priceOpinion: "Slightly above expectation but justified.",
        wouldRecommend: true,
        interested: true,
        comments: "Requested a second viewing next week.",
      },
      {
        userId: user.id,
        propertyId: property.id,
        propertyName: property.title,
        viewerName: "James T.",
        rating: 5,
        liked: "Garden and layout were strong.",
        disliked: "None noted.",
        priceOpinion: "Good value for the area.",
        wouldRecommend: true,
        interested: true,
        comments: "Asked for details on chain status.",
      },
    ],
  });

  await prisma.commissionCalculation.create({
    data: {
      userId: user.id,
      propertyPrice: 475000,
      commissionPercent: 1.25,
      vatEnabled: true,
      commission: 5937.5,
      vat: 1187.5,
      total: 7125,
      net: 5937.5,
    },
  });

  await prisma.qrCode.create({
    data: {
      userId: user.id,
      propertyUrl: "https://hawthorne.systems/listings/14-cedar-avenue",
      imageData: "",
    },
  });

  await prisma.marketingChecklist.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      propertyName: property.title,
      title: "Launch checklist",
      progress: 84,
      items: [
        { label: "Photos Taken", done: true },
        { label: "Floorplan", done: true },
        { label: "EPC", done: true },
        { label: "Video Tour", done: true },
        { label: "Rightmove", done: true },
        { label: "Zoopla", done: false },
      ],
    },
  });

  await prisma.vendorReport.create({
    data: {
      userId: user.id,
      propertyId: property.id,
      propertyName: property.title,
      marketingChecklist: [
        { label: "Photos Taken", done: true },
        { label: "Floorplan", done: true },
        { label: "Video Tour", done: true },
      ],
      healthScore: {
        score: 87,
        suggestions: ["Add one more exterior image.", "Share the property across social channels."],
      },
      feedbackSummary: {
        averageRating: 4.5,
        sentiment: "Positive",
      },
      offers: [],
      notes: "Vendor report prepared for weekly review.",
      pdfFileName: "vendor-report-14-cedar-avenue.pdf",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        userId: user.id,
        type: "LOGIN",
        title: "Signed in",
        description: "Demo account prepared for product walkthrough.",
      },
      {
        userId: user.id,
        type: "HEALTH_SCORE",
        title: "Property Health Score generated",
        description: "14 Cedar Avenue scored 87/100.",
      },
      {
        userId: user.id,
        type: "FEEDBACK",
        title: "Viewing feedback captured",
        description: "Two viewer responses recorded.",
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });