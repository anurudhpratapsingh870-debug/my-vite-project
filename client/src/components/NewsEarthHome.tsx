import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Menu,
  MoonStar,
  PlayCircle,
  Search,
  SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  audienceStats,
  breakingBulletins,
  editorialProducts,
  topStories,
  userFeatures,
  workflows,
} from "@/components/news-earth-content";

const categories = ["All", "World", "Climate", "Business", "Audience"];

export default function NewsEarthHome() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const filteredStories = useMemo(() => {
    return topStories.filter((story) => {
      const categoryMatch = activeCategory === "All" || story.category === activeCategory;
      const searchMatch = [story.title, story.summary, story.location, story.tag]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(197_92%_65%/.12),transparent_40%),linear-gradient(180deg,hsl(var(--background)),hsl(210_40%_99%))] text-foreground transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,hsl(195_75%_50%/.18),transparent_35%),linear-gradient(180deg,hsl(221_39%_10%),hsl(224_32%_8%))]">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold tracking-tight">News Earth</p>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Modern Global Media House</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
              <a href="#top-stories" className="text-muted-foreground transition hover:text-foreground">Top stories</a>
              <a href="#formats" className="text-muted-foreground transition hover:text-foreground">Formats</a>
              <a href="#membership" className="text-muted-foreground transition hover:text-foreground">Membership</a>
              <a href="#operations" className="text-muted-foreground transition hover:text-foreground">Operations</a>
              <Link href="/admin" className="text-muted-foreground transition hover:text-foreground">Admin</Link>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Button variant="outline" className="rounded-full" onClick={() => setDarkMode((value) => !value)}>
                {darkMode ? <SunMedium className="mr-2 h-4 w-4" /> : <MoonStar className="mr-2 h-4 w-4" />}
                {darkMode ? "Light" : "Night"}
              </Button>
              <Button className="rounded-full bg-cyan-500 text-white hover:bg-cyan-400">
                Subscribe now
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="space-y-6">
                <div>
                  <p className="font-serif text-2xl font-bold">News Earth</p>
                  <p className="text-sm text-muted-foreground">Responsive media house navigation</p>
                </div>
                <div className="grid gap-3 text-sm">
                  <a href="#top-stories">Top stories</a>
                  <a href="#formats">Formats</a>
                  <a href="#membership">Membership</a>
                  <a href="#operations">Operations</a>
                  <Link href="/admin">Admin side</Link>
                </div>
                <Button variant="outline" className="w-full rounded-full" onClick={() => setDarkMode((value) => !value)}>
                  {darkMode ? "Switch to light mode" : "Switch to night mode"}
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main>
          <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
            <div className="space-y-8">
              <Badge className="rounded-full bg-cyan-500/10 px-4 py-1 text-cyan-700 dark:text-cyan-200">
                Full-featured user experience for a global media brand
              </Badge>
              <div className="space-y-6">
                <h1 className="max-w-4xl font-serif text-5xl font-bold leading-tight sm:text-6xl">
                  A responsive digital newsroom built for readers, reporters, editors, and advertisers.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  News Earth combines fast breaking coverage, trusted explainers, rich media formats, newsletters, and a clean admin workflow in one polished experience.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="rounded-full bg-cyan-500 px-6 text-white hover:bg-cyan-400">
                  Explore live coverage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/admin">
                  <Button variant="outline" className="w-full rounded-full px-6 sm:w-auto">
                    Open admin workspace
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-white/20 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:grid-cols-3">
                {breakingBulletins.map((bulletin) => (
                  <div key={bulletin.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">{bulletin.label}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{bulletin.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20">
              <CardContent className="space-y-8 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Live control room</p>
                    <h2 className="mt-3 font-serif text-3xl font-bold">Today’s newsroom pulse</h2>
                  </div>
                  <Badge className="rounded-full bg-emerald-400/15 text-emerald-200">12 desks active</Badge>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Lead stream</span>
                    <span>Updated 2 min ago</span>
                  </div>
                  <p className="mt-4 font-serif text-2xl font-semibold leading-snug">
                    Readers are following climate, elections, business policy, and explainers across mobile, web, and audio.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {audienceStats.slice(0, 4).map((stat) => (
                      <div key={stat.label} className="rounded-2xl bg-white/5 p-4">
                        <p className="text-sm text-slate-400">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                        <p className="text-xs text-cyan-200/80">{stat.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                  <PlayCircle className="h-5 w-5" />
                  Studio-ready reels, live blogs, and explainers are managed from the same brand system.
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="top-stories" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 rounded-[2rem] border border-border/70 bg-background/85 p-6 shadow-lg shadow-slate-900/5 backdrop-blur xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">User side features</p>
                <h2 className="mt-3 font-serif text-4xl font-bold">Fast discovery, strong editorial context, and clean reading flow.</h2>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                <div className="relative min-w-[260px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search stories, places, tags..."
                    className="rounded-full pl-10"
                  />
                </div>
                <Button variant="outline" className="rounded-full">Save my briefing</Button>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mt-6">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-transparent p-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-full border border-border bg-background px-5 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {filteredStories.map((story) => (
                      <Card key={story.id} className="rounded-[1.75rem] border-border/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
                        <CardContent className="space-y-4 p-6">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="rounded-full">{story.category}</Badge>
                            <Badge className="rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-200">{story.tag}</Badge>
                            <span className="text-sm text-muted-foreground">{story.readTime}</span>
                          </div>
                          <div>
                            <h3 className="font-serif text-2xl font-bold leading-snug">{story.title}</h3>
                            <p className="mt-3 text-muted-foreground">{story.summary}</p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{story.location}</span>
                            <Button variant="ghost" className="rounded-full px-0 text-cyan-600 hover:bg-transparent hover:text-cyan-500">
                              Read story
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {filteredStories.length === 0 && (
                      <Card className="rounded-[1.75rem] border-dashed lg:col-span-2">
                        <CardContent className="p-8 text-center text-muted-foreground">
                          No stories matched this filter. Try another category or search term.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          <section id="formats" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {[userFeatures, editorialProducts].map((group, index) => (
                <Card key={index} className="rounded-[2rem] border-border/70 bg-background/85">
                  <CardHeader>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
                      {index === 0 ? "Reader experience" : "Editorial formats"}
                    </p>
                    <CardTitle className="font-serif text-3xl">
                      {index === 0 ? "Everything audiences expect from a premium media house." : "Every content format supported in one brand system."}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    {group.map((item) => (
                      <div key={item.title} className="rounded-[1.5rem] border border-border/60 bg-background p-5">
                        <item.icon className="h-10 w-10 rounded-2xl bg-cyan-500/10 p-2 text-cyan-600" />
                        <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="membership" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <Card className="rounded-[2rem] border-none bg-cyan-500 text-white shadow-2xl shadow-cyan-500/20">
                <CardContent className="space-y-6 p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-50/80">Membership & monetization</p>
                  <h2 className="font-serif text-4xl font-bold">Subscriptions, sponsored series, newsletters, and premium explainers.</h2>
                  <p className="text-cyan-50/80">
                    News Earth is designed like a modern media business, not just a homepage. Revenue teams can pair sponsorships with trust-friendly reader journeys.
                  </p>
                  <div className="grid gap-3">
                    {[
                      "Metered membership and premium article prompts",
                      "Branded content zones separated from editorial coverage",
                      "Newsletter funnels and campaign performance snapshots",
                      "Native ad inventory with approval-friendly placement control",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {audienceStats.map((stat) => (
                  <Card key={stat.label} className="rounded-[1.75rem] border-border/70 bg-background/85">
                    <CardContent className="p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                      <p className="mt-4 font-serif text-4xl font-bold">{stat.value}</p>
                      <p className="mt-2 text-sm text-cyan-600">{stat.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="operations" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Card className="rounded-[2rem] border-border/70 bg-background/90">
              <CardHeader className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Operations at a glance</p>
                <CardTitle className="font-serif text-4xl">The workflows a real media house needs on the admin and editorial side.</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {workflows.map((workflow) => (
                  <div key={workflow.title} className="rounded-[1.5rem] border border-border/60 bg-background p-5 shadow-sm">
                    <workflow.icon className="h-10 w-10 rounded-2xl bg-cyan-500/10 p-2 text-cyan-600" />
                    <h3 className="mt-4 text-lg font-semibold">{workflow.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{workflow.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="border-t border-border/70 bg-background/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-serif text-xl font-bold text-foreground">News Earth</p>
              <p>Responsive user and admin media platform concept with premium editorial styling.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#top-stories">Stories</a>
              <a href="#membership">Membership</a>
              <a href="#operations">Operations</a>
              <Link href="/admin">Admin portal</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
