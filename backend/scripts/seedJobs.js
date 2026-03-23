require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Job = require("../models/Job");
const User = require("../models/User");

const jobSeeds = [
  {
    title: "Frontend Developer",
    companyName: "Google",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Build accessible React interfaces for large-scale consumer products.",
    description:
      "Develop responsive user interfaces, collaborate with design systems teams, and optimize performance across modern web applications.",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
    salaryRange: "18-24 LPA",
    applicationDeadline: "2026-04-10",
    createdAt: "2026-03-10T09:00:00.000Z"
  },
  {
    title: "Backend Developer",
    companyName: "Amazon",
    location: "Hyderabad, India",
    jobType: "Full Time",
    shortDescription: "Design and maintain scalable backend APIs for commerce workflows.",
    description:
      "Build Node.js microservices, improve API reliability, and work on distributed systems that support high-traffic internal and customer-facing platforms.",
    requiredSkills: ["Node.js", "Express", "MongoDB", "REST APIs", "AWS"],
    salaryRange: "16-22 LPA",
    applicationDeadline: "2026-04-08",
    createdAt: "2026-03-09T09:00:00.000Z"
  },
  {
    title: "Full Stack Developer",
    companyName: "Microsoft",
    location: "Noida, India",
    jobType: "Remote",
    shortDescription: "Own features from React frontend through Node backend delivery.",
    description:
      "Implement end-to-end product capabilities across frontend and backend layers while maintaining high code quality and testability.",
    requiredSkills: ["React", "Node.js", "MongoDB", "Express", "Git"],
    salaryRange: "15-21 LPA",
    applicationDeadline: "2026-04-15",
    createdAt: "2026-03-08T09:00:00.000Z"
  },
  {
    title: "Software Engineer",
    companyName: "Infosys",
    location: "Pune, India",
    jobType: "Full Time",
    shortDescription: "Develop enterprise-grade applications and platform integrations.",
    description:
      "Work on production feature delivery, API integrations, defect fixes, and release support for large enterprise systems.",
    requiredSkills: ["JavaScript", "Java", "SQL", "REST APIs", "Git"],
    salaryRange: "8-12 LPA",
    applicationDeadline: "2026-04-12",
    createdAt: "2026-03-07T09:00:00.000Z"
  },
  {
    title: "Data Analyst",
    companyName: "Accenture",
    location: "Chennai, India",
    jobType: "Full Time",
    shortDescription: "Turn business and product data into actionable insights.",
    description:
      "Build dashboards, analyze business KPIs, write SQL queries, and communicate findings to product and operations teams.",
    requiredSkills: ["SQL", "Python", "Excel", "Power BI", "Data Visualization"],
    salaryRange: "7-11 LPA",
    applicationDeadline: "2026-04-05",
    createdAt: "2026-03-06T09:00:00.000Z"
  },
  {
    title: "UI/UX Designer",
    companyName: "Adobe",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Design intuitive product experiences across desktop and mobile.",
    description:
      "Create user flows, wireframes, prototypes, and polished visual designs in collaboration with product and engineering teams.",
    requiredSkills: ["Figma", "Wireframing", "User Research", "Prototyping", "Design Systems"],
    salaryRange: "12-18 LPA",
    applicationDeadline: "2026-04-18",
    createdAt: "2026-03-05T09:00:00.000Z"
  },
  {
    title: "DevOps Engineer",
    companyName: "IBM",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Automate CI/CD pipelines and improve infrastructure reliability.",
    description:
      "Manage deployments, containerized workloads, observability, and cloud infrastructure with a strong focus on uptime and automation.",
    requiredSkills: ["Docker", "Kubernetes", "Jenkins", "Linux", "AWS"],
    salaryRange: "14-19 LPA",
    applicationDeadline: "2026-04-20",
    createdAt: "2026-03-04T09:00:00.000Z"
  },
  {
    title: "Cloud Engineer",
    companyName: "Oracle",
    location: "Mumbai, India",
    jobType: "Full Time",
    shortDescription: "Provision and maintain cloud-native infrastructure for internal platforms.",
    description:
      "Support cloud migration, infrastructure automation, and secure service deployments across multiple environments.",
    requiredSkills: ["Azure", "AWS", "Terraform", "Linux", "Networking"],
    salaryRange: "13-18 LPA",
    applicationDeadline: "2026-04-22",
    createdAt: "2026-03-03T09:00:00.000Z"
  },
  {
    title: "AI/ML Engineer",
    companyName: "NVIDIA",
    location: "Pune, India",
    jobType: "Full Time",
    shortDescription: "Build machine learning pipelines and production inference services.",
    description:
      "Train, evaluate, and deploy ML models while improving data pipelines and supporting model monitoring in production.",
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL"],
    salaryRange: "20-28 LPA",
    applicationDeadline: "2026-04-25",
    createdAt: "2026-03-02T09:00:00.000Z"
  },
  {
    title: "Mobile App Developer",
    companyName: "Flipkart",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Ship user-facing mobile experiences across Android and iOS.",
    description:
      "Develop performant mobile app features, integrate backend APIs, and maintain high app quality through testing and profiling.",
    requiredSkills: ["React Native", "JavaScript", "Android", "iOS", "REST APIs"],
    salaryRange: "12-17 LPA",
    applicationDeadline: "2026-04-14",
    createdAt: "2026-03-01T09:00:00.000Z"
  },
  {
    title: "Software Developer Intern",
    companyName: "Paytm",
    location: "Noida, India",
    jobType: "Internship",
    shortDescription: "Support feature development for internal product engineering teams.",
    description:
      "Work with mentors on bug fixes, feature implementation, code reviews, and testing for web-based business tools.",
    requiredSkills: ["JavaScript", "React", "Git", "HTML", "CSS"],
    salaryRange: "35K-50K / month",
    applicationDeadline: "2026-04-07",
    createdAt: "2026-02-28T09:00:00.000Z"
  },
  {
    title: "QA Automation Engineer",
    companyName: "Zoho",
    location: "Chennai, India",
    jobType: "Full Time",
    shortDescription: "Build automated test coverage for product releases.",
    description:
      "Create UI and API automation suites, improve regression coverage, and support engineering teams in release validation.",
    requiredSkills: ["Selenium", "Java", "API Testing", "Postman", "Test Automation"],
    salaryRange: "9-13 LPA",
    applicationDeadline: "2026-04-19",
    createdAt: "2026-02-27T09:00:00.000Z"
  },
  {
    title: "Product Analyst",
    companyName: "Swiggy",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Support product strategy with experimentation and analytics.",
    description:
      "Analyze user behavior, define KPIs, track experiments, and help product teams make data-backed roadmap decisions.",
    requiredSkills: ["SQL", "Excel", "Python", "A/B Testing", "Analytics"],
    salaryRange: "10-14 LPA",
    applicationDeadline: "2026-04-16",
    createdAt: "2026-02-26T09:00:00.000Z"
  },
  {
    title: "Site Reliability Engineer",
    companyName: "Atlassian",
    location: "Remote, India",
    jobType: "Remote",
    shortDescription: "Improve service reliability, incident response, and observability.",
    description:
      "Operate cloud services, reduce operational toil, and build tooling that improves resilience and engineering productivity.",
    requiredSkills: ["Linux", "AWS", "Monitoring", "Incident Management", "Terraform"],
    salaryRange: "19-26 LPA",
    applicationDeadline: "2026-04-24",
    createdAt: "2026-02-25T09:00:00.000Z"
  },
  {
    title: "Security Engineer",
    companyName: "Cisco",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Secure application platforms and internal systems at scale.",
    description:
      "Perform security reviews, improve defensive controls, and automate vulnerability management for cloud-native systems.",
    requiredSkills: ["Network Security", "OWASP", "SIEM", "Python", "Cloud Security"],
    salaryRange: "16-23 LPA",
    applicationDeadline: "2026-04-28",
    createdAt: "2026-02-24T09:00:00.000Z"
  },
  {
    title: "Business Analyst",
    companyName: "Deloitte",
    location: "Hyderabad, India",
    jobType: "Full Time",
    shortDescription: "Translate business requirements into delivery-ready documentation.",
    description:
      "Work with stakeholders to document requirements, analyze workflows, and support implementation teams through release cycles.",
    requiredSkills: ["Requirement Gathering", "SQL", "Excel", "Documentation", "Stakeholder Management"],
    salaryRange: "8-12 LPA",
    applicationDeadline: "2026-04-13",
    createdAt: "2026-02-23T09:00:00.000Z"
  },
  {
    title: "React Developer",
    companyName: "Capgemini",
    location: "Kolkata, India",
    jobType: "Full Time",
    shortDescription: "Deliver modern frontend modules for enterprise web products.",
    description:
      "Build reusable UI components, integrate REST APIs, and collaborate with QA and backend teams for feature delivery.",
    requiredSkills: ["React", "Redux", "JavaScript", "HTML", "CSS"],
    salaryRange: "9-14 LPA",
    applicationDeadline: "2026-04-11",
    createdAt: "2026-02-22T09:00:00.000Z"
  },
  {
    title: "MERN Stack Developer",
    companyName: "Tata Consultancy Services",
    location: "Mumbai, India",
    jobType: "Full Time",
    shortDescription: "Build full-stack business applications using MongoDB, Express, React, and Node.",
    description:
      "Develop backend APIs, integrate frontend components, and maintain data flows across end-to-end business workflows.",
    requiredSkills: ["MongoDB", "Express", "React", "Node.js", "REST APIs"],
    salaryRange: "10-16 LPA",
    applicationDeadline: "2026-04-21",
    createdAt: "2026-02-21T09:00:00.000Z"
  },
  {
    title: "Data Engineer",
    companyName: "Wipro",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Build and maintain ETL pipelines for analytics and reporting.",
    description:
      "Design data ingestion jobs, optimize warehouse performance, and support downstream analytics use cases across teams.",
    requiredSkills: ["Python", "SQL", "ETL", "Airflow", "Data Warehousing"],
    salaryRange: "11-16 LPA",
    applicationDeadline: "2026-04-17",
    createdAt: "2026-02-20T09:00:00.000Z"
  },
  {
    title: "Android Developer",
    companyName: "PhonePe",
    location: "Bengaluru, India",
    jobType: "Full Time",
    shortDescription: "Develop and maintain Android app experiences for payments products.",
    description:
      "Implement native Android features, improve app performance, and integrate secure payment and user account APIs.",
    requiredSkills: ["Kotlin", "Android", "Java", "REST APIs", "Unit Testing"],
    salaryRange: "13-18 LPA",
    applicationDeadline: "2026-04-23",
    createdAt: "2026-02-19T09:00:00.000Z"
  }
];

