import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ClipboardList,
  LayoutDashboard,
  LogIn,
  PenSquare,
  Search,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  adminMetrics,
  adminStories as initialStories,
  adminTasks as initialTasks,
  workflows,
} from "@/components/news-earth-content";

type StoryStage = "Draft" | "Needs edits" | "Scheduled" | "Ready to publish";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("editor@newsearth.io");
  const [password, setPassword] = useState("NewsEarth2026");
  const [stories, setStories] = useState(initialStories);
  const [tasks, setTasks] = useState(initialTasks);
  const [headline, setHeadline] = useState("New city climate resilience dashboard ready for review");
  const [notes, setNotes] = useState("Include a 30-second vertical teaser, homepage hero art, and newsletter CTA.");
  const [desk, setDesk] = useState("Climate");
  const [query, setQuery] = useState("");

  const filteredStories = useMemo(() => {
    return stories.filter((story) =>
      [story.headline, story.author, story.desk, story.stage].join(" ").toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, stories]);

  const contentHealth = Math.round((stories.filter((story) => story.stage === "Ready to publish").length / stories.length) * 100);

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleAddStory = () => {
    if (!headline.trim()) return;

    setStories((current) => [
      {
        id: current.length + 1,
        headline,
        desk,
        stage: "Draft",
        author: "Admin user",
      },
      ...current,
    ]);

    setTasks((current) => [
      {
        title: `Review new ${desk} draft`,
        status: "New",
        owner: "Managing Editor",
        due: "Next standup",
      },
      ...current,
    ]);

    setHeadline("");
    setNotes("");
  };

  const cycleStage = (id: number) => {
    const order: StoryStage[] = ["Draft", "Needs edits", "Scheduled", "Ready to publish"];
    setStories((current) =>
      current.map((story) => {
        if (story.id !== id) return story;
        const nextStage = order[(order.indexOf(story.stage as StoryStage) + 1) % order.length];
        return { ...story, stage: nextStage };
      }),
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(194_98%_55%/.14),transparent_35%),linear-gradient(180deg,hsl(0_0%_100%),hsl(210_40%_98%))] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/">
            <Button variant="ghost" className="mb-8 rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News Earth
            </Button>
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[2rem] border-none bg-slate-950 text-white shadow-2xl shadow-cyan-950/25">
              <CardContent className="space-y-6 p-8">
                <Badge className="w-fit rounded-full bg-cyan-500/15 text-cyan-200">Admin side</Badge>
                <h1 className="font-serif text-4xl font-bold leading-tight">A clean, easy-to-use newsroom control center for editors and operations teams.</h1>
                <p className="text-slate-300">
                  This admin concept includes login access, editorial scheduling, publishing workflow, task tracking, audience operations, and campaign management surfaces.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {workflows.map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <item.icon className="h-9 w-9 rounded-2xl bg-cyan-400/10 p-2 text-cyan-200" />
                      <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                      <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/70 bg-background/95 shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-700">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="font-serif text-3xl">News Earth Admin Login</CardTitle>
                    <p className="text-sm text-muted-foreground">Demo access for the editorial management interface.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl" />
                </div>
                <div className="rounded-[1.5rem] border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-muted-foreground">
                  Use the prefilled credentials to enter the demo admin workspace. The layout is optimized for quick action on desktop and mobile.
                </div>
                <Button onClick={handleLogin} className="w-full rounded-full bg-cyan-500 text-white hover:bg-cyan-400">
                  <LogIn className="mr-2 h-4 w-4" />
                  Enter admin workspace
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">News Earth Admin</p>
            <h1 className="font-serif text-3xl font-bold">Editorial, audience, and revenue dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/">
              <Button variant="outline" className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View site
              </Button>
            </Link>
            <Button variant="outline" className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => setIsLoggedIn(false)}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {adminMetrics.map((metric) => (
            <Card key={metric.title} className="rounded-[1.5rem] border-white/10 bg-white/5 text-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-300">{metric.title}</p>
                    <p className="mt-3 font-serif text-4xl font-bold">{metric.value}</p>
                    <p className="mt-2 text-sm text-cyan-300">{metric.trend}</p>
                  </div>
                  <metric.icon className="h-10 w-10 rounded-2xl bg-cyan-500/10 p-2 text-cyan-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Publishing pipeline</p>
                <CardTitle className="font-serif text-3xl">Manage stories and move them through each stage.</CardTitle>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search stories"
                  className="rounded-full border-white/10 bg-slate-900 pl-10 text-white placeholder:text-slate-400"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredStories.map((story) => (
                <div key={story.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="rounded-full bg-cyan-500/15 text-cyan-200">{story.desk}</Badge>
                      <Badge variant="outline" className="rounded-full border-white/15 text-slate-200">{story.stage}</Badge>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold">{story.headline}</h3>
                    <p className="mt-1 text-sm text-slate-400">By {story.author}</p>
                  </div>
                  <Button className="rounded-full bg-cyan-500 text-white hover:bg-cyan-400" onClick={() => cycleStage(story.id)}>
                    Advance stage
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
            <CardHeader>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Content health</p>
              <CardTitle className="font-serif text-3xl">The newsroom is on track for tonight’s front page.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                  <span>Ready-to-publish ratio</span>
                  <span>{contentHealth}%</span>
                </div>
                <Progress value={contentHealth} className="h-3 bg-white/10" />
              </div>
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <div key={`${task.title}-${task.owner}`} className="rounded-[1.25rem] border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{task.owner} · Due {task.due}</p>
                      </div>
                      <Badge className="rounded-full bg-white/10 text-slate-100">{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Tabs defaultValue="composer" className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-3 rounded-[1.5rem] bg-transparent p-0 md:grid-cols-4">
              {[
                { value: "composer", label: "Story composer", icon: PenSquare },
                { value: "calendar", label: "Calendar", icon: CalendarDays },
                { value: "audience", label: "Audience ops", icon: Users },
                { value: "alerts", label: "Alerts", icon: Bell },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 py-3 text-slate-200 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="composer">
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Quick create</p>
                    <CardTitle className="font-serif text-3xl">Draft a new story package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Headline</label>
                      <Input
                        value={headline}
                        onChange={(event) => setHeadline(event.target.value)}
                        className="rounded-2xl border-white/10 bg-slate-900 text-white"
                        placeholder="Type the headline"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Desk</label>
                      <Input value={desk} onChange={(event) => setDesk(event.target.value)} className="rounded-2xl border-white/10 bg-slate-900 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Production notes</label>
                      <Textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        className="min-h-32 rounded-2xl border-white/10 bg-slate-900 text-white"
                        placeholder="Add story notes, platform outputs, CTA, and visual requirements"
                      />
                    </div>
                    <Button onClick={handleAddStory} className="w-full rounded-full bg-cyan-500 text-white hover:bg-cyan-400">
                      <Check className="mr-2 h-4 w-4" />
                      Add to publishing queue
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Why this admin side works</p>
                    <CardTitle className="font-serif text-3xl">Designed to be easy for editors, producers, and managers.</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Clean dashboard", text: "High-level KPIs stay readable without hiding the day-to-day workflow.", icon: LayoutDashboard },
                      { title: "Fast assignments", text: "Create drafts and handoffs from one form that works on mobile and desktop.", icon: ClipboardList },
                      { title: "Audience focus", text: "Alerts, conversion goals, and content progress are visible together.", icon: Sparkles },
                      { title: "Role clarity", text: "Tasks clearly show owner, urgency, and next steps for every desk.", icon: Users },
                    ].map((item) => (
                      <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
                        <item.icon className="h-10 w-10 rounded-2xl bg-cyan-500/10 p-2 text-cyan-300" />
                        <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                <CardContent className="grid gap-4 p-6 md:grid-cols-3">
                  {[
                    ["07:30", "Morning briefing", "Homepage lead, newsletter openers, push alert alignment"],
                    ["12:00", "Midday live block", "Video verticals, headline refresh, social clips"],
                    ["18:30", "Evening package", "Prime-time explainers, sponsor-safe placements, recap podcast"],
                  ].map(([time, title, description]) => (
                    <div key={time} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
                      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{time}</p>
                      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience">
              <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                <CardContent className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    "Segment readers by topic loyalty and recency.",
                    "Track subscription prompts by article type.",
                    "Route top comments to moderation and community teams.",
                    "Create partnership-safe audience reports in one place.",
                  ].map((item) => (
                    <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300">
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="rounded-[2rem] border-white/10 bg-white/5 text-white">
                <CardContent className="grid gap-4 p-6 lg:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Push alert draft</p>
                    <h3 className="mt-4 text-2xl font-semibold">Breaking: coastal resilience funds hit all-time high</h3>
                    <p className="mt-2 text-sm text-slate-400">Audience-safe wording reviewed by climate desk and homepage editor.</p>
                    <Button className="mt-6 rounded-full bg-cyan-500 text-white hover:bg-cyan-400">Schedule alert</Button>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Alert checklist</p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                      <li>• Confirm headline accuracy and timing.</li>
                      <li>• Link to live coverage or latest explainer.</li>
                      <li>• Apply urgency label for push and social teams.</li>
                      <li>• Save multilingual variations if required.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
