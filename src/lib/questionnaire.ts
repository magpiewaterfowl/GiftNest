export const categories = [
  "Technology",
  "Gaming",
  "Books & Reading",
  "Learning",
  "Experiences",
  "Travel",
  "Outdoors",
  "Fitness",
  "Cooking",
  "Home Improvement",
  "Crafting",
  "Collectibles",
  "Music",
  "Movies & TV",
  "Fashion",
  "Self-Care",
  "Pets",
  "Gardening",
  "Family Activities",
  "Sentimental Gifts",
] as const;

export type Category = (typeof categories)[number];
export type Answer = { text: string; categories: Category[] };
export type Question = { title: string; hint: string; answers: Answer[] };

export const questions: Question[] = [
  {
    title: "Your Saturday is completely free. What sounds best?",
    hint: "Imagine there is nothing on your to-do list.",
    answers: [
      {
        text: "A trail, fresh air, and a little adventure",
        categories: ["Outdoors", "Travel", "Fitness"],
      },
      {
        text: "Getting lost in a book or a new idea",
        categories: ["Books & Reading", "Learning", "Self-Care"],
      },
      {
        text: "Making something with my hands",
        categories: ["Crafting", "Home Improvement", "Gardening"],
      },
      {
        text: "Good food and good company",
        categories: ["Cooking", "Family Activities", "Experiences"],
      },
    ],
  },
  {
    title: "What do you find yourself saving online?",
    hint: "Think about the things that make you stop scrolling.",
    answers: [
      {
        text: "Clever gadgets and new releases",
        categories: ["Technology", "Gaming", "Collectibles"],
      },
      {
        text: "Places I would love to visit",
        categories: ["Travel", "Experiences", "Outdoors"],
      },
      {
        text: "Recipes and inviting spaces",
        categories: ["Cooking", "Home Improvement", "Gardening"],
      },
      {
        text: "Outfits, little luxuries, and creative ideas",
        categories: ["Fashion", "Self-Care", "Crafting"],
      },
    ],
  },
  {
    title: "Which kind of evening helps you recharge?",
    hint: "Choose the one that feels most like you.",
    answers: [
      {
        text: "A favorite album and a quiet moment",
        categories: ["Music", "Self-Care", "Sentimental Gifts"],
      },
      {
        text: "A movie marathon or a game night",
        categories: ["Movies & TV", "Gaming", "Family Activities"],
      },
      {
        text: "A book and a cozy corner",
        categories: ["Books & Reading", "Learning", "Self-Care"],
      },
      {
        text: "A walk with my four-legged companion",
        categories: ["Pets", "Outdoors", "Fitness"],
      },
    ],
  },
  {
    title: "You could try a new class. Which would you pick?",
    hint: "No experience necessary.",
    answers: [
      {
        text: "Pottery, painting, or making jewelry",
        categories: ["Crafting", "Fashion", "Experiences"],
      },
      {
        text: "Cooking something delicious",
        categories: ["Cooking", "Learning", "Family Activities"],
      },
      {
        text: "Photography or creative technology",
        categories: ["Technology", "Learning", "Travel"],
      },
      {
        text: "Dance, yoga, or outdoor skills",
        categories: ["Fitness", "Music", "Outdoors"],
      },
    ],
  },
  {
    title: "What makes a gift especially meaningful?",
    hint: "Think about a gift you still remember.",
    answers: [
      {
        text: "It captures a memory we share",
        categories: ["Sentimental Gifts", "Family Activities", "Collectibles"],
      },
      {
        text: "It is something I can use every day",
        categories: ["Technology", "Home Improvement", "Cooking"],
      },
      {
        text: "It opens the door to a new adventure",
        categories: ["Experiences", "Travel", "Learning"],
      },
      {
        text: "It feels like a little treat just for me",
        categories: ["Self-Care", "Fashion", "Books & Reading"],
      },
    ],
  },
  {
    title: "Which shop would you happily browse for an hour?",
    hint: "Even if you were not buying anything.",
    answers: [
      {
        text: "A bookstore or a record shop",
        categories: ["Books & Reading", "Music", "Collectibles"],
      },
      {
        text: "A garden center or a pet shop",
        categories: ["Gardening", "Pets", "Outdoors"],
      },
      {
        text: "A gaming or electronics store",
        categories: ["Gaming", "Technology", "Movies & TV"],
      },
      {
        text: "A design market or a craft shop",
        categories: ["Crafting", "Home Improvement", "Fashion"],
      },
    ],
  },
  {
    title: "What would you pack first for a few days away?",
    hint: "Beyond the everyday essentials.",
    answers: [
      {
        text: "My camera and an itinerary full of discoveries",
        categories: ["Travel", "Technology", "Experiences"],
      },
      {
        text: "Walking shoes and my outdoor kit",
        categories: ["Outdoors", "Fitness", "Pets"],
      },
      {
        text: "A book, headphones, and something comfortable",
        categories: ["Books & Reading", "Music", "Self-Care"],
      },
      {
        text: "Games and a little something to share",
        categories: ["Family Activities", "Gaming", "Cooking"],
      },
    ],
  },
  {
    title: "Which small project sounds most satisfying?",
    hint: "Something you would enjoy working on at your own pace.",
    answers: [
      {
        text: "Growing herbs or refreshing a room",
        categories: ["Gardening", "Home Improvement", "Cooking"],
      },
      {
        text: "Putting together a scrapbook or handmade gift",
        categories: ["Sentimental Gifts", "Crafting", "Family Activities"],
      },
      {
        text: "Learning an instrument or a new skill",
        categories: ["Music", "Learning", "Technology"],
      },
      {
        text: "Curating a collection or a personal look",
        categories: ["Collectibles", "Fashion", "Movies & TV"],
      },
    ],
  },
  {
    title: "What would you love to do together?",
    hint: "Pick a plan you would look forward to.",
    answers: [
      {
        text: "A live show, concert, or cinema trip",
        categories: ["Experiences", "Music", "Movies & TV"],
      },
      {
        text: "A picnic, a hike, or a day at the park",
        categories: ["Outdoors", "Family Activities", "Pets"],
      },
      {
        text: "A cooking session or a creative workshop",
        categories: ["Cooking", "Crafting", "Learning"],
      },
      {
        text: "Explore a new town and its little shops",
        categories: ["Travel", "Fashion", "Collectibles"],
      },
    ],
  },
  {
    title: "What would you like a little more of in your life?",
    hint: "There are no wrong answers. Go with your instinct.",
    answers: [
      {
        text: "Time to unwind and take care of myself",
        categories: ["Self-Care", "Fitness", "Books & Reading"],
      },
      {
        text: "New things to discover and explore",
        categories: ["Learning", "Travel", "Experiences"],
      },
      {
        text: "Time for the hobbies and spaces I love",
        categories: ["Gaming", "Gardening", "Home Improvement"],
      },
      {
        text: "Memories with my favorite people and pets",
        categories: ["Sentimental Gifts", "Family Activities", "Pets"],
      },
    ],
  },
];

export function scoreAnswers(
  answers: number[],
): { category: Category; score: number }[] {
  if (
    answers.length !== questions.length ||
    answers.some(
      (answer, index) =>
        !Number.isInteger(answer) || !questions[index].answers[answer],
    )
  ) {
    throw new Error(
      "Please answer every question before viewing your results.",
    );
  }
  const scores = Object.fromEntries(
    categories.map((category) => [category, 0]),
  ) as Record<Category, number>;
  answers.forEach((answer, index) => {
    questions[index].answers[answer].categories.forEach((category, rank) => {
      scores[category] += 3 - rank;
    });
  });
  return categories
    .map((category) => ({ category, score: scores[category] }))
    .sort((first, second) => second.score - first.score)
    .slice(0, 5);
}
