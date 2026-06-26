"use client";

import { useState } from "react";
import {
  Pencil,
  Share2,
  Download,
  Zap,
  MousePointer2,
  Layers,
  Users,
  Lock,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Check,
  Play,
} from "lucide-react";
import { Button } from "@repo/ui/button";
import Link from "next/link";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Pencil className="w-6 h-6" />,
      title: "Freehand Drawing",
      description:
        "Draw naturally with pressure-sensitive strokes that feel like pen on paper.",
    },
    {
      icon: <MousePointer2 className="w-6 h-6" />,
      title: "Shape Recognition",
      description:
        "Sketch rough shapes and watch them transform into perfect geometries.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Infinite Canvas",
      description:
        "Zoom out to see the big picture or zoom in for fine details. No limits.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description:
        "Work together with your team in real-time. See cursors, comments, and changes live.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description:
        "Your diagrams are encrypted. Only you and those you share with can see them.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Anywhere",
      description:
        "Export to PNG, SVG, PDF, or share a live link that updates in real-time.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                SketchFlow
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
              >
                Pricing
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/signin">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-neutral-500 rounded-full p-4 text-neutral-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link href={"/signup"}>
                <Link href="/signup">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-neutral-500 text-neutral-100 rounded-full"
                  >
                    Sign Up
                  </Button>
                </Link>
              </Link>
            </div>

            <Button
              size="lg"
              variant={"secondary"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200/60 p-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="block py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Pricing
            </a>
            <div className="pt-3 space-y-2">
              <div className="hidden md:flex items-center gap-3">
                <Link href="/signin">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-neutral-500 rounded-full p-4 text-neutral-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href={"/signup"}>
                  <Link href="/signup">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-neutral-500 text-neutral-100 rounded-full"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Now with AI-powered shape recognition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6">
              Draw your ideas.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mt-2">
                Bring them to life.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              The fastest way to create beautiful diagrams, wireframes, and
              sketches. Collaborate in real-time, export anywhere, and never
              lose a stroke.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant={"primary"}
                size="sm"
                className="group w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                Start Drawing Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant={"primary"}
                size="sm"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-medium rounded-full border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-teal-600" />
                Watch Demo
              </Button>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              No credit card required. Free forever for personal use.
            </p>
          </div>

          {/* Hero Image/Canvas Preview */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm text-slate-500">
                  Untitled Canvas
                </div>
              </div>
              <div className="aspect-[16/9] bg-[url('https://images.pexels.com/photos/5900451/pexels-photo-5900451.jpeg?auto=compress&cs=tinysrgb&w=1260')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {["Google", "Microsoft", "Figma", "Vercel", "Linear", "Notion"].map(
              (company) => (
                <div
                  key={company}
                  className="text-xl sm:text-2xl font-bold text-slate-400 tracking-tight"
                >
                  {company}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to sketch, share, and collaborate
            </h2>
            <p className="text-lg text-slate-600">
              Powerful features that feel invisible. Focus on your ideas, not
              the tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "bg-white border-teal-200 shadow-lg shadow-teal-500/10"
                    : "bg-white/50 border-slate-200/60 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    activeFeature === index
                      ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple enough for anyone. Powerful enough for everything.
            </h2>
            <p className="text-lg text-slate-400">
              Go from blank canvas to shared diagram in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Start drawing",
                description:
                  "Open SketchFlow and start sketching. No signup required. No templates to choose from. Just a blank canvas waiting for your ideas.",
                icon: <Zap className="w-6 h-6" />,
              },
              {
                step: "02",
                title: "Invite others",
                description:
                  "Share a link and collaborate in real-time. See who is drawing, leave comments, and build together.",
                icon: <Share2 className="w-6 h-6" />,
              },
              {
                step: "03",
                title: "Export or embed",
                description:
                  "Download as PNG, SVG, or PDF. Or embed a live version that stays in sync with your canvas.",
                icon: <Download className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 h-full hover:bg-slate-800/80 transition-colors">
                  <div className="text-5xl font-bold text-slate-700 mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4 text-white">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Free for individuals. Team-friendly pricing.
            </h2>
            <p className="text-lg text-slate-600">
              Start for free. Upgrade when your team grows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
              <div className="text-sm font-medium text-slate-600 mb-2">
                Free
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-600 mb-6">
                Perfect for personal projects and exploration.
              </p>
              <button className="w-full py-3 border border-slate-300 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors">
                Get Started
              </button>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited canvases",
                  "Export to PNG & SVG",
                  "Real-time collaboration (2 users)",
                  "7-day revision history",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 relative hover:shadow-xl hover:shadow-slate-900/20 transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full text-xs font-medium">
                Most Popular
              </div>
              <div className="text-sm font-medium text-slate-400 mb-2">Pro</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-400 mb-6">
                For professionals and small teams.
              </p>
              <button className="w-full py-3 bg-white text-slate-900 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors">
                Start Free Trial
              </button>
              <ul className="mt-6 space-y-3">
                {[
                  "Everything in Free",
                  "Unlimited collaboration",
                  " Unlimited revision history",
                  "Export to PDF",
                  "Priority support",
                  "Custom branding",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Team Plan */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
              <div className="text-sm font-medium text-slate-600 mb-2">
                Team
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-slate-500">/user/month</span>
              </div>
              <p className="text-slate-600 mb-6">
                For growing teams that need control.
              </p>
              <button className="w-full py-3 border border-slate-300 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors">
                Contact Sales
              </button>
              <ul className="mt-6 space-y-3">
                {[
                  "Everything in Pro",
                  "SSO & SAML",
                  "Admin dashboard",
                  "Team libraries",
                  "Audit logs",
                  "Dedicated support",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to bring your ideas to life?
          </h2>
          <p className="text-lg sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Join thousands of designers, engineers, and product teams who sketch
            faster with SketchFlow.
          </p>
          <Button
            variant={"outline"}
            size="lg"
            className="group px-8 py-4 bg-white text-teal-700 font-medium rounded-full hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            Start Drawing Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SketchFlow</span>
              </div>
              <p className="text-sm leading-relaxed">
                The fastest way to turn your ideas into beautiful diagrams.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 SketchFlow. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.29 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
