import { useState, useEffect } from 'react';
import { 
  Users, GitCommit, Github, Heart, Sparkles, ExternalLink, 
  GitPullRequest, Star, Award, Code2, Server, Database, 
  ArrowRight, ShieldCheck, Flame, Terminal
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// Fallback data in case of GitHub rate limiting (60 req/hr unauthenticated)
const FALLBACK_CONTRIBUTORS = [
  {
    login: 'Lokesh-Squazzo',
    id: 173788135,
    avatar_url: 'https://avatars.githubusercontent.com/u/173788135?v=4',
    html_url: 'https://github.com/Lokesh-Squazzo',
    contributions: 42,
    role: 'Lead Creator & Full-Stack Architect',
    bio: 'Architected RankQuest end-to-end. Designed the Spring Boot backend, interactive code runner, DSA sheet hierarchy, and rank engines.',
    tags: ['Founder', 'Spring Boot', 'React', 'Architecture']
  },
  {
    login: 'Jayesh2160',
    id: 176201682,
    avatar_url: 'https://avatars.githubusercontent.com/u/176201682?v=4',
    html_url: 'https://github.com/Jayesh2160',
    contributions: 1,
    role: 'Open Source Contributor',
    bio: 'Identified platform enhancements and actively helped improve user profile settings and authentication flows.',
    tags: ['Contributor', 'UI/UX', 'Testing']
  }
];

const TECH_STACK = [
  { name: 'Java 21 & Spring Boot 3', icon: Server, desc: 'Robust RESTful microservices, Spring Security JWT, and HikariCP pool' },
  { name: 'React 18 & Vite', icon: Code2, desc: 'Ultra-fast client bundle, reactive context state, and smooth UI routing' },
  { name: 'Tailwind CSS', icon: Sparkles, desc: 'Custom glassmorphic aesthetic, dark-mode first design tokens' },
  { name: 'PostgreSQL & Hibernate', icon: Database, desc: 'Relational schema for problems, users, rankings, and submissions' },
  { name: 'Judge0 Engine', icon: Terminal, desc: 'Multi-language sandboxed code compilation with test case validation' },
  { name: 'Docker & Microservices', icon: ShieldCheck, desc: 'Containerized deployment ready for high concurrency scaling' }
];

const About = () => {
  const [contributors, setContributors] = useState(FALLBACK_CONTRIBUTORS);
  const [loading, setLoading] = useState(true);
  const [totalCommits, setTotalCommits] = useState(43);

  useEffect(() => {
    const fetchGitHubContributors = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/Lokesh-Squazzo/Rank-Quest/contributors');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Merge with local metadata (roles, bios, tags)
            const enriched = data.map(ghUser => {
              const fallbackMatch = FALLBACK_CONTRIBUTORS.find(
                f => f.login.toLowerCase() === ghUser.login.toLowerCase()
              );
              return {
                ...ghUser,
                role: fallbackMatch?.role || 'Open Source Contributor',
                bio: fallbackMatch?.bio || `Active contributor to RankQuest codebase with ${ghUser.contributions} merged contribution${ghUser.contributions > 1 ? 's' : ''}.`,
                tags: fallbackMatch?.tags || ['Contributor', 'Open Source']
              };
            });

            setContributors(enriched);
            const total = enriched.reduce((acc, c) => acc + (c.contributions || 0), 0);
            setTotalCommits(total);
          }
        }
      } catch (err) {
        console.warn('Could not fetch real-time contributors, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubContributors();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/10">
        {/* Aurora Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Heart className="w-3.5 h-3.5 fill-primary" /> The Minds Behind The Platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            Meet the Developers & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
              Open Source Contributors
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            RankQuest is built by engineers passionate about democratizing competitive programming and Data Structures & Algorithms. Discover the creators who power every line of code.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-foreground">{contributors.length}</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Core Contributors</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-primary">{totalCommits}+</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Total Contributions</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-purple-400">100%</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">Open Source</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-emerald-400">30+</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">DSA Problems</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTRIBUTORS GRID */}
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" /> Platform Creators
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Active Contributors</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Live contributions dynamically tracked from our GitHub repository.
            </p>
          </div>

          <a 
            href="https://github.com/Lokesh-Squazzo/Rank-Quest" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="border-white/15 hover:bg-white/10 gap-2">
              <Github className="w-4 h-4" /> View On GitHub <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contributors.map((contributor, idx) => {
            const isLead = idx === 0 || contributor.login === 'Lokesh-Squazzo';

            return (
              <Card 
                key={contributor.id || contributor.login} 
                className={`glass-dark border border-white/10 overflow-hidden relative group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 ${
                  isLead ? 'ring-1 ring-primary/30' : ''
                }`}
              >
                {/* Accent glow on top edge */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  isLead ? 'bg-gradient-to-r from-primary to-purple-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`} />

                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {/* Avatar with gradient border */}
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl p-[2px] shadow-xl ${
                          isLead 
                            ? 'bg-gradient-to-tr from-primary via-purple-500 to-pink-500' 
                            : 'bg-gradient-to-tr from-blue-500 to-emerald-400'
                        }`}>
                          <img 
                            src={contributor.avatar_url} 
                            alt={contributor.login} 
                            className="w-full h-full object-cover rounded-2xl bg-black"
                          />
                        </div>
                        {isLead && (
                          <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-lg shadow-lg border-2 border-background">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {contributor.login}
                          </h3>
                        </div>
                        <p className="text-xs text-primary font-medium mt-0.5">{contributor.role}</p>
                        <div className="text-xs text-muted-foreground font-mono mt-1">@{contributor.login}</div>
                      </div>
                    </div>

                    {/* Contributions Count Badge */}
                    <div className="flex flex-col items-end">
                      <Badge className={`px-3 py-1 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${
                        isLead 
                          ? 'bg-primary/20 text-primary border-primary/40' 
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>{contributor.contributions} {contributor.contributions === 1 ? 'Commit' : 'Commits'}</span>
                      </Badge>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Verified on GitHub</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {contributor.bio}
                  </p>

                  {/* Skills/Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {contributor.tags?.map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Profile Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <a 
                      href={contributor.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1.5 transition-colors group-hover:underline"
                    >
                      <Github className="w-4 h-4" /> View GitHub Profile <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <span className="text-xs text-muted-foreground font-mono">
                      RankQuest Contributor
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* TECH STACK & ARCHITECTURE */}
      <section className="max-w-6xl mx-auto px-4 pt-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
            Engineering & Stack
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">How RankQuest Is Built</h2>
          <p className="text-muted-foreground text-sm">
            A production-ready stack designed for performance, high throughput, and developer joy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_STACK.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-base mb-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION: WANT TO CONTRIBUTE? */}
      <section className="max-w-6xl mx-auto px-4 pt-24">
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 border border-white/15 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <Badge className="bg-primary/20 text-primary border-primary/40 text-xs">
              <GitPullRequest className="w-3.5 h-3.5 mr-1" /> Open Source Community
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Want to become a Contributor?
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              We welcome contributions of all kinds! Whether you want to add new DSA sheets, optimize backend endpoints, fix issues, or enhance the solver interface, we'd love to review your Pull Request.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="https://github.com/Lokesh-Squazzo/Rank-Quest" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="h-11 px-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 gap-2">
                  <Github className="w-4 h-4" /> Fork & Contribute
                </Button>
              </a>

              <a 
                href="https://github.com/Lokesh-Squazzo/Rank-Quest/issues" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="h-11 px-6 border-white/20 hover:bg-white/10 rounded-xl font-medium gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Explore Issues
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
