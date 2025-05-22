import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { GALLERY_IMAGES } from '../utils/constants';

// Extended gallery images for the full gallery page
const extendedGalleryImages = [
  ...GALLERY_IMAGES,
  {
    id: 4,
    src: "/images/gallery/gallery1.jpg",
    alt: "Polonnaruwa ancient city ruins",
    category: "heritage",
  },
  {
    id: 5,
    src: "/images/gallery/gallery2.jpg",
    alt: "Stilt fishermen at sunset",
    category: "culture",
  },
  {
    id: 6,
    src: "/images/gallery/gallery3.jpg",
    alt: "Tropical rainforest waterfall",
    category: "nature",
  },
  {
    id: 7,
    src: "/images/gallery/gallery1.jpg",
    alt: "Traditional Sri Lankan food",
    category: "cuisine",
  },
  {
    id: 8,
    src: "/images/gallery/gallery2.jpg",
    alt: "Train journey through tea plantations",
    category: "travel",
  },
  {
    id: 9,
    src: "/images/gallery/gallery3.jpg",
    alt: "Whale watching in Mirissa",
    category: "wildlife",
  },
];

const FullGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredImages, setFilteredImages] = useState(extendedGalleryImages);
  
  // Get unique categories
  const categories = ['all', ...new Set(extendedGalleryImages.map(img => img.category))];
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Filter images based on selected category
    if (selectedCategory === 'all') {
      setFilteredImages(extendedGalleryImages);
    } else {
      setFilteredImages(extendedGalleryImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  return (
    <>
      <Helmet>
        <title>Gallery | Su Lanka Tours</title>
        <meta name="description" content="Browse our gallery of stunning images from across Sri Lanka. Experience the natural beauty, cultural heritage, and unique attractions that await you." />
      </Helmet>
      
      <main className="pt-20">
        {/* Header */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container">
            <SectionTitle 
              title="Our Gallery" 
              subtitle="A visual journey through the beauty and diversity of Sri Lanka" 
              color="light"
            />
          </div>
        </section>
        
        {/* Gallery Content */}
        <section className="section bg-white">
          <div className="container">
            {/* Back to home link */}
            <div className="mb-8">
              <Link to="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                <span>Back to Home</span>
              </Link>
            </div>
            
            {/* Category filters */}
            <div className="mb-12">
              <h3 className="text-lg font-medium mb-4">Filter by Category:</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full capitalize transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Gallery grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="overflow-hidden rounded-lg shadow-md bg-white"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative overflow-hidden group h-64">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">{image.alt}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary">{image.alt}</h3>
                    <p className="text-gray-600 text-sm mt-1 capitalize">Category: {image.category}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* No results message */}
            {filteredImages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No images found for this category.</p>
                <Button 
                  variant="primary" 
                  onClick={() => setSelectedCategory('all')}
                >
                  View All Images
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default FullGallery;