    import React, { useEffect, useRef } from 'react';
    import { motion, useAnimation } from 'framer-motion';
    import { useInView } from 'react-intersection-observer'; // Changed to react-intersection-observer
    import SectionTitle from './ui/SectionTitle';

    const About = () => {
    // Use react-intersection-observer instead
    const [ref, inView] = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });
    
    const controls = useAnimation();
    
    useEffect(() => {
        if (inView) {
        controls.start('visible');
        
        // Simple class-based animation instead of anime.js
        const border = document.querySelector('.image-border');
        if (border) {
            border.classList.add('animate-border');
        }
        }
    }, [inView, controls]);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
        },
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
        },
        },
    };
    
    return (
        <section id="about" className="section bg-white overflow-hidden" ref={ref}>
        <div className="container">
            <SectionTitle 
            title="About Su Lanka Tours" 
            subtitle="Discover our mission and the passion that drives us to showcase the best of Sri Lanka" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image with decorative elements */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 20 }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                <div className="relative z-10 overflow-hidden rounded-lg shadow-xl">
                {/* Added fallback for missing image */}
                <img
                    src="/images/founder.jpg"
                    alt="Founder of Su Lanka Tours"
                    className="w-full h-auto"
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Founder+Image";
                    }}
                />
                
                {/* SVG border animation with CSS instead of anime.js */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <rect
                    className="image-border stroke-current text-secondary"
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="none"
                    strokeWidth="0.5"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                    />
                </svg>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-primary/10 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -left-6 w-1/3 h-1/3 bg-secondary/20 rounded-lg -z-10"></div>
            </motion.div>
            
            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                <motion.h3 
                variants={itemVariants}
                className="text-2xl font-bold text-primary mb-4"
                >
                Our Mission
                </motion.h3>
                
                <motion.p 
                variants={itemVariants}
                className="text-gray-700 mb-6"
                >
                Su Lanka Tours was founded with a simple yet profound mission: to share the authentic beauty and rich cultural heritage of Sri Lanka with travelers from around the world. As a locally-owned travel agency, we combine our intimate knowledge of the island with professional service to create unforgettable experiences.
                </motion.p>
                
                <motion.h3 
                variants={itemVariants}
                className="text-2xl font-bold text-primary mb-4"
                >
                The Su Lanka Experience
                </motion.h3>
                
                <motion.p 
                variants={itemVariants}
                className="text-gray-700 mb-6"
                >
                What sets us apart is our attention to detail and personalized service. We believe that travel should be transformative, not transactional. With Su Lanka Tours, you'll discover not just the popular attractions but also the hidden gems that make Sri Lanka truly special.
                </motion.p>
                
                <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 gap-4 mt-8"
                >
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-primary text-3xl font-bold mb-2">10+</div>
                    <div className="text-gray-700">Years of Experience</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-primary text-3xl font-bold mb-2">1000+</div>
                    <div className="text-gray-700">Satisfied Travelers</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-primary text-3xl font-bold mb-2">25+</div>
                    <div className="text-gray-700">Unique Destinations</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-primary text-3xl font-bold mb-2">100%</div>
                    <div className="text-gray-700">Local Expertise</div>
                </div>
                </motion.div>
            </motion.div>
            </div>
        </div>
        </section>
    );
    };

    export default About;