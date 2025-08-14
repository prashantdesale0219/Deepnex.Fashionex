export const pricingData = {
  title: {
    main: "Take your fashion photos",
    highlight: "to the next level"
  },
  subtitle: "I need 30 photos per month",
  slider: {
    min: 20,
    max: 500,
    default: 30
  },
  billingOptions: [
    { id: "monthly", label: "Monthly", isDefault: true },
    { id: "annual", label: "Annual", discount: "Save 17%" }
  ],
  plans: [
    {
      id: "lite",
      name: "Lite",
      icon: "⬆️",
      description: "A great way to explore the Botika platform.",
      price: 33,
      credits: 30,
      features: [
        { text: "No Botika watermarks", included: true },
        { text: "Limited selection of AI models", included: true },
        { text: "Limited selection of backgrounds", included: true },
        { text: "HD image resolution", included: true },
        { text: "1 free photo review per credit", included: true },
        { text: "Photo fixes ready in 4 business days", included: true },
        { text: "Social ready images", included: true }
      ]
    },
    {
      id: "pro",
      name: "Pro",
      icon: "➕",
      description: "Perfect for businesses of all sizes",
      price: 35,
      credits: 30,
      popular: true,
      features: [
        { text: "Includes everything in Lite, plus:", header: true },
        { text: "Access to all models", included: true },
        { text: "Access to all backgrounds", included: true },
        { text: "2K image resolution", included: true },
        { text: "2 free photo reviews per credit", included: true },
        { text: "Photo fixes in 2 business days", included: true },
        { text: "Support for headless images", included: true },
        { text: "Allows uploads of flat lay images", included: true }
      ]
    },
    {
      id: "advanced",
      name: "Advanced",
      icon: "⭐",
      description: "Best for scaling your business with extra AI features",
      price: 40,
      credits: 30,
      features: [
        { text: "Includes everything in Pro, plus:", header: true },
        { text: "4K image resolution", included: true },
        { text: "3 free photo reviews per credit", included: true },
        { text: "Photo fixes in 1 business day", included: true },
        { text: "White-glove quality control", included: true },
        { text: "Multi-user access", included: true }
      ]
    }
  ]
};