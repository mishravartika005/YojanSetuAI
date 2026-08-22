import { ArrowRight, BadgeCheck, BriefcaseBusiness, CheckCircle2, Landmark, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const steps = [
  { title: 'Share your profile', description: 'Citizens can provide personal and household information in a simple profile form.' },
  { title: 'Review fit', description: 'The future eligibility engine will compare your profile with scheme criteria.' },
  { title: 'Discover options', description: 'Relevant schemes and guidance will be surfaced in one trusted place.' },
];

const features = [
  { icon: Search, title: 'Scheme discovery', description: 'Explore eligible welfare and support programs in a clear, citizen-friendly workflow.' },
  { icon: BadgeCheck, title: 'Eligibility guidance', description: 'Understand the upcoming fit-check process before you start an application journey.' },
  { icon: BriefcaseBusiness, title: 'Profile-driven journey', description: 'Build a complete and accessible citizen profile for future recommendations.' },
  { icon: ShieldCheck, title: 'Trust & clarity', description: 'Keep the experience professional, transparent, and easy for citizens to use.' },
];

export default function Landing() {
  return (
    <div className="page-shell pb-10">
      <section className="max-w-4xl mx-auto rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-10 lg:px-14 lg:py-14 text-center flex flex-col items-center">
        <div className="flex flex-col justify-center items-center">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#eafaf2] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">
            <Sparkles className="h-3.5 w-3.5" />
            Future-ready citizen support
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find Government Schemes You May Be Eligible For
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            YojanSetu AI helps citizens understand their profile, explore relevant public assistance opportunities, and move toward the right next step with clarity and confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/schemes">
              <Button size="lg" className="gap-2">
                Find Schemes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">Learn More</Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600 justify-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1b8f5a]" />
              Citizen-friendly experience
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1b8f5a]" />
              Secure profile flow
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mt-16 scroll-mt-24">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">How it works</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">A simple pathway to support</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="card-surface rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b3b72] text-base font-bold text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">Why citizens use it</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Built for clarity, trust, and discovery</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card-surface rounded-2xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eafaf2] text-[#1b8f5a]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[28px] border border-slate-200 bg-[#0b3b72] p-8 text-white md:p-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">Trust & information</p>
            <h2 className="mt-3 text-3xl font-bold">A government-service inspired experience for everyday citizens</h2>
          </div>
          <Link to="/register">
            <Button variant="secondary" className="border-white/50 bg-white text-[#0b3b72] hover:bg-slate-100">
              Get started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}