import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { HeroSection } from '../components/landing/HeroSection';
import { StickyScrollFeatures } from '../components/landing/StickyScrollFeatures';
import { StatsBar } from '../components/landing/StatsBar';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-primary text-primary selection:bg-accent-green/30">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 h-[60px] z-50 transition-all duration-300 ${
        scrolled ? 'bg-primary/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-semibold text-lg text-primary">CodeMentor</span>
            <span className="font-display font-semibold text-lg text-accent-green">AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-secondary">
            <Link to="/problems" className="hover:text-primary transition-colors">Practice</Link>
            <Link to="/progress" className="hover:text-primary transition-colors">Progress</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost-neutral" className="text-sm px-4 py-2 h-9">Log In</Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="primary" className="text-sm px-4 py-2 h-9">Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero + Animated Mockup */}
        <HeroSection />

        {/* Stats Bar */}
        <StatsBar />

        {/* Sticky scroll features (alternating layout) */}
        <StickyScrollFeatures />

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto bg-elevated border border-border rounded-2xl p-12 text-center">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary mb-4">
              Ready to code smarter?
            </h2>
            <p className="text-secondary mb-8 leading-relaxed">
              Join 10,000+ developers who've built their AI second brain.
            </p>
            <Link to="/onboarding">
              <Button variant="primary" className="text-base px-8 py-3">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-surface text-center">
        <p className="font-mono text-[12px] text-muted">&copy; 2026 CodeMentor AI — Built for developers.</p>
      </footer>
    </div>
  );
}
