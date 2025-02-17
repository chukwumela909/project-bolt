import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  Shield, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Globe,
  Zap,
  Clock,
  Mail,
  Send,
  DollarSign,
  Percent,
  BarChart3
} from 'lucide-react';

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 pointer-events-none" />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unlock Passive Crypto Earnings with Starkord Staking Pool
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8">
                Staking made easy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center group"
              >
                <span>Start Staking Now</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features Of Starkord Pool</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience the future of staking with our innovative platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Wallet,
              title: 'Easy Participation',
              description: 'Stake ETH and earn daily rewards, without the need for active management.',
            },
            {
              icon: BarChart3,
              title: 'Automated Staking',
              description: 'Starkord manages staking across diversified crypto protocols.',
            },
            {
              icon: Clock,
              title: 'Fixed-Term Yield',
              description: 'Daily rewards distributed for 180 days based on your stake.',
            },
            {
              icon: Shield,
              title: 'Security & Risk Management',
              description: 'Robust strategies to minimize risk with comprehensive protection.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-colors"
            >
              <feature.icon className="w-12 h-12 mb-6 text-blue-400" />
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-24 bg-slate-900/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Start earning passive income in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Stake Your Contribution',
              description: 'Choose your staking goal and contribute ETH into the Starkord Staking Pool.',
              icon: Wallet
            },
            {
              step: '02',
              title: 'Let Us Validate',
              description: 'We validate your funds across a diversified portfolio of high-yield crypto assets.',
              icon: Shield
            },
            {
              step: '03',
              title: 'Receive Daily Rewards',
              description: "Watch your rewards accumulate daily based on your stake yield percentage.",
              icon: DollarSign
            },
            {
              step: '04',
              title: 'Restake Rewards',
              description: 'Enhance your earnings by restaking your rewards for compound growth.',
              icon: TrendingUp
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-2xl">
                {item.step}
              </div>
              <item.icon className="w-12 h-12 mb-6 text-blue-400" />
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Staking Goals */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Staking Path</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We offer 4 unique staking goals, each designed to align with a unique risk and reward profile
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: 'Core Vault',
              minStake: 0.05,
              yield: 1.5,
              description: 'Entry-level users seeking stable, low-risk passive rewards with an easy-to-understand approach.',
              color: 'from-blue-500 to-blue-600'
            },
            {
              name: 'Growth Nexus',
              minStake: 2,
              yield: 2.5,
              description: 'Visionaries looking for balanced growth, with moderate risk and optimized reward generation.',
              color: 'from-purple-500 to-purple-600'
            },
            {
              name: 'Elite Matrix',
              minStake: 10,
              yield: 3.5,
              description: 'Experienced stakers aiming for significant returns with a higher, but manageable, risk profile.',
              color: 'from-emerald-500 to-emerald-600'
            },
            {
              name: 'Legacy Protocol',
              minStake: 20,
              yield: 5,
              description: 'Strategic participants with larger contributions, seeking maximum returns through cutting-edge staking models.',
              color: 'from-amber-500 to-amber-600'
            }
          ].map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-b ${plan.color} rounded-xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
              
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Min Stake</span>
                  <span className="font-bold">{plan.minStake} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Daily Yield</span>
                  <span className="font-bold">{plan.yield}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Duration</span>
                  <span className="font-bold">180 days</span>
                </div>
              </div>
              
              <p className="text-sm text-white/80 mb-6">{plan.description}</p>
              
              <Link
                to="/login"
                className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-lg font-medium text-center transition-colors"
              >
                Start Staking
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-24 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
            <p className="text-slate-400">
              Starkord is a leading platform offering innovative crypto staking solutions designed for users looking to earn passive income from their ETH.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-400">
                Our mission is to democratize the staking process, enabling users of all levels to benefit from the decentralized finance ecosystem. Starkord simplifies the complexities of crypto staking while ensuring maximum safety and rewarding growth.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-bold mb-4">Our Team</h3>
              <p className="text-slate-400">
                At Starkord, decentralization is at the heart of everything we do. Our globally distributed team ensures we're always available to serve you. From DevOps engineers and research specialists to community managers and blockchain experts, we work collaboratively to drive the growth of Web3. Together, we're building a decentralized future where everyone can benefit and thrive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-slate-400 mb-8">
            Have questions or need assistance? Our support team is here to help!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="mailto:support@starkord.com"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>support@starkord.com</span>
            </a>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Send className="w-6 h-6" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-slate-400">
            <p className="mb-4">© 2025 Starkord. All rights reserved.</p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}