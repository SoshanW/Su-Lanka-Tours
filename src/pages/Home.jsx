import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import About from '../components/About';
import Roadmap from '../components/Roadmap';
import ImmersiveSlider from '../components/ImmersiveSlider'; // Import the new component
import Experiences from '../components/Experiences';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Su Lanka Tours | Experience Sri Lanka's Beauty</title>
        <meta name="description" content="Discover the beauty of Sri Lanka with Su Lanka Tours. We offer customized tours, expert local guides, and unforgettable experiences throughout the island." />
      </Helmet>
      
      <main>
        <Hero />
        <About />
        <Roadmap />
        <ImmersiveSlider /> {/* Added the new immersive slider between Roadmap and Experiences */}
        <Experiences />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
};

export default Home;