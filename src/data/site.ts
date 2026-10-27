export const site = {
  name: 'Muntaha Kamal',
  title: 'Muntaha Kamal | AI Engineer',
  description: 'Muntaha Kamal builds machine learning and deep learning models, and LLM applications. AI engineer at Tata Electronics, previously a data scientist at Micron.',
  email: 'muntahakamal15@gmail.com',
  github: 'https://github.com/Muntaha15',
  linkedin: 'https://www.linkedin.com/in/muntaha-kamal',
  resume: '/Muntaha_Kamal_Resume.pdf',
  url: 'https://muntaha15.github.io',
};

// Public project pages describe independent repositories, not employer platforms.
export const experience = [
  {
    company: 'Tata Electronics',
    role: 'AI Engineer · Assistant Manager',
    period: 'December 2025 – Present',
    description: 'Building LLM applications with GraphRAG for learning from technical documentation.',
    highlights: [
      'Built an end-to-end GraphRAG-based learning platform that turns technical documentation into department-specific learning modules. Selected the retrieval approach and developed ingestion pipelines for text, tables, and images.',
      'Changed retrieval to filter candidates by document before selecting the top results. Preserved the source of graph evidence and images, including when documents share an entity.',
      'Completed five months of training in Taiwan, learning about fab systems, wafer movement, and production data with manufacturing and process teams.',
    ],
  },
  {
    company: 'Micron Technology',
    role: 'Data Scientist II',
    period: 'January 2024 – November 2025',
    description: 'Developed models for NAND memory reliability, alongside tools for manufacturing-data investigation.',
    highlights: [
      'Owned NAND memory reliability modeling and statistical analysis. Compared direct predictions for individual chips (dies) with a hierarchical approach: estimate a wafer baseline, then predict each die’s deviation from it. The core team used these predictions to optimize operating settings and increase the share of dies meeting higher-grade reliability requirements.',
      'Built predictive models using initial test measurements to identify dies capable of meeting higher-grade NAND reliability requirements earlier. This separate cross-functional qualification effort was presented at the internal Micron NAND Summit.',
      'Developed NAND error-count anomaly analysis in Python and BigQuery. Used rolling-median baselines, Savitzky–Golay smoothing, and thresholds on positive deviations from the baseline to flag local variation below static error-correction limits. Prioritized recurring outliers for interactive Plotly investigation and first-authored an internal Micron technical paper.',
      'Co-developed the Unified Reliability Modeling Platform, contributing to scoping and owning reusable, tested Python modeling-workflow modules, visualization, and evaluation to support consistent reliability studies. Applied rigorous peer review to code and design decisions.',
    ],
  },
  {
    company: 'Micron Technology',
    role: 'Data Scientist I',
    period: 'June 2022 – December 2023',
    description: 'Built decision support and data workflows for manufacturing teams.',
    highlights: [
      'Trained a Random Forest model on historical engineering-test data and engineer decisions to recommend retaining or lowering the material’s grade after manufacturing deviations. It showed influential features and withheld low-confidence recommendations. Engineers retained final approval; start-to-close review turnaround fell by approximately 14 days.',
      'Co-developed a GCP Airflow pipeline for data extraction, preprocessing, and model inference, with email alerts on failure. Compared with manually extracting and preprocessing one item at a time, it reduced combined model-development and data-engineering effort by approximately 50%.',
      'Built a separate twice-weekly workflow that checked whether material met pass criteria and emailed an alert when it did.',
    ],
  },
];

export const education = {
  institution: 'Indian Institute of Technology, Delhi',
  degree: 'B.Tech in Production & Industrial Engineering',
  period: 'July 2018 – June 2022',
};
