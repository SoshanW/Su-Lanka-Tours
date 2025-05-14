// constants.js
export const NAVIGATION_LINKS = [
    { name: "Home", to: "#home" },
    { name: "About", to: "#about" },
    { name: "Experiences", to: "#experiences" },
    { name: "Gallery", to: "#gallery" },
    { name: "Testimonials", to: "#testimonials" },
    { name: "Contact", to: "#contact" },
  ];
  
  export const ROADMAP_STEPS = [
    {
      title: "Plan",
      description: "Collaborate with our travel experts to design your perfect Sri Lankan adventure.",
      icon: "map",
    },
    {
      title: "Book",
      description: "Secure your booking with flexible payment options and instant confirmations.",
      icon: "calendar-check",
    },
    {
      title: "Prepare",
      description: "Receive detailed itineraries, travel tips, and cultural insights before your trip.",
      icon: "briefcase",
    },
    {
      title: "Experience",
      description: "Enjoy immersive experiences with expert local guides and personalized service.",
      icon: "palm-tree",
    },
    {
      title: "Share",
      description: "Take home unforgettable memories and share your Sri Lankan journey with the world.",
      icon: "camera",
    },
  ];
  
  export const EXPERIENCES = [
    {
      id: 1,
      title: "Sigiriya Rock Fortress",
      description: "Climb the ancient rock fortress of Sigiriya, a UNESCO World Heritage site with stunning frescoes and panoramic views.",
      image: "/images/attractions/sigiriya.jpg",
      location: "Central Province",
    },
    {
      id: 2,
      title: "Ella Train Journey",
      description: "Experience one of the world's most scenic train rides through the misty mountains and tea plantations of Ella.",
      image: "/images/attractions/ella.jpg",
      location: "Uva Province",
    },
    {
      id: 3,
      title: "Temple of the Sacred Tooth Relic",
      description: "Visit the revered Buddhist temple in Kandy that houses the relic of the tooth of Buddha.",
      image: "/images/attractions/kandy.jpg",
      location: "Central Province",
    },
    {
      id: 4,
      title: "Galle Fort",
      description: "Explore the historic Galle Fort, a colonial-era fortified city with charming streets and ocean views.",
      image: "/images/attractions/galle.jpg",
      location: "Southern Province",
    },
    {
      id: 5,
      title: "Yala National Park",
      description: "Embark on a wildlife safari to spot leopards, elephants, and exotic birds in their natural habitat.",
      image: "/images/attractions/yala.jpg",
      location: "Southern Province",
    },
  ];
  
  export const GALLERY_IMAGES = [
    {
      id: 1,
      src: "/images/gallery/gallery1.jpg",
      alt: "Beach sunset in Mirissa",
      category: "beaches",
    },
    {
      id: 2,
      src: "/images/gallery/gallery2.jpg",
      alt: "Tea plantations in Nuwara Eliya",
      category: "nature",
    },
    {
      id: 3,
      src: "/images/gallery/gallery3.jpg",
      alt: "Traditional Sri Lankan dance performance",
      category: "culture",
    },
    // More images for the full gallery page
  ];
  
  export const TESTIMONIALS = [
    {
      id: 1,
      name: "Sarah Thompson",
      country: "United Kingdom",
      image: "/images/testimonials/person1.jpg",
      testimonial: "Our trip with Su Lanka Tours exceeded all expectations. The personalized itinerary allowed us to experience both popular attractions and hidden gems. Our guide was knowledgeable and friendly, making our journey truly memorable.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      country: "Singapore",
      image: "/images/testimonials/person2.jpg",
      testimonial: "From the ancient cities to pristine beaches, our Sri Lankan adventure was perfectly organized. The attention to detail and the authentic cultural experiences made this trip special. Highly recommended!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Johnson",
      country: "Australia",
      image: "/images/testimonials/person3.jpg",
      testimonial: "Su Lanka Tours crafted the perfect family vacation for us. The wildlife safaris were a hit with the kids, and the accommodations were excellent. The team was responsive and adaptable to our needs throughout.",
      rating: 5,
    },
  ];