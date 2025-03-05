import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { Shield, Users, Globe, Award, Lock, RefreshCw } from 'lucide-react';

export function PrivacyPolicy() {
return (
    <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-6"
            >
                Privacy Policy
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
                <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                <p>At Starkord, we are committed to protecting your privacy and personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our platform and services.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">1. Information We Collect</h3>
                <p>We collect the following types of personal information when you use our services:</p>
                <ul className="list-disc list-inside">
                    <li>Personal Identification Information: Name, email address, phone number.</li>
                    <li>Account Information: Account login credentials, transaction history, wallet addresses.</li>
                    <li>Usage Data: Information on how you interact with our website, including IP addresses, browser type, and pages visited.</li>
                </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">2. How We Use Your Information</h3>
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-disc list-inside">
                    <li>To Provide Services: To manage your staking account, process your deposits, and calculate rewards.</li>
                    <li>To Improve Our Services: To enhance user experience, analyze trends, and improve platform features.</li>
                    <li>To Communicate with You: To send you updates, notifications, and promotional material (if you’ve opted in).</li>
                    <li>Compliance: To comply with legal and regulatory requirements.</li>
                </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">3. Data Sharing and Disclosure</h3>
                <p>We do not sell or rent your personal information to third parties. However, we may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside">
                    <li>With Service Providers: To facilitate our services, such as payment processing or technical support.</li>
                    <li>For Legal Reasons: If required by law, regulation, or legal process, we may disclose your personal information.</li>
                    <li>Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
                </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">4. Data Security</h3>
                <p>We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of data transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h3>
                <p>We use cookies and similar tracking technologies to enhance user experience and analyze site traffic. You can control the use of cookies through your browser settings, though some features of the platform may not function properly if cookies are disabled.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">6. Your Rights</h3>
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside">
                    <li>Access: You may request access to the information we hold about you.</li>
                    <li>Correction: You may request corrections to your personal information.</li>
                    <li>Deletion: You may request that we delete your account and personal data, subject to legal obligations.</li>
                </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">7. International Data Transfers</h3>
                <p>Starkord operates globally, and your information may be transferred to, stored, or processed in countries outside your own, which may have different data protection laws.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">8. Children’s Privacy</h3>
                <p>Starkord does not knowingly collect personal information from anyone under the age of 18. If we discover that we have inadvertently collected personal data from a child under 18, we will take steps to delete the information as soon as possible.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">9. Changes to This Privacy Policy</h3>
                <p>Starkord reserves the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page, with the updated date at the top. Continued use of our services after such changes constitutes your acceptance of the updated policy.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-4">10. Contact Us</h3>
                <p>If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:</p>
                <ul className="list-disc list-inside">
                    <li>Email: privacy@starkord.com</li>
                </ul>
            </div>
        </div>
    </div>
);
}