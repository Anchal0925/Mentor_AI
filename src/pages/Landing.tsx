import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { HeroSection } from '../components/landing/HeroSection';
import { StickyScrollFeatures } from '../components/landing/StickyScrollFeatures';
import { StatsBar } from '../components/landing/StatsBar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useUser } from '../context/UserContext';

export default function Landing() {
  const navigate  = useNavigate();
  const { login, register, userId, loading, error } = useUser();
  const [scrolled, setScrolled] = useState(false);

  // Modal state
  const [modal, setModal]       = useState<'login' | 'register' | null>(null);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Already logged in — skip straight to dashboard
  useEffect(() => {
    if (userId) navigate('/dashboard');
  }, [userId, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resetForm = () => { setEmail(''); setPassword(''); setFormError(''); };

  const handleLogin = async () => {
    setFormError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e: any) {
      setFormError(e.message);
    }
  };

  const handleRegister = async () => {
    setFormError('');
    try {
      await register(email, password);
      navigate('/onboarding');
    } catch (e: any) {
      setFormError(e.message);
    }
  };

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
            <Link to="/problems"  className="hover:text-primary transition-colors">Practice</Link>
            <Link to="/progress"  className="hover:text-primary transition-colors">Progress</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost-neutral" className="text-sm px-4 py-2 h-9"
              onClick={() => { resetForm(); setModal('login'); }}>
              Log In
            </Button>
            <Button variant="primary" className="text-sm px-4 py-2 h-9"
              onClick={() => { resetForm(); setModal('register'); }}>
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection />
        <StatsBar />
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
            <Button variant="primary" className="text-base px-8 py-3"
              onClick={() => { resetForm(); setModal('register'); }}>
              Create Free Account
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-surface text-center">
        <p className="font-mono text-[12px] text-muted">&copy; 2026 CodeMentor AI — Built for developers.</p>
      </footer>

      {/* ── Login Modal ── */}
      <Modal isOpen={modal === 'login'} onClose={() => setModal(null)} title="Welcome back">
        <div className="flex flex-col gap-4 mt-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {(formError || error) && (
            <p className="font-mono text-xs text-accent-red">{formError || error}</p>
          )}
          <Button variant="primary" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </Button>
          <p className="font-mono text-[11px] text-muted text-center">
            No account?{' '}
            <button className="text-accent-green hover:underline"
              onClick={() => { resetForm(); setModal('register'); }}>
              Create one
            </button>
          </p>
        </div>
      </Modal>

      {/* ── Register Modal ── */}
      <Modal isOpen={modal === 'register'} onClose={() => setModal(null)} title="Create your account">
        <div className="flex flex-col gap-4 mt-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          />
          {(formError || error) && (
            <p className="font-mono text-xs text-accent-red">{formError || error}</p>
          )}
          <Button variant="primary" onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
          <p className="font-mono text-[11px] text-muted text-center">
            Already have an account?{' '}
            <button className="text-accent-green hover:underline"
              onClick={() => { resetForm(); setModal('login'); }}>
              Log in
            </button>
          </p>
        </div>
      </Modal>
    </div>
  );
}
