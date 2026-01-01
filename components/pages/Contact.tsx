
import React, { useState } from 'react';
import PageWrapper from './PageWrapper';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

interface ContactProps {
  onNavigate: (page: Page) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send the data to a server
  };

  return (
    <PageWrapper title="Contact Us" onNavigate={onNavigate}>
      {submitted ? (
        <div className="text-center p-8 bg-brand-dark/50 rounded-lg">
          <h2 className="text-2xl font-bold text-brand-accent mb-4">Thank You!</h2>
          <p className="text-brand-text-primary">Your message has been sent. We'll get back to you as soon as possible.</p>
        </div>
      ) : (
        <>
          <p className="mb-6">
            Have a question, suggestion, or just want to say hello? Drop us a line using the form below, or email us directly at <a href="mailto:ssh32095@gmail.com" className="text-brand-accent hover:underline">ssh32095@gmail.com</a>. We'll get back to you!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-4 pr-4 py-3 bg-brand-card border border-brand-blue text-brand-text-primary placeholder:text-brand-text-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-2">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-4 pr-4 py-3 bg-brand-card border border-brand-blue text-brand-text-primary placeholder:text-brand-text-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-text-secondary mb-2">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full pl-4 pr-4 py-3 bg-brand-card border border-brand-blue text-brand-text-primary placeholder:text-brand-text-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-cyan-400 transition-transform transform hover:scale-105 duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-75"
              >
                Send Message
              </button>
            </div>
          </form>
        </>
      )}
    </PageWrapper>
  );
};

export default Contact;