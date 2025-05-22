import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { Phone, Mail, MapPin, Send, Check, ExternalLink } from 'lucide-react';

const Contact = () => {
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [focused, setFocused] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const formRef = useRef(null);
  const cardRef = useRef(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0, 1, 1, 0.8]);
  
  // Handle animation when component is in view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);
  
  // Mouse move effect for 3D card tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };
    
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };
    
    const element = cardRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleFocus = (field) => {
    setFocused(field);
  };
  
  const handleBlur = () => {
    setFocused(null);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });
    
    // Simulate form submission with loading animations
    setTimeout(() => {
      setFormStatus({ submitting: false, submitted: true, error: null });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, submitted: false }));
      }, 5000);
    }, 1500);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  // Calculate 3D transform based on mouse position for the card
  const getCardTransform = () => {
    const { x, y } = mousePosition;
    const tiltMax = 5; // Maximum tilt in degrees
    
    const tiltX = (y / 150) * tiltMax;
    const tiltY = (x / 150) * -tiltMax;
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: x === 0 && y === 0 ? "transform 0.6s ease-out" : "none"
    };
  };
  
  return (
    <section id="contact" className="section relative py-20 overflow-hidden" ref={ref}>
      {/* 3D geometric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute -top-40 right-0 w-80 h-80 bg-primary/5 rounded-full"
          style={{ y: y1, rotate: rotate1 }}
        />
        <motion.div 
          className="absolute top-1/3 -left-20 w-60 h-60 bg-secondary/10 rounded-full"
          style={{ y: y2, rotate: rotate2 }}
        />
        
        {/* Animated grid background */}
        <motion.div 
          className="absolute inset-0 bg-grid-pattern-contact opacity-[0.03]"
          style={{ opacity }}
        />
      </div>
      
      <div className="container relative z-10">
        <SectionTitle 
          title="Contact Us" 
          subtitle="Get in touch with our team to start planning your Sri Lankan adventure" 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
          {/* 3D Contact Form Card */}
          <motion.div 
            ref={cardRef}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={getCardTransform()}
          >
            <div className="relative h-20 bg-gradient-to-r from-primary to-primary/80 flex items-center px-8">
              <h3 className="text-xl font-bold text-white">Send Us a Message</h3>
              
              {/* Decorative elements */}
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                <div className="w-3 h-3 rounded-full bg-white/50"></div>
                <div className="w-3 h-3 rounded-full bg-white/70"></div>
              </div>
            </div>
            
            <div className="p-8">
              {formStatus.submitted ? (
                <motion.div 
                  className="bg-green-50 border border-green-100 rounded-lg p-6 flex flex-col items-center justify-center h-80"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Check size={30} className="text-green-600" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h4>
                  <p className="text-green-600 text-center mb-4">Thank you for contacting us. We'll get back to you shortly.</p>
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    onClick={() => setFormStatus((prev) => ({ ...prev, submitted: false }))}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                  >
                    <motion.div variants={itemVariants} className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        required
                        className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                          focused === 'name' ? 'border-primary shadow-sm' : 'border-gray-300'
                        }`}
                      />
                      <label 
                        htmlFor="name"
                        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                          focused === 'name' || formData.name 
                            ? '-top-2.5 text-xs text-primary bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        Your Name
                      </label>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        required
                        className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                          focused === 'email' ? 'border-primary shadow-sm' : 'border-gray-300'
                        }`}
                      />
                      <label 
                        htmlFor="email"
                        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                          focused === 'email' || formData.email 
                            ? '-top-2.5 text-xs text-primary bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        Email Address
                      </label>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                  >
                    <motion.div variants={itemVariants} className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus('phone')}
                        onBlur={handleBlur}
                        className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                          focused === 'phone' ? 'border-primary shadow-sm' : 'border-gray-300'
                        }`}
                      />
                      <label 
                        htmlFor="phone"
                        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                          focused === 'phone' || formData.phone 
                            ? '-top-2.5 text-xs text-primary bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        Phone Number (Optional)
                      </label>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => handleFocus('subject')}
                        onBlur={handleBlur}
                        required
                        className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                          focused === 'subject' ? 'border-primary shadow-sm' : 'border-gray-300'
                        }`}
                      />
                      <label 
                        htmlFor="subject"
                        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                          focused === 'subject' || formData.subject 
                            ? '-top-2.5 text-xs text-primary bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        Subject
                      </label>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                  >
                    <motion.div variants={itemVariants} className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => handleFocus('message')}
                        onBlur={handleBlur}
                        required
                        rows="6"
                        className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 ${
                          focused === 'message' ? 'border-primary shadow-sm' : 'border-gray-300'
                        }`}
                      ></textarea>
                      <label 
                        htmlFor="message"
                        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                          focused === 'message' || formData.message 
                            ? '-top-2.5 text-xs text-primary bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        Your Message
                      </label>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate={controls}
                    className="flex justify-between items-center"
                  >
                    <motion.label variants={itemVariants} className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-600">I accept the Privacy Policy</span>
                    </motion.label>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={formStatus.submitting}
                        className="relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center">
                          {formStatus.submitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={18} className="mr-2" />
                              Send Message
                            </>
                          )}
                        </span>
                        
                        {/* Button background animation */}
                        <span className="absolute inset-0 w-0 bg-secondary group-hover:w-full transition-all duration-300 ease-out opacity-60 z-0"></span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              )}
            </div>
          </motion.div>
          
          {/* Contact Info Card with 3D effects */}
          <div className="flex flex-col gap-6">
            <motion.div 
              className="relative bg-primary text-white rounded-xl shadow-2xl overflow-hidden flex-grow"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(10, 76, 140, 0.4)",
              }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-full h-full bg-dot-pattern opacity-5 transform -rotate-6 scale-125"></div>
                
                {/* Glowing orb */}
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-secondary/20 filter blur-xl"></div>
                <div className="absolute -left-20 bottom-10 w-40 h-40 rounded-full bg-white/10 filter blur-lg"></div>
              </div>
              
              <div className="relative z-10 p-8 lg:p-10">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-8">
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-3 mr-4 shadow-lg">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white/80 text-sm mb-1">Phone</h4>
                      <a 
                        href="tel:+94774469122" 
                        className="text-white font-medium text-lg hover:text-secondary transition-colors group flex items-center"
                      >
                        +94 77 446 9122
                        <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-3 mr-4 shadow-lg">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white/80 text-sm mb-1">Email</h4>
                      <a 
                        href="mailto:sulankatours@gmail.com" 
                        className="text-white font-medium text-lg hover:text-secondary transition-colors group flex items-center"
                      >
                        sulankatours@gmail.com
                        <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-3 mr-4 shadow-lg">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white/80 text-sm mb-1">Address</h4>
                      <a 
                        href="https://maps.google.com/?q=232,+Sadasiripura,+Oruwala,+Athurugiriya,+Sri+Lanka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-medium hover:text-secondary transition-colors group flex items-start"
                      >
                        <span>
                          232, Sadasiripura, Oruwala,<br />
                          Athurugiriya, Sri Lanka
                        </span>
                        <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                      </a>
                    </div>
                  </motion.div>
                </div>
                
                {/* Social media icons with hover effects */}
                <div className="mt-12">
                  <h4 className="text-white/80 text-sm mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform, index) => (
                      <motion.a
                        key={platform}
                        href="#"
                        className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-glow"
                        whileHover={{ y: -5, rotateZ: 5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 1.1 + (index * 0.1) }}
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          {platform === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                          {platform === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                          {platform === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                          {platform === 'linkedin' && <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />}
                        </svg>
                        
                        {/* Animated rings on hover */}
                        <span className="hidden absolute inset-0 rounded-full animate-ping-slow opacity-40 bg-white/20 group-hover:block"></span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Virtual Tour Card
            <motion.div 
              className="bg-white rounded-xl shadow-xl overflow-hidden h-64 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 animate-gradient-shift"></div>
              
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-0 bottom-0 w-24 h-24 bg-secondary/10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 p-4 bg-white/30 backdrop-blur-sm rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Virtual Consultation</h3>
                <p className="text-gray-700 mb-6">Schedule a video call with our travel experts to plan your perfect Sri Lankan journey.</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="group"
                >
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">Book a Call</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </motion.div> */}
          </div>
        </div>
        
        {/* 3D Office hours and FAQ section */}
        <motion.div 
          className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/5 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Office hours */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Office Hours
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Monday - Friday:</span>
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-primary font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Saturday:</span>
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-primary font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Sunday:</span>
                  <span className="bg-red-100 px-3 py-1 rounded-full text-red-600 font-medium">Closed</span>
                </div>
                
                <div className="pt-4 text-gray-600">
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-secondary mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>We recommend scheduling an appointment for personalized service.</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQs */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div className="group">
                  <h4 className="font-medium text-gray-800 group-hover:text-primary transition-colors flex items-center">
                    <span className="text-primary mr-2">Q.</span>
                    How can I book a tour?
                  </h4>
                  <p className="text-gray-600 mt-1 pl-6">You can book through our website, email us, or call us directly. We'll help you plan your perfect Sri Lankan adventure.</p>
                </div>
                
                <div className="group">
                  <h4 className="font-medium text-gray-800 group-hover:text-primary transition-colors flex items-center">
                    <span className="text-primary mr-2">Q.</span>
                    What payment methods do you accept?
                  </h4>
                  <p className="text-gray-600 mt-1 pl-6">We accept credit cards, bank transfers, and PayPal. A 20% deposit is required to confirm your booking.</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="text-primary border-primary hover:bg-primary hover:text-white w-full"
                >
                  View All FAQs
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* CSS for special effects */}
      <style dangerouslySetInnerHTML={{
  __html:`
        /* 3D grid pattern for background */
        .bg-grid-pattern-contact {
          background-image: 
            linear-gradient(to right, rgba(10,76,140,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,76,140,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%);
          transform-origin: center center;
        }
        
        /* Dot pattern background */
        .bg-dot-pattern {
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 2px, transparent 2px);
          background-size: 20px 20px;
        }
        
        /* Glow effect for social icons */
        .shadow-glow {
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.5), 
                      0 0 30px rgba(245, 158, 11, 0.3);
        }
        
        /* Slow ping animation */
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          70%, 100% { transform: scale(2.5); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Gradient shift animation */
        @keyframes gradient-shift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        
        /* Ensure items are visible on fallback */
        @media (prefers-reduced-motion: reduce) {
          .transform, .transition-all, .transition-opacity, .transition-transform {
            transition: none !important;
            transform: none !important;
          }
          
          .animate-ping-slow, .animate-gradient-shift {
            animation: none !important;
          }
        }
      `}}></style>
    </section>
  );
};

export default Contact;