const getSeedOwner = async () => {
  const owner = await User.findOne()
    .populate("role_id", "role_name")
    .where("disabled")
    .ne(true)
    .sort({ created_at: 1 });

  if (owner && ["employer", "admin"].includes(owner.role_id?.role_name)) {
    return owner;
  }

  const eligibleOwners = await User.find({ disabled: { $ne: true } })
    .populate("role_id", "role_name")
    .sort({ created_at: 1 });

  return eligibleOwners.find((user) => ["employer", "admin"].includes(user.role_id?.role_name)) || null;
};

const seedJobs = async () => {
  try {
    await connectDB();

    const owner = await getSeedOwner();
    if (!owner) {
      throw new Error("No active employer or admin user found to assign seeded jobs.");
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const seed of jobSeeds) {
      const existingJob = await Job.findOne({
        title: seed.title,
        companyName: seed.companyName,
        location: seed.location
      }).select("_id");

      if (existingJob) {
        skippedCount += 1;
        continue;
      }

      await Job.create({
        title: seed.title,
        companyName: seed.companyName,
        location: seed.location,
        jobType: seed.jobType,
        shortDescription: seed.shortDescription,
        description: seed.description,
        requiredSkills: seed.requiredSkills,
        salaryRange: seed.salaryRange,
        applicationDeadline: new Date(seed.applicationDeadline),
        logo: seed.companyName[0]?.toUpperCase() || "",
        status: "Active",
        postedBy: owner._id,
        createdAt: new Date(seed.createdAt)
      });

      insertedCount += 1;
    }

    console.log(`[SEED JOBS] Inserted ${insertedCount} jobs. Skipped ${skippedCount} existing jobs.`);
    process.exit(0);
  } catch (error) {
    console.error("[SEED JOBS] Failed to seed jobs:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedJobs();
