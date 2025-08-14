'use client';
import { motion } from 'framer-motion';

const ContactSales = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 md:py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 bg-gray-50 rounded-xl py-12 lg:py-20 bg-vanilla">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Need more photo credits?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Contact us to explore custom pricing for high-volume plans
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-coffee transition-colors"
          >
            Contact Sales
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSales;