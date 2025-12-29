
import React from 'react';
import PageWrapper from './PageWrapper';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

interface AboutUsProps {
  onNavigate: (page: Page) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  return (
    <PageWrapper title="About Us" onNavigate={onNavigate}>
      <p>
        Welcome to PlayRaft, your ultimate destination for free online games! We are a passionate team of developers and gamers dedicated to creating a fun, accessible, and high-quality gaming experience for everyone.
      </p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h2>
      <p>
        Our mission is simple: to provide an endless universe of entertainment right at your fingertips. We believe that gaming should be a universal joy, free from barriers and accessible on any device. We carefully curate a vast collection of games across all genres, from action-packed adventures and mind-bending puzzles to high-speed racing and strategic masterpieces.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Why PlayRaft?</h2>
      <p>
        At PlayRaft, we prioritize user experience above all else. Our platform is designed to be intuitive, fast, and visually stunning. With our unique mosaic layout, discovering new games is an adventure in itself. We are constantly updating our library with the latest and greatest titles to ensure there's always something new and exciting to play.
      </p>
       <p className="mt-4">
        Thank you for being a part of our community. Now, go on and explore the raft—your next favorite game awaits!
      </p>
    </PageWrapper>
  );
};

export default AboutUs;
