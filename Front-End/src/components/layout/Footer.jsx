import { Link } from 'react-router-dom';
import { Brain, Github, Heart, Users, Sparkles, BookOpen, Trophy, Code2, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur-xl text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                RankQuest
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Open-source algorithmic challenge and ranking platform designed for competitive programmers and tech interview preparation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com/Lokesh-Squazzo/Rank-Quest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <Link 
                to="/about"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Users className="w-3.5 h-3.5" /> Meet Builders
              </Link>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sheets" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> DSA Sheets
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Global Rankings
                </Link>
              </li>
              <li>
                <Link to="/playground" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Code Playground
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Learning Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Developers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">Community & Builders</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-foreground hover:text-primary font-medium transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" /> About Us & Contributors
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/Lokesh-Squazzo/Rank-Quest" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Lokesh-Squazzo/Rank-Quest/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Open Issues <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Project Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About Project</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              RankQuest is licensed under MIT. Built with Spring Boot 3 & React. Contributions and stars are warmly appreciated!
            </p>
            <div className="pt-2">
              <a 
                href="https://github.com/Lokesh-Squazzo/Rank-Quest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-primary" /> Star on GitHub
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} RankQuest. Open Source Platform.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>by</span>
            <Link to="/about" className="text-primary hover:underline font-semibold ml-1">
              Lokesh & RankQuest Contributors
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
