
import React from 'react';
import PageWrapper from './PageWrapper';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

interface PrivacyPolicyProps {
  onNavigate: (page: Page) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
  return (
    <PageWrapper title="Privacy Policy" onNavigate={onNavigate}>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <p className="mt-4">
            Welcome to PlayRaft. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Use of Your Information</h2>
        <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Enable user-to-user communications.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Notify you of updates to the Site.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Disclosure of Your Information</h2>
        <p>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows: by law or to protect rights, if we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Security of Your Information</h2>
        <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
    </PageWrapper>
  );
};

export default PrivacyPolicy;
