export type Locale = "en" | "es";

export const TELLUS_HUB_MAPS_URL =
  "https://www.google.com/maps/place/Centro+Le%C3%B1er%C3%ADa/@-33.4336119,-70.627325,17z/data=!4m14!1m7!3m6!1s0x9662c564fce68b1b:0xcb2147b9ea6c8cfc!2zQ2VudHJvIExlw7FlcsOtYQ!8m2!3d-33.4336164!4d-70.6247501!16s%2Fg%2F11h6l3nrn6!3m5!1s0x9662c564fce68b1b:0xcb2147b9ea6c8cfc!8m2!3d-33.4336164!4d-70.6247501!16s%2Fg%2F11h6l3nrn6?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D";

export const CENTRO_LENERIA_URL = "https://www.centroleneria.cl/";

export interface HubLinkSegment {
  before: string;
  label: string;
  after: string;
  href: string;
}

export interface Offering {
  title: string;
  description: string;
  hubLink?: HubLinkSegment;
}

export interface JourneyItem {
  phase: string;
  title: string;
  description: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface FundTag {
  id: string;
  label: string;
}

export interface Translations {
  nav: {
    accelerator: string;
    hub: string;
    ourStory: string;
    apply: string;
  };
  hero: {
    subtitle: string;
    cta: string;
  };
  whatWeDo: {
    label: string;
    heading: string;
    intro: string;
    introLink?: HubLinkSegment;
    login: string;
    cta: string;
    offerings: Offering[];
  };
  instaAwards: {
    label: string;
    heading: string;
    intro: string;
    journey: JourneyItem[];
    fundLabel: string;
    fundTitle: string;
    grantAmount: string;
    grantType: string;
    fundDescription: string;
    tags: FundTag[];
    howToApply: string;
    steps: StepItem[];
    applyCta: string;
    lumaAriaLabel: string;
  };
  footer: {
    copyright: string;
  };
  form: {
    back: string;
    continue: string;
    submit: string;
    submitting: string;
    enterHint: string;
    stepProgress: string;
    validationRequired: string;
    submissionFailed: string;
    backToHome: string;
    resendEmail: string;
    resending: string;
    emailSent: string;
  };
  hubApply: {
    pageTitle: string;
    pageDescription: string;
    intro: {
      question: string;
      hint: string;
    };
    fields: {
      fullName: { question: string; placeholder: string };
      email: { question: string; placeholder: string };
      projectName: { question: string; placeholder: string };
      location: {
        question: string;
        choices: { santiago: string; relocating: string; remote: string };
      };
      passport: {
        question: string;
        hint: string;
        placeholder: string;
        linkText: string;
      };
      terms: { question: string; hint: string; linkText: string };
    };
    success: {
      label: string;
      title: string;
      description: string;
      extra: string;
    };
  };
}

export const en: Translations = {
  nav: {
    accelerator: "Accelerator",
    hub: "Hub",
    ourStory: "Our story",
    apply: "Apply",
  },
  hero: {
    subtitle: "Searching for restless minds building the future.",
    cta: "Apply to the accelerator",
  },
  whatWeDo: {
    label: "What we do",
    heading: "Everything you need to go from builder to startup.",
    intro:
      "UNBLCK is an acceleration program within Tellus Blockchain Hub STGO to launch and scale in Web3 by integrating emerging technologies, AI, and blockchain — without doing it alone.",
    introLink: {
      before: "UNBLCK is an acceleration program within ",
      label: "Tellus Blockchain Hub STGO",
      after:
        " to launch and scale in Web3 by integrating emerging technologies, AI, and blockchain — without doing it alone.",
      href: TELLUS_HUB_MAPS_URL,
    },
    login: "Login",
    cta: "Request access to Tellus Hub",
    offerings: [
      {
        title: "Working space",
        description:
          "A physical hub at Centro Leneria, a 1935 house in the heart of Santiago to focus, collaborate, and build alongside other builders.",
        hubLink: {
          before: "A physical hub at ",
          label: "Centro Leneria",
          after:
            ", a 1935 house in the heart of Santiago to focus, collaborate, and build alongside other builders.",
          href: CENTRO_LENERIA_URL,
        },
      },
      {
        title: "Mentorship",
        description:
          "Direct access to builders with experience in AI and blockchain, acceleration programs, and capital to raise for your startup.",
      },
      {
        title: "Competitive fund program and innovation grants",
        description:
          "A complete path to raise capital and grow — from micro grants to go-to-market and demo days.",
      },
      {
        title: "Private founder club",
        description:
          "Not an open coworking space. A curated community of founders who want a serious workspace to scale their startup.",
      },
    ],
  },
  instaAwards: {
    label: "Funding & founder journey",
    heading: "From idea to demo day.",
    intro:
      "UNBLCK guides founders through the entire journey: from idea and product, through initial capital and go-to-market strategy, to demo day presentations for follow-on growth rounds.",
    journey: [
      {
        phase: "Build",
        title: "Get grant capital",
        description:
          "Start with equity-free funding to validate your idea and ship your first version. No equity, just capital to accelerate.",
      },
      {
        phase: "Launch",
        title: "Launch to market",
        description:
          "Work with our team on positioning, go-to-market strategy, and preparation for your first users and customers.",
      },
      {
        phase: "Scale",
        title: "Demo day & next rounds",
        description:
          "Present to investors at our demo days. Connections with VCs, angels, and follow-on capital to scale your startup.",
      },
    ],
    fundLabel: "Current fund · Stellar SCF",
    fundTitle: "Stellar Insta Awards",
    grantAmount: "$5,000",
    grantType: "non-dilutive grant",
    fundDescription:
      "No equity or ownership stake — capital and acceleration to take your startup built on the Stellar network from prototype to market.",
    tags: [
      { id: "non-dilutive", label: "Non-dilutive" },
      { id: "demo-day-pipeline", label: "Demo day pipeline" },
      { id: "stellarbarrio-exclusive", label: "StellarBarrio exclusive" },
    ],
    howToApply: "How to apply",
    steps: [
      {
        title: "Attend StellarBarrio",
        description:
          "Come to a StellarBarrio event at Tellus Blockchain Hub STGO. You'll receive an exclusive referral code to apply.",
      },
      {
        title: "Submit your application",
        description:
          "Use your referral code to apply. Explain your Stellar build, the on-chain use case, and what the grant unlocks.",
      },
      {
        title: "Join the pipeline",
        description:
          "Selected teams receive a grant of up to $5,000 USD, acceleration support, demo days, and a path to mainnet.",
      },
    ],
    applyCta: "Apply to fund",
    lumaAriaLabel: "View Tellus Cooperative events on Luma",
  },
  footer: {
    copyright: "AI & blockchain accelerator",
  },
  form: {
    back: "Back",
    continue: "Continue",
    submit: "Submit",
    submitting: "Submitting...",
    enterHint: "Enter ↵",
    stepProgress: "{current} of {total}",
    validationRequired: "Please complete this question to continue.",
    submissionFailed: "Something went wrong",
    backToHome: "Back to home",
    resendEmail: "Resend email",
    resending: "Sending...",
    emailSent: "Email sent! Check your inbox.",
  },
  hubApply: {
    pageTitle: "Request Access | Tellus Hub",
    pageDescription:
      "Request access to Tellus Blockchain Hub in Santiago de Chile.",
    intro: {
      question: "Request access to Tellus Hub in Santiago de Chile",
      hint: "Quick application for workspace access. Takes 2 minutes.",
    },
    fields: {
      fullName: {
        question: "What's your name?",
        placeholder: "Jane Doe",
      },
      email: {
        question: "What's your email?",
        placeholder: "you@company.com",
      },
      projectName: {
        question: "What are you working on?",
        placeholder: "Brief description of your project",
      },
      location: {
        question: "Where are you based?",
        choices: {
          santiago: "Santiago",
          relocating: "Relocating to Santiago",
          remote: "Remote — not based in Chile",
        },
      },
      passport: {
        question: "What's your Stellar Passport username?",
        hint: "We use this for identity verification. Don't have one yet?",
        placeholder: "@yourname or your GitHub username",
        linkText: "Create Passport",
      },
      terms: {
        question: "Terms & Conditions",
        hint: "I agree to the",
        linkText: "Terms & Conditions",
      },
    },
    success: {
      label: "Application received",
      title: "Check your email for a magic link",
      description:
        "We've sent you a secure login link. Click it to activate your account and access the hub.",
      extra:
        "Come to StellarBarrio at Tellus Blockchain Hub STGO — our monthly builder event.",
    },
  },
};
