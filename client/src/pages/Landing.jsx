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
      <section className="grid gap-10 rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#eafaf2] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1b8f5a]">
            <Sparkles className="h-3.5 w-3.5" />
            Future-ready citizen support
          </span>
          <h1 className="max-w-xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find Government Schemes You May Be Eligible For
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            YojanSetu AI helps citizens understand their profile, explore relevant public assistance opportunities, and move toward the right next step with clarity and confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
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

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Citizen profile</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Ready to explore</h2>
              </div>
              <div className="rounded-full bg-[#eafaf2] p-3 text-[#1b8f5a]">
                <Landmark className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ['Name', 'Aarav Sharma'],
                ['Location', 'Bengaluru, Karnataka'],
                ['Occupation', 'Private employee'],
                ['Annual income', '₹5,00,000'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#0b3b72] p-4 text-white">
              <p className="text-xs uppercase tracking-[0.14em] text-sky-100">Future guidance</p>
              <p className="mt-1 text-lg font-semibold">A verified scheme dashboard will be generated from a citizen profile.</p>
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