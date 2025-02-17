import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: 'What is staking?',
      answer: 'Staking is a way to earn rewards for holding cryptocurrency. When you stake your assets, you are essentially locking them up to help support the network operations and security. In return, you earn rewards in the form of additional tokens.',
    },
    {
      question: 'How do I start staking?',
      answer: 'Starting is simple: Create an account, verify your identity, deposit your assets, and choose a staking plan that suits your goals. Our platform guides you through each step to ensure a smooth experience.',
    },
    {
      question: 'What are the minimum and maximum staking amounts?',
      answer: 'Our minimum staking amount varies by plan, starting from as low as 0.05 ETH. There is no maximum limit, allowing you to stake as much as you would like.',
    },
    {
      question: 'How are rewards calculated and distributed?',
      answer: 'Rewards are calculated daily based on your staking amount and the APY of your chosen plan. They are automatically added to your account and can be tracked in real-time through your dashboard.',
    },
    {
      question: 'Is staking safe?',
      answer: 'We prioritize security above all else. Your assets are protected by industry-leading security measures, including multi-signature wallets, cold storage, and comprehensive insurance coverage.',
    },
    {
      question: 'Can I unstake my assets early?',
      answer: 'Yes, you can unstake early, but this may incur a small penalty fee. We recommend completing the full staking period to maximize your returns.',
    },
    {
      question: 'What happens if I lose access to my account?',
      answer: 'We have a secure account recovery process in place. Contact our support team, and they will guide you through the verification steps to regain access to your account.',
    },
    {
      question: 'Are there any fees?',
      answer: 'Our fee structure is transparent with no hidden charges. The only fees are a small performance fee on earned rewards and any applicable network fees.',
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
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-300"
        >
          Find answers to common questions about staking on Starkord
        </motion.p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto mb-16">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="mb-4"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors"
            >
              <span className="text-lg font-medium text-left">{faq.question}</span>
              {openIndex === index ? (
                <Minus className="w-5 h-5 text-blue-400 flex-shrink-0" />
              ) : (
                <Plus className="w-5 h-5 text-blue-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 bg-slate-800/30 rounded-b-xl border-x border-b border-slate-700/50"
              >
                <p className="text-slate-300">{faq.answer}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-slate-400 mb-8">
          Cannot find the answer you are looking for? Our support team is here to help.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}