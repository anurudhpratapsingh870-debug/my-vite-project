import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  Camera,
  Globe2,
  Megaphone,
  Mic2,
  Newspaper,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Tv,
  Users,
  Video,
} from "lucide-react";

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  readTime: string;
  location: string;
  summary: string;
  tag: string;
}

export interface Bulletin {
  id: number;
  label: string;
  text: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const breakingBulletins: Bulletin[] = [
  { id: 1, label: "Live", text: "Election tracker updates every five minutes with constituency heat maps." },
  { id: 2, label: "Exclusive", text: "Climate desk launches an EarthSignals report on coastal adaptation funding." },
  { id: 3, label: "Now", text: "Morning podcast and evening video briefings publish in one unified newsroom workflow." },
];

export const topStories: NewsArticle[] = [
  {
    id: 1,
    title: "How community solar projects are cutting power bills across fast-growing cities",
    category: "Climate",
    readTime: "6 min read",
    location: "Nairobi",
    summary: "A data-driven field report on financing, adoption, and what scalable public-private models look like.",
    tag: "Editor's Pick",
  },
  {
    id: 2,
    title: "Inside the creator economy for regional newsrooms: what actually drives subscriptions",
    category: "Business",
    readTime: "8 min read",
    location: "London",
    summary: "We map the bundles, memberships, newsletters, and trust signals modern media brands are using.",
    tag: "Analysis",
  },
  {
    id: 3,
    title: "The new diplomacy around water security is reshaping South Asian infrastructure",
    category: "World",
    readTime: "7 min read",
    location: "Dhaka",
    summary: "A visual explainer following river-sharing, logistics, and the high-stakes policy choices behind the scenes.",
    tag: "Deep Report",
  },
  {
    id: 4,
    title: "From headlines to explainers: why younger audiences prefer context over outrage",
    category: "Audience",
    readTime: "5 min read",
    location: "New York",
    summary: "News Earth tests format changes that improve retention without sacrificing speed or editorial rigor.",
    tag: "Research",
  },
];

export const userFeatures: FeatureCard[] = [
  {
    title: "24/7 live newsroom",
    description: "Breaking alerts, live blogs, and a unified homepage that helps readers move from urgent updates to trusted context.",
    icon: Newspaper,
  },
  {
    title: "Video, audio, and text in one flow",
    description: "Short-form video, TV-style explainers, radio clips, newsletters, and written stories stay synced across channels.",
    icon: Tv,
  },
  {
    title: "Personalized reading journeys",
    description: "Saved stories, category follows, dark mode friendly surfaces, and modular cards tuned for mobile-first use.",
    icon: Sparkles,
  },
  {
    title: "Trust and verification layer",
    description: "Fact-check labels, source notes, reporter credentials, and timeline summaries make complex stories easier to verify.",
    icon: ShieldCheck,
  },
];

export const editorialProducts: FeatureCard[] = [
  {
    title: "World desk",
    description: "Global correspondents, quick takes, timeline explainers, and map-driven context for international developments.",
    icon: Globe2,
  },
  {
    title: "Earth data lab",
    description: "Interactive charts, public-interest datasets, climate dashboards, and visual storytelling packages.",
    icon: BarChart3,
  },
  {
    title: "Studio and podcasts",
    description: "Daily briefing podcasts, panel conversations, and studio-ready scripting for video-first distribution.",
    icon: Mic2,
  },
  {
    title: "Field reporting unit",
    description: "On-ground producers, mobile journalism kits, fast asset uploads, and region-specific publishing queues.",
    icon: Camera,
  },
];

export const audienceStats = [
  { label: "Monthly readers", value: "2.4M", detail: "+18% QoQ" },
  { label: "Avg. session time", value: "8m 42s", detail: "High intent mobile audience" },
  { label: "Newsletter growth", value: "64K", detail: "+11K in 30 days" },
  { label: "Story completion", value: "71%", detail: "Across long-form explainers" },
];

export const workflows: FeatureCard[] = [
  {
    title: "Planning calendar",
    description: "Editorial calendars, campaign launches, assignments, and approval checkpoints in one responsive workspace.",
    icon: BookOpen,
  },
  {
    title: "Push alert center",
    description: "Craft audience-safe push notifications, urgency labels, and scheduled app alerts with role-based approvals.",
    icon: Bell,
  },
  {
    title: "Revenue campaigns",
    description: "Manage sponsor placements, branded series, subscription offers, and conversion experiments without clutter.",
    icon: Megaphone,
  },
  {
    title: "Community moderation",
    description: "Track comments, reader submissions, and trust escalations with transparent moderation notes.",
    icon: Users,
  },
];

export const adminMetrics = [
  { title: "Published today", value: "38", trend: "+12% vs yesterday", icon: BadgeCheck },
  { title: "Stories in review", value: "14", trend: "4 need legal review", icon: BookOpen },
  { title: "Active live feeds", value: "06", trend: "2 multi-region events", icon: Radio },
  { title: "Video completions", value: "82%", trend: "+9% this week", icon: Video },
  { title: "Subscriber conversions", value: "1,284", trend: "+6.4% this month", icon: TrendingUp },
];


export const adminTasks = [
  {
    title: "Approve homepage lead package",
    status: "Urgent",
    owner: "Editor in Chief",
    due: "09:30 UTC",
  },
  {
    title: "Review climate desk infographic captions",
    status: "In review",
    owner: "Visual Editor",
    due: "11:15 UTC",
  },
  {
    title: "Schedule evening world briefing",
    status: "Scheduled",
    owner: "Broadcast Producer",
    due: "18:00 UTC",
  },
  {
    title: "Confirm advertiser placement on tech newsletter",
    status: "Pending",
    owner: "Revenue Ops",
    due: "16:00 UTC",
  },
];

export const adminStories = [
  {
    id: 1,
    headline: "Heat resilience funds reach record commitments in coastal cities",
    desk: "Climate",
    stage: "Ready to publish",
    author: "Mila Harper",
  },
  {
    id: 2,
    headline: "Markets calm after central bank signals slower tightening path",
    desk: "Business",
    stage: "Needs edits",
    author: "Jon Reyes",
  },
  {
    id: 3,
    headline: "Weekend explainer: AI regulation and newsroom accountability",
    desk: "Tech Policy",
    stage: "Scheduled",
    author: "Asha Bell",
  },
];
