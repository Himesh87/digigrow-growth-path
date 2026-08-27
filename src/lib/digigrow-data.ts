export type BusinessType =
  | "clothing"
  | "restaurant"
  | "salon"
  | "retail"
  | "service"
  | "other";

export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "clothing", label: "Clothing" },
  { value: "restaurant", label: "Restaurant / Food" },
  { value: "salon", label: "Beauty Salon" },
  { value: "retail", label: "Retail Shop" },
  { value: "service", label: "Service Business" },
  { value: "other", label: "Other" },
];

export const businessLabel = (t: string) =>
  BUSINESS_TYPES.find((b) => b.value === t)?.label ?? "Other";

export const BUSINESS_TIPS: Record<BusinessType, string[]> = {
  clothing: [
    "Create Instagram Reels showing new arrivals and styling ideas",
    "Upload clear, well-lit product photos every week",
    "Create a WhatsApp product catalogue with prices",
    "Post festival and season offers",
    "Ask happy customers for reviews and photos",
  ],
  restaurant: [
    "Post fresh food photos daily",
    "Create short food Reels (cooking, plating, packing)",
    "Add your full menu and photos to Google Business Profile",
    "Promote special combos and weekend offers",
    "Encourage customers to leave Google reviews",
  ],
  salon: [
    "Post before/after transformation content (with permission)",
    "Create Instagram Reels of quick beauty tips",
    "Share weekday and bridal season offers",
    "Add all your services and prices to Google",
    "Collect customer reviews after every appointment",
  ],
  retail: [
    "Show new stock arrivals as Instagram Stories",
    "Keep your Google Business Profile hours accurate",
    "Send weekly WhatsApp broadcasts about offers",
    "Post customer favourites and best sellers",
    "Run a small 'tag a friend' giveaway",
  ],
  service: [
    "Share customer problems you solved (mini case studies)",
    "Post testimonials as simple text-image posts",
    "List your service area and timings on Google",
    "Answer common questions in short videos",
    "Send WhatsApp reminders for repeat services",
  ],
  other: [
    "Create a business profile on Instagram and Facebook",
    "Set up WhatsApp Business with a catalogue",
    "Create your Google Business Profile",
    "Post 3 times a week with simple photos",
    "Ask every customer for a review",
  ],
};

