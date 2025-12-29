
import React from 'react';
import PageWrapper from './PageWrapper';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

interface TermsOfServiceProps {
  onNavigate: (page: Page) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
  return (
    <PageWrapper title="Terms of Service" onNavigate={onNavigate}>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <p className="mt-4">
            Please read these Terms of Service carefully before using the PlayRaft website operated by us.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Agreement to Terms</h2>
        <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Intellectual Property</h2>
        <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of PlayRaft and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PlayRaft.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. User Conduct</h2>
        <p>
            You agree not to use the Service to:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
            <li>Violate any local, state, national, or international law.</li>
            <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
            <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.</li>
            <li>Submit false or misleading information.</li>
            <li>Upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Termination</h2>
        <p>
            We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Changes to Terms</h2>
        <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
    </PageWrapper>
  );
};

export default TermsOfService;
