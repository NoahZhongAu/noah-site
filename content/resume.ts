import type { Resume } from "./schema";

// The only file that holds résumé text. Validated by schema.ts through index.ts.
// Dates and entry facts come from public/resume/noah-zhong-resume.pdf.
// [bracket] values are placeholders awaiting the owner; each is listed in the milestone report.

export const resume: Resume = {
  person: {
    name: "Noah Zhong",
    role: "AI Deployment Engineer",
    eyebrow: "MELBOURNE · AI DEPLOYMENT ENGINEER · OPEN TO 2027 GRADUATE ROLES",
    headline: "AI systems, *deployed* where the work *actually happens.*",
    location: "Melbourne, Australia",
    email: "NoahZhong.Au@gmail.com",
    links: {
      github: "https://github.com/NoahZhongAu",
      linkedin: "https://au.linkedin.com/in/noah-zhong-1b16ab353",
    },
    bio: "Monash Computer Science student with hands-on experience building and supporting AI products: PyTorch model training, full-stack features, LLM agent workflows, MCP integrations and day-to-day support for an AI agent harness used by manufacturing teams. Comfortable debugging models, front ends, back ends, APIs and deployments, and working with users to turn real workflows into reliable software.",
    availability: "Open to 2027 graduate roles, Melbourne or remote.",
  },

  entries: [
    {
      id: "xjtlu",
      kind: "education",
      title: "Bachelor of Information Management and Information Systems",
      org: "Xi'an Jiaotong-Liverpool University",
      location: "Suzhou, China",
      start: "2022-09",
      end: "2024-12",
      bullets: [
        "Awarded a top 25% scholarship. Coursework covered data structures, AI and algorithms, SQL, Java, statistics and software engineering, before transferring to Monash.",
        "Founding member of Suzhou Union, the XJTLU English debate organisation: helped set up the society, ran events, managed its WordPress site and produced bilingual WeChat content.",
        "Competed in NEAUDC and other English parliamentary debate tournaments, with several Outstanding Speaker results.",
        "Operations intern at the XJTLU Museum from July to September 2023: supported exhibitions and TEDxXJTLU speakers, gave bilingual tours and wrote event content.",
      ],
    },
    {
      id: "chengtian",
      kind: "milestone",
      title: "Co-founder, Operations & Marketing",
      org: "Suzhou Chengtian Information Service Co., Ltd.",
      location: "Suzhou, China",
      start: "2023-08",
      end: "2024-08",
      bullets: [
        "Co-founded a campus delivery service, helped operate its WeChat Mini Program, managed partnerships and tested an early trading-algorithm prototype in Python.",
      ],
    },
    {
      id: "suzhou-tutoring",
      kind: "role",
      title: "Private Tutor, Debate Coach and Study Abroad Consultant",
      org: "Suzhou Xuanzhou Education Technology and Suzhou Qianwei Education Consulting",
      location: "Suzhou and remote",
      start: "2024-02",
      end: "2025-12",
      bullets: [
        "Tutored AP, A-Level and IB Computer Science in English, adjusting explanations and exercises to each course and student.",
        "Taught IELTS listening, reading, writing and speaking with direct feedback on language, structure and exam technique.",
        "Coached English parliamentary debate: argument building, rebuttal, speech structure and public speaking.",
        "Advised students and families on programme choices, academic planning, applications and English preparation.",
      ],
    },
    {
      id: "cuhk-shenzhen",
      kind: "role",
      title: "AI Intern, Smart City Transport and Logistics Project",
      org: "Shenzhen Big Data Research Institute, CUHK-Shenzhen",
      location: "Shenzhen, China",
      start: "2024-07",
      end: "2024-08",
      bullets: [
        "Reviewed research for a smart-city transport and logistics project, wrote technical summaries and reports, and represented the institute at WOLIT 2024.",
        "Built and trained neural networks and small CNNs in PyTorch: tensors, Dataset and DataLoader pipelines, cross-entropy loss, backpropagation and gradient-based optimisers.",
        "Wrote training and validation loops in Jupyter, tracked loss and accuracy, and tested changes to layers, batch size and learning rate.",
        "Prepared the data with NumPy and pandas, built an SVM baseline with scikit-learn, and evaluated results with balanced accuracy and confusion matrices.",
      ],
      stack: ["PyTorch", "NumPy", "pandas", "scikit-learn", "Jupyter"],
    },
    {
      id: "monash",
      kind: "education",
      title: "Bachelor of Computer Science (Data Science and AI)",
      org: "Monash University",
      location: "Melbourne, Australia",
      start: "2025-02",
      end: "present",
      bullets: [
        "WAM 79.",
        "Outreach Officer, Melbourne Venture Club: organised events, contacted sponsors and external partners, and helped run the Next-Gen Entrepreneurship Competition.",
      ],
    },
    {
      id: "airbotix",
      kind: "role",
      title: "Full-Stack and AI Engineer (Contract)",
      org: "Airbotix",
      location: "Melbourne and remote",
      start: "2026-03",
      end: "2026-07",
      bullets: [
        "Built and maintained features for an AI education platform connecting student, teacher and administration workflows across several web apps.",
        "Integrated LLM features and MCP-based tools into product workflows, connecting React interfaces to Node.js and TypeScript APIs and data services.",
        "Built REST APIs, data models, authentication and role-based access flows, and front-end integrations with React, TypeScript, Node.js and PostgreSQL.",
        "Delivered teacher-console tools for student search, class and enrolment filters, privacy rules and API integration.",
        "Worked in a six-person product team, coordinating changes through technical specs and GitHub pull requests, and debugging local and Docker services.",
      ],
      stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    },
    {
      id: "aidc",
      kind: "role",
      title: "AI Deployment Engineer Intern",
      org: "AIDC, AI Deployment Company",
      location: "Melbourne, Shenzhen and remote",
      start: "2026-07",
      end: "present",
      bullets: [
        "Operate and maintain AIDC's Company Harness, a file-based system that gives each AI agent its role, knowledge, permissions, SOPs and tools.",
        "Debug issues across the harness, LLM calls, MCP tool connections, APIs and the deployment environment by reading logs, reproducing failures, testing fixes and checking production behaviour.",
        "Configure and maintain role-based AI agents for manufacturing and supply-chain teams: knowledge files, tool permissions, prompts and workflow settings.",
        "Work with users and the engineering team to turn quotation, production-planning and operations tasks into clear agent workflows, then document issues and release fixes.",
        "Make front-end and back-end changes in TypeScript, React, Node.js and Python, using Git and Docker for testing and deployment.",
      ],
      stack: ["TypeScript", "React", "Node.js", "Python", "MCP", "Docker"],
    },
  ],

  projects: [
    {
      slug: "quant-rag",
      category: "Retrieval",
      title: "Local RAG over quant literature",
      stack: ["[stack]"],
      pitch:
        "[One-sentence pitch for the local retrieval-augmented generation system over quantitative finance papers.]",
      details: [
        "[What it indexes, how retrieval works, and what it produced.]",
      ],
      links: {},
    },
    {
      slug: "cardio-risk",
      category: "Research",
      title: "Cardiovascular risk research",
      stack: ["[stack]"],
      pitch:
        "[One-sentence pitch for the cardiovascular risk research project.]",
      details: ["[Dataset, method, evaluation and result.]"],
      links: {},
    },
    {
      slug: "agent-harness-operations",
      category: "Operations",
      title: "Operating an AI agent harness",
      stack: ["MCP", "LLM APIs", "TypeScript", "Python", "Docker"],
      pitch:
        "What it takes to keep role-based AI agents useful for manufacturing teams day to day.",
      details: [
        "Each agent is a set of files: role, knowledge, permissions, SOPs and tools. Changing behaviour means changing files, reviewing them and releasing.",
        "Most incidents trace to one of four places: the harness configuration, the LLM call, an MCP tool connection, or the deployment environment. Logs and a reproduction come first.",
        "Users describe quotation and production-planning tasks in their own terms; the work is turning those into agent workflows that survive contact with real data.",
      ],
      links: {},
    },
    {
      slug: "this-site",
      category: "Web",
      title: "This site",
      stack: [
        "Next.js 16",
        "TypeScript",
        "Tailwind CSS v4",
        "Zod",
        "Playwright",
      ],
      pitch:
        "A statically generated résumé with a four-layer architecture enforced by the linter.",
      details: [
        "Content is one typed file validated by Zod at build time, so invalid résumé data fails the build with the path of the offending field.",
        "Lint rules enforce import direction between content, domain, application and presentation layers.",
        "Every pull request runs typecheck, lint, unit tests, Playwright with axe, a JavaScript budget and Lighthouse.",
      ],
      links: { repo: "https://github.com/NoahZhongAu/noah-site" },
    },
  ],

  skills: [
    {
      label: "LLM & Agent Systems",
      items: [
        "LLM APIs",
        "MCP servers",
        "agent tools",
        "prompt and workflow design",
        "agent knowledge files",
        "context management",
      ],
    },
    {
      label: "Evaluation & Machine Learning",
      items: [
        "PyTorch",
        "scikit-learn",
        "NumPy",
        "pandas",
        "Jupyter",
        "CNNs",
        "model training and evaluation",
      ],
    },
    {
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Java", "SQL"],
    },
    {
      label: "Backend & Data",
      items: [
        "React",
        "Node.js",
        "REST APIs",
        "PostgreSQL",
        "authentication",
        "role-based access control",
      ],
    },
    {
      label: "Production & Delivery",
      items: [
        "Docker",
        "Git and GitHub",
        "debugging and log analysis",
        "testing",
        "deployment and production support",
        "technical specifications",
      ],
    },
  ],

  eras: [
    {
      id: 1,
      image: "/eras/era-1.jpg",
      alt: "Clerks in 1940s clothing seen from behind at a row of wooden desks in a night meadow, working adding machines under one green desk lamp.",
      fromStep: 1,
      toStep: 1,
    },
    {
      id: 2,
      image: "/eras/era-2.jpg",
      alt: "A figure seen from behind facing a wall-sized relay machine in a night meadow, paper tape threading through its readers under an amber work lamp.",
      fromStep: 2,
      toStep: 2,
    },
    {
      id: 3,
      image: "/eras/era-3.jpg",
      alt: "Two technicians in white coats seen from behind at a console in front of a row of 1960s mainframe cabinets with tape reels, in a night meadow.",
      fromStep: 3,
      toStep: 3,
    },
    {
      id: 4,
      image: "/eras/era-4.jpg",
      alt: "A figure seen from behind at a small wooden desk in a night meadow, a bulky 1990s CRT monitor glowing amber beside stacks of books and floppy disks.",
      fromStep: 4,
      toStep: 4,
    },
    {
      id: 5,
      image: "/eras/era-5.jpg",
      alt: "A young man in a white shirt seen from behind at a small wooden desk in a night meadow, a laptop glowing warm yellow between stacks of books.",
      fromStep: 5,
      toStep: 5,
    },
    {
      id: 6,
      image: "/eras/era-6.jpg",
      alt: "A young man seen from behind sitting cross-legged among wildflowers at night, lit only by the glow of a phone in his hand.",
      fromStep: 6,
      toStep: 6,
    },
    {
      id: 7,
      image: "/eras/era-7.jpg",
      alt: "A young man in a white shirt seen from behind at a desk in a night meadow, a laptop glowing beside a server cabinet with blue indicator lights.",
      fromStep: 7,
      toStep: 7,
    },
  ],
};
