import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Globe, Award, Wallet, TrendingUp, Lock, RefreshCw } from 'lucide-react';

export function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          About Starkord
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-300"
        >
          Building the future of decentralized finance through innovative staking solutions
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="text-slate-300">
            Our mission is to democratize the staking process, enabling users of all levels to benefit 
            from the decentralized finance ecosystem. Starkord simplifies the complexities of crypto 
            staking while ensuring maximum safety and rewarding growth.
          </p>
          <p className="text-slate-300">
            We believe in the power of decentralized finance to create a more inclusive and efficient 
            financial system. Through our platform, we are enabling users worldwide to participate in 
            the future of finance.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { icon: Shield, label: 'Security First' },
            { icon: Users, label: 'Community Driven' },
            { icon: Globe, label: 'Global Access' },
            { icon: Award, label: 'Excellence' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 flex flex-col items-center text-center"
            >
              <item.icon className="w-12 h-12 text-blue-400 mb-4" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Chen',
              role: 'CEO & Founder',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300',
              description: 'Blockchain pioneer with 10+ years in DeFi'
            },
            {
              name: 'Michael Rodriguez',
              role: 'CTO',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300',
              description: 'Security expert and blockchain architect'
            },
            {
              name: 'Emily Thompson',
              role: 'Head of Security',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300',
              description: 'Cybersecurity specialist and risk manager'
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-blue-400 mb-2">{member.role}</p>
              <p className="text-slate-400">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: Lock,
              title: 'Security',
              description: 'Protecting our users assets is our top priority through robust security measures.'
            },
            {
              icon: RefreshCw,
              title: 'Innovation',
              description: 'Constantly pushing the boundaries of what is possible in DeFi.'
            },
            {
              icon: Users,
              title: 'Community',
              description: 'Building and nurturing a strong, engaged community of stakers.'
            },
            {
              icon: Globe,
              title: 'Transparency',
              description: 'Operating with complete openness and accountability.'
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center"
            >
              <value.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-slate-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { value: '$50M+', label: 'Total Value Locked' },
            { value: '15,000+', label: 'Active Stakers' },
            { value: '99.99%', label: 'Platform Uptime' },
            { value: '24/7', label: 'Support Available' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 text-center"
            >
              <p className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</p>
              <p className="text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Join the Future of Staking</h2>
        <p className="text-slate-400 mb-8">
          Be part of our growing community and start earning passive income today.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          Start Staking Now
        </Link>
      </div>
    </div>
  );
}