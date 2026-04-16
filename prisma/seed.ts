import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const siteContent = await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1
    }
  });

  const categories = await Promise.all(
    [
      {
        name: "Living Room",
        slug: "living-room",
        description: "Soft seating, layered textures, and layouts that welcome exhale moments.",
        heroLabel: "Living Room Ideas"
      },
      {
        name: "Bedroom",
        slug: "bedroom",
        description: "Quiet, restorative bedroom styling with warmth and restraint.",
        heroLabel: "Bedroom Designs"
      },
      {
        name: "Kitchen",
        slug: "kitchen",
        description: "Bright kitchen inspiration with clean storage and relaxed utility.",
        heroLabel: "Kitchen Inspiration"
      },
      {
        name: "Outdoor",
        slug: "outdoor",
        description: "Patio and garden scenes that feel intimate, glowy, and effortless.",
        heroLabel: "Outdoor & Garden"
      }
    ].map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      })
    )
  );

  const bySlug = Object.fromEntries(categories.map((category) => [category.slug, category.id]));

  const posts = [
    {
      title: "Soft Layers for a Calm Living Room",
      slug: "soft-layers-calm-living-room",
      excerpt: "A warm-neutral recipe for styling a living room that feels light, grounded, and lived in.",
      content:
        "Start with an oversized rug, then build with a linen sofa, washed wood accents, and one sculptural branch arrangement. Keep the palette close in tone so texture does the visual work.\n\nChoose low-contrast storage pieces and soft-edged tables to maintain the relaxed editorial feel. Lighting should stay diffuse and warm, with lamps at two different heights for depth.",
      categoryId: bySlug["living-room"],
      featured: true,
      latest: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-10T09:00:00.000Z"),
      heroImage: "/images/living-room-card.svg",
      heroAlt: "Neutral living room with soft sofa"
    },
    {
      title: "Cozy Small Bedroom Ideas on a Budget",
      slug: "cozy-small-bedroom-budget",
      excerpt: "Use vertical styling, soft textiles, and edited decor to make a compact bedroom feel expensive.",
      content:
        "A small bedroom benefits from discipline: one tonal bedding story, two bedside lights, and storage that disappears into the room. Use wall-mounted sconces or slim lamps to free nightstand space.\n\nFinish with a bench or a single accent stool at the foot of the bed and keep art in matching frames for a polished look.",
      categoryId: bySlug["bedroom"],
      latest: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-08T09:00:00.000Z"),
      heroImage: "/images/bedroom-card.svg",
      heroAlt: "Small neutral bedroom"
    },
    {
      title: "Minimal Kitchen Styling That Still Feels Warm",
      slug: "minimal-kitchen-styling-warm",
      excerpt: "Use pale oak, creamy stone, and a few practical display moments to avoid a sterile kitchen.",
      content:
        "Open shelving works best when it is sparse. Group ceramics in odd numbers, mix matte and glazed finishes, and leave negative space around each object. Add a runner or roman shade in a soft flax tone to soften hard lines.\n\nCountertops stay clean, but not empty: one tray, one cutting board, and one branch arrangement is enough.",
      categoryId: bySlug["kitchen"],
      latest: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-05T09:00:00.000Z"),
      heroImage: "/images/kitchen-card.svg",
      heroAlt: "Warm neutral kitchen"
    },
    {
      title: "Dreamy Patio Makeover on a Budget",
      slug: "dreamy-patio-makeover-budget",
      excerpt: "String lights, draped textiles, and weathered planters turn a small patio into an evening retreat.",
      content:
        "Anchor the patio with a natural-fiber outdoor rug and choose one dominant material such as teak, woven resin, or powder-coated iron. Layer battery or solar lanterns to create pools of warm light.\n\nPlanting should feel loose rather than manicured. Mix one taller olive-tone tree with low herbs and one trailing plant.",
      categoryId: bySlug["outdoor"],
      latest: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-03T09:00:00.000Z"),
      heroImage: "/images/outdoor-card.svg",
      heroAlt: "Patio with warm lights"
    }
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post
    });
  }

  console.log(`Seeded site content ${siteContent.siteTitle} with ${posts.length} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