export const DAILY_TASKS: Record<BusinessType, string> = {
  clothing: "Create an Instagram Reel showing your latest products.",
  restaurant: "Post a photo of today's most popular dish with a short caption.",
  salon: "Share one before/after photo of a recent service.",
  retail: "Post a photo of a new arrival and mention its price.",
  service: "Write a short post about a customer problem you solved this week.",
  other: "Post one photo of your business with a friendly caption.",
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export type Module = {
  id: string;
  title: string;
  summary: string;
  topics: string[];
  example: string;
  tips: string[];
  quiz: QuizQuestion[];
};

export const MODULES: Module[] = [
  {
    id: "social",
    title: "Social Media Marketing",
    summary:
      "Use Instagram and Facebook to show your products, reach new people nearby and build trust with regular posts.",
    topics: ["Instagram", "Facebook", "Reels", "Posts", "Hashtags", "Customer engagement"],
    example:
      "A local bakery posts a 15-second Reel of a cake being decorated, adds #cityname #cakes, and gets messages from nearby customers the same day.",
    tips: [
      "Post at least 3 times a week so people remember you",
      "Use 5-10 local hashtags instead of 30 random ones",
      "Reply to every comment and DM within a day",
    ],
    quiz: [
      {
        question: "What is the main benefit of using local hashtags?",
        options: [
          "They make posts colourful",
          "They help nearby customers find you",
          "They increase your phone storage",
          "They delete old posts",
        ],
        answer: 1,
      },
      {
        question: "Which format usually reaches the most new people on Instagram?",
        options: ["Reels", "Long text posts", "Blurry photos", "Private messages"],
        answer: 0,
      },
      {
        question: "How should you handle customer comments?",
        options: ["Ignore them", "Delete them", "Reply politely and quickly", "Report them"],
        answer: 2,
      },
      {
        question: "A good posting habit for a small business is:",
        options: ["Once a year", "Regularly every week", "Only on holidays", "Never"],
        answer: 1,
      },
      {
        question: "A business profile on Instagram gives you:",
        options: ["Free products", "Insights and contact buttons", "A website", "Extra followers automatically"],
        answer: 1,
      },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp Marketing",
    summary:
      "WhatsApp Business turns your phone into a shop: catalogue, quick replies, and direct chats with customers.",
    topics: [
      "WhatsApp Business",
      "Product catalogue",
      "Broadcasts",
      "Customer communication",
      "Promotional messages",
    ],
    example:
      "A clothing store uploads 20 products to the WhatsApp catalogue and shares the link in Instagram bio — customers order directly in chat.",
    tips: [
      "Add photos, price and short description to every catalogue item",
      "Use broadcast lists (not groups) for offers",
      "Set greeting and away messages so nobody is ignored",
    ],
    quiz: [
      {
        question: "Which platform can help a local business communicate with customers?",
        options: ["Calculator", "WhatsApp Business", "Notepad", "Paint"],
        answer: 1,
      },
      {
        question: "A WhatsApp catalogue is used to:",
        options: ["Store contacts", "Show your products and prices", "Make calls", "Play music"],
        answer: 1,
      },
      {
        question: "For sending an offer to many customers at once you should use:",
        options: ["Broadcast list", "Status only", "One-by-one always", "Email"],
        answer: 0,
      },
      {
        question: "A greeting message is useful because:",
        options: [
          "It replies instantly when a customer messages",
          "It blocks customers",
          "It deletes chats",
          "It changes your number",
        ],
        answer: 0,
      },
      {
        question: "Sending too many promotional messages can cause:",
        options: ["More sales always", "Customers blocking you", "Better ranking", "Nothing"],
        answer: 1,
      },
    ],
  },
  {
    id: "google",
    title: "Google Business",
    summary:
      "A Google Business Profile puts your shop on Google Maps and Search, so people nearby can find, call and visit you.",
    topics: [
      "Google Business Profile",
      "Business location",
      "Opening hours",
      "Photos",
      "Customer reviews",
    ],
    example:
      "A salon adds its address, timings and 10 photos to Google. Searches for 'salon near me' now show the salon with directions.",
    tips: [
      "Keep opening hours updated, especially on holidays",
      "Add at least 10 real photos",
      "Reply to every review — good or bad",
    ],
    quiz: [
      {
        question: "Google Business Profile mainly helps customers:",
        options: ["Play games", "Find your business on Maps and Search", "Send email", "Edit photos"],
        answer: 1,
      },
      {
        question: "Which detail is most important to keep updated?",
        options: ["Your favourite colour", "Opening hours", "Your birthday", "Wi-Fi password"],
        answer: 1,
      },
      {
        question: "Customer reviews help because:",
        options: ["They build trust", "They cost money", "They hide your shop", "They are private"],
        answer: 0,
      },
      {
        question: "You should reply to a negative review by:",
        options: ["Arguing", "Ignoring it", "Responding politely and offering help", "Deleting Google"],
        answer: 2,
      },
      {
        question: "Adding photos to your profile:",
        options: ["Slows Google down", "Makes customers more likely to visit", "Is not allowed", "Costs a fee"],
        answer: 1,
      },
    ],
  },
  {
    id: "content",
    title: "Content Creation",
    summary:
      "Good content is simple: clear photos, short videos and honest captions made with just your phone.",
    topics: ["Product photos", "Reels", "Promotional posts", "Captions", "Content ideas"],
    example:
      "A retail shop shoots products near a window with a plain background and posts three photos with the price in the caption.",
    tips: [
      "Shoot in daylight near a window — no expensive lights needed",
      "Keep the background plain and clean",
      "End every caption with a clear action: 'DM to order'",
    ],
    quiz: [
      {
        question: "The cheapest good lighting for product photos is:",
        options: ["Studio lights", "Natural daylight", "Candle light", "Phone torch only"],
        answer: 1,
      },
      {
        question: "A good caption should include:",
        options: ["Only emojis", "A clear call to action", "Nothing", "Random hashtags only"],
        answer: 1,
      },
      {
        question: "Reels work well because they are:",
        options: ["Long and slow", "Short and engaging", "Only for big brands", "Text only"],
        answer: 1,
      },
      {
        question: "A plain background helps by:",
        options: ["Hiding the product", "Making the product stand out", "Reducing quality", "Adding cost"],
        answer: 1,
      },
      {
        question: "A simple content idea for any business is:",
        options: ["Behind-the-scenes video", "Copying competitors exactly", "Posting blank images", "Nothing"],
        answer: 0,
      },
    ],
  },
  {
    id: "ads",
    title: "Online Advertising",
    summary:
      "Paid ads let you show your business to the exact people near you, even with a very small budget.",
    topics: ["Basic online ads", "Target audience", "Budget", "Ad objectives", "Measuring results"],
    example:
      "A restaurant boosts one popular post for 5 km around the shop with a small daily budget and tracks how many people messaged.",
    tips: [
      "Start small and increase only what works",
      "Target your own city or a few km around your shop",
      "Always pick one clear objective: messages, calls or visits",
    ],
    quiz: [
      {
        question: "Before running an ad you should decide:",
        options: ["Your objective", "Your shoe size", "The weather", "Nothing"],
        answer: 0,
      },
      {
        question: "Targeting means:",
        options: [
          "Choosing who sees your ad",
          "Choosing a photo filter",
          "Paying more money",
          "Deleting the ad",
        ],
        answer: 0,
      },
      {
        question: "A good budget approach for beginners is:",
        options: ["Spend everything at once", "Start small and test", "Never track spend", "Borrow money"],
        answer: 1,
      },
      {
        question: "You measure ad results by looking at:",
        options: ["Reach, clicks and messages", "Number of friends", "Phone battery", "Followers of others"],
        answer: 0,
      },
      {
        question: "If an ad is not working you should:",
        options: ["Keep it forever", "Change audience or creative", "Stop all marketing", "Blame customers"],
        answer: 1,
      },
    ],
  },
];

export const CHALLENGE_DAYS = [
  {
    day: 1,
    task: "Create your business Instagram account",
    detail:
      "Switch to a Business/Professional account, add your logo or shop photo and your city name.",
  },
  {
    day: 2,
    task: "Improve your Instagram bio",
    detail: "Write what you sell, where you are located and add a WhatsApp or call link.",
  },
  {
    day: 3,
    task: "Create your first promotional post or Reel",
    detail: "Show one product or service with a clear photo and a caption that ends with 'DM to order'.",
  },
  {
    day: 4,
    task: "Set up WhatsApp Business",
    detail: "Install WhatsApp Business, add your catalogue, greeting message and business hours.",
  },
  {
    day: 5,
    task: "Create or optimise your Google Business Profile",
    detail: "Add address, hours, category and at least 5 photos so people can find you on Maps.",
  },
  {
    day: 6,
    task: "Create a special customer offer",
    detail: "Make one simple offer (combo, discount or free add-on) and post it everywhere.",
  },
  {
    day: 7,
    task: "Check your results and plan next week",
    detail: "Look at reach, messages and enquiries, then write down 3 posts for next week.",
  },
];
