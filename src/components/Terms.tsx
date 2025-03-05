import { motion } from 'framer-motion';


export function Terms() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Terms of Service
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-300"
                >
                    Last Updated: 05/03/2025
                </motion.p>
            </div>
    
            {/* Main Content */}
            <div className="space-y-6 text-slate-300">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h2 className="text-3xl font-bold mb-4">Welcome to Starkord!</h2>
                    <p>By using our services, you agree to comply with the following Terms of Service (“Terms”), which govern your use of the Starkord Staking Platform (“Starkord,” “we,” “us,” or “our”). Please read these Terms carefully before using our website or services.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h3>
                    <p>By accessing or using Starkord’s platform, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">2. Services Provided</h3>
                    <p>Starkord offers a platform for users to participate in crypto staking via pooled staking opportunities using ETH. We will manage your assets on your behalf, staking them in various high-yield crypto assets and protocols to generate daily rewards.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">3. Eligibility</h3>
                    <p>To use Starkord’s services, you must:</p>
                    <ul className="list-disc list-inside">
                        <li>Be at least 18 years of age.</li>
                        <li>Have full legal capacity to enter into contracts in your jurisdiction.</li>
                        <li>Agree that you are not engaging in illegal activities or using the platform in a way that violates any laws or regulations in your country.</li>
                    </ul>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">4. Staking Opportunities</h3>
                    <p>Starkord provides several staking opportunities, each with varying contribution levels and projected yields. By depositing ETH into any of these opportunities, you agree to the specific terms of the selected opportunity, including the minimum contribution, duration, and daily yield.</p>
                    <ul className="list-disc list-inside">
                        <li>Core Vault: 1.5% daily for 180 days.</li>
                        <li>Growth Nexus: 2.5% daily for 180 days.</li>
                        <li>Elite Matrix: 3.5% daily for 180 days.</li>
                        <li>Legacy Protocol: 5% daily for 180 days.</li>
                    </ul>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">5. Staking Process</h3>
                    <ul className="list-disc list-inside">
                        <li>Stake: You can deposit ETH into the Starkord staking pool. Once you deposit, we will stake your funds across diversified assets.</li>
                        <li>Rewards: Your rewards will be calculated daily and distributed to you in accordance with your share of the pool.</li>
                        <li>Unstake: At the end of the staking term (180 days), you can unstake your original contribution plus any rewards earned. Early withdrawals may incur penalties or reduced rewards, as specified in the respective staking opportunities.</li>
                    </ul>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">6. Risk Management and Disclaimers</h3>
                    <p>Cryptocurrency staking involves inherent risks, including but not limited to:</p>
                    <ul className="list-disc list-inside">
                        <li>Market Volatility: Crypto asset prices are volatile and may fluctuate dramatically.</li>
                        <li>Staking Risks: Protocols used for staking may encounter bugs or vulnerabilities.</li>
                        <li>Regulatory Risk: The regulatory environment for cryptocurrencies is uncertain and subject to change.</li>
                    </ul>
                    <p>By using our services, you acknowledge that you understand these risks and agree that Starkord will not be held liable for any losses or damages incurred due to market fluctuations, staking risks, or other unforeseen circumstances.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">7. Fees</h3>
                    <p>Starkord charges a management fee for its staking services, which may be a percentage of the rewards generated. The fee will be disclosed clearly on the platform, and the net profits will be distributed to the Stakers.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">8. Account Security</h3>
                    <p>You are responsible for maintaining the confidentiality of your account information, including your login credentials. Starkord is not liable for any unauthorized access or use of your account resulting from your failure to protect your credentials.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">9. Termination of Service</h3>
                    <p>Starkord reserves the right to terminate or suspend your access to the platform if:</p>
                    <ul className="list-disc list-inside">
                        <li>You violate any of these Terms.</li>
                        <li>We suspect fraudulent or illegal activities.</li>
                        <li>We are required to do so by law or regulatory authorities.</li>
                    </ul>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">10. Governing Law</h3>
                    <p>These Terms will be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of laws principles.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">11. Limitation of Liability</h3>
                    <p>To the fullest extent permitted by law, Starkord will not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the platform or services, including, but not limited to, loss of data, profits, or assets.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">12. Changes to the Terms</h3>
                    <p>Starkord reserves the right to modify these Terms at any time. Any changes will be communicated to users via email or notifications within the platform. By continuing to use the platform after changes are made, you agree to the updated Terms.</p>
                </div>
    
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                    <h3 className="text-2xl font-bold mb-4">13. Contact Information</h3>
                    <p>If you have any questions or concerns regarding these Terms, please contact us at:</p>
                    <ul className="list-disc list-inside">
                        <li>Email: support@starkord.com</li>
                    </ul>
                </div>
            </div>
        </div>
    );
    }