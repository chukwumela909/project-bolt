import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export function Blog() {
  const posts = [
    {
      title: 'Understanding Staking: A Beginners Guide',
      excerpt: 'Learn the basics of cryptocurrency staking and how you can start earning passive income today.',
      date: '2024-02-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800',
      category: 'Education',
    },
    {
      title: 'The Future of DeFi Staking',
      excerpt: 'Explore the latest trends and innovations in decentralized finance and staking technologies.',
      date: '2024-02-10',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800',
      category: 'Industry',
    },
    {
      title: 'Maximizing Your Staking Returns',
      excerpt: 'Expert tips and strategies to optimize your staking portfolio and increase your yields.',
      date: '2024-02-05',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=800',
      category: 'Strategy',
    },
    {
      title: 'Security Best Practices for Staking',
      excerpt: 'Essential security measures to protect your staked assets and ensure safe earnings.',
      date: '2024-02-01',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1639762681085-2ca0d43d2690?auto=format&fit=crop&w=800',
      category: 'Security',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Latest Updates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-300"
        >
          Stay informed with the latest news, insights, and updates from the world of staking
        </motion.p>
      </div>

      {/* Featured Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8 mb-16"
      >
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <img
            src={posts[0].image}
            alt={posts[0].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-blue-400 font-medium mb-4">{posts[0].category}</span>
          <h2 className="text-3xl font-bold mb-4">{posts[0].title}</h2>
          <p className="text-slate-300 mb-6">{posts[0].excerpt}</p>
          <div className="flex items-center text-sm text-slate-400 mb-8">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(posts[0].date).toLocaleDateString()}</span>
            <Clock className="w-4 h-4 ml-6 mr-2" />
            <span>{posts[0].readTime}</span>
          </div>
          <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <span className="mr-2">Read More</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Post Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(1).map((post, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <span className="text-blue-400 text-sm font-medium">{post.category}</span>
              <h3 className="text-xl font-bold mt-2 mb-4">{post.title}</h3>
              <p className="text-slate-300 mb-6">{post.excerpt}</p>
              <div className="flex items-center text-sm text-slate-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <Clock className="w-4 h-4 ml-6 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}