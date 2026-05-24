import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

const Plan = () => {
  const plans = [
    {
      name: 'Starter',
      price: '0',
      description: 'Perfect for exploring neural system design.',
      features: [
        '10 free system generations / mo',
        'Standard response speed',
        'Basic AI template suite',
        'Community forum access'
      ],
      buttonText: 'Get Started Free',
      gradient: 'from-cyan-500 to-blue-500',
      glowColor: 'shadow-cyan-500/10 border-cyan-500/10 hover:border-cyan-500/30'
    },
    {
      name: 'Professional',
      price: '19',
      description: 'For power developers needing robust automation.',
      features: [
        '500 system generations / mo',
        'Accelerated neural queue',
        'Advanced AI tools access',
        'Standard resume parsing',
        'Email & chat support'
      ],
      buttonText: 'Upgrade to Pro',
      gradient: 'from-blue-600 to-purple-600',
      glowColor: 'shadow-blue-500/10 border-blue-500/10 hover:border-blue-500/30'
    },
    {
      name: 'Executive Premium',
      price: '49',
      description: 'Unlimited neural power for elite builders.',
      features: [
        'Unlimited system generations',
        'Priority neural queue & instant execution',
        'Advanced ATS reviewer + live prompts',
        'DALL-E 3 visual synthesis suite',
        'Dedicated 24/7 technical lead support',
        'Full API developer access'
      ],
      buttonText: 'Subscribe to Premium',
      popular: true,
      gradient: 'from-purple-600 via-pink-500 to-cyan-400',
      glowColor: 'shadow-purple-500/20 border-purple-500/25 hover:border-purple-500/50 hover:shadow-purple-500/30'
    }
  ];

  const handleCheckout = (planName) => {
    toast.loading(`Redirecting to secure premium portal for the ${planName} plan...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Successfully registered interest in ${planName}! Live gateway coming soon.`);
    }, 1500);
  };

  return (
    <section className="relative w-full py-24 bg-[#03001e] bg-gradient-to-b from-[#03001e] via-[#0b0b1a] to-[#020204] overflow-hidden text-gray-300 font-outfit">
      
      {/* 🌌 Cyber Grid & Blur Backdrop Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f1d_1px,transparent_1px),linear-gradient(to_bottom,#0f0f1d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none -z-10"></div>
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-950/20 text-purple-400 text-xs font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Plans
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] leading-tight"
          >
            Empower Your Codeflow. <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
              Choose the Perfect Fit.
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 font-light max-w-xl mx-auto"
          >
            Start building for free, and unlock cutting-edge generative neural tools and real-time executive ATS optimization as you scale.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative flex flex-col"
            >
              {/* Subtle pulsing background glow on premium hover */}
              {plan.popular && (
                <div className="absolute inset-0 -m-[1px] bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-2xl blur-sm opacity-30 pointer-events-none"></div>
              )}

              {/* Card Container */}
              <div className={`flex flex-col h-full rounded-2xl border bg-neutral-950/40 backdrop-blur-md p-8 relative overflow-hidden transition-all duration-300 shadow-xl ${plan.glowColor}`}>
                
                {/* Neon Top Gradient Line */}
                <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${plan.gradient}`}></div>

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">
                    <Zap className="w-3 h-3 text-white fill-white" />
                    Most Popular
                  </div>
                )}

                {/* Card Title & Cost */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    {plan.popular ? <Cpu className="w-5 h-5 text-purple-400" /> : null}
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{plan.description}</p>
                  
                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">$</span>
                    <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">{plan.price}</span>
                    <span className="text-sm font-light text-slate-500">/ month</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-white/5 my-4"></div>

                {/* Features List */}
                <ul className="space-y-3.5 flex-1 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-light">
                      <div className={`p-0.5 rounded-full bg-gradient-to-tr ${plan.gradient} mt-0.5`}>
                        <div className="rounded-full bg-neutral-950 p-[1px]">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Checkout Button */}
                <button
                  onClick={() => handleCheckout(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-300 text-center shadow-lg cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 hover:from-purple-700 hover:via-pink-600 hover:to-cyan-600 text-white shadow-purple-500/20 hover:scale-[1.02]'
                      : 'border border-white/10 hover:border-white/20 text-white bg-white/5 hover:bg-white/10 hover:scale-[1.01]'
                  }`}
                >
                  {plan.buttonText}
                </button>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Plan;

