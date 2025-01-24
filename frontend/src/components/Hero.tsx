import React from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Stars,
  Sparkles,
  ArrowRight,
  Flower,
  ScrollText,
  CircleDot,
  Triangle,
  Square,
  Download,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-6 rounded-2xl border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200">
    <div className="w-12 h-12 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#151616]" />
    </div>
    <h3 className="text-lg font-bold text-[#151616] mb-2">{title}</h3>
    <p className="text-[#151616]/70">{description}</p>
  </motion.div>
);

const FloatingElement = ({ children, delay = 0, rotate = false }) => (
  <motion.div
    initial={{ y: 10 }}
    animate={{
      y: [-10, 10],
      rotate: rotate ? [-10, 10] : 0,
    }}
    transition={{
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      },
      rotate: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      },
    }}>
    {children}
  </motion.div>
);

const GeometricBackground = () => {
  const shapes = Array(6).fill(null);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((_, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}>
          {index % 3 === 0 ? (
            <CircleDot className="w-16 h-16 text-[#D6F32F]" />
          ) : index % 3 === 1 ? (
            <Triangle className="w-16 h-16 text-[#151616]" />
          ) : (
            <Square className="w-16 h-16 text-[#D6F32F]" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const ParticleEffect = () => {
  const particles = Array(20).fill(null);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-[#D6F32F] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <div className="min-h-screen bg-[#ffffff] relative overflow-hidden pt-8 mt-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#151616 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: "0.1",
          }}
        />
      </div>

      <GeometricBackground />
      <ParticleEffect />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0.2} rotate>
          <Stars className="absolute top-20 left-1/4 w-8 h-8 text-[#D6F32F]" />
        </FloatingElement>
        <FloatingElement delay={0.4} rotate>
          <Moon className="absolute top-40 right-1/4 w-8 h-8 text-[#151616]" />
        </FloatingElement>
        <FloatingElement delay={0.6} rotate>
          <Flower className="absolute bottom-20 left-1/3 w-8 h-8 text-[#D6F32F]" />
        </FloatingElement>
        <FloatingElement delay={0.8} rotate>
          <Sparkles className="absolute top-32 right-1/3 w-8 h-8 text-[#151616]" />
        </FloatingElement>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <motion.div
            className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-6 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#D6F32F]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <motion.div
              className="w-2 h-2 bg-[#D6F32F] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm font-medium">
              AI-Powered Sustainable Shopping Assistant
            </span>
          </motion.div>

          <h1 className="text-7xl font-black text-[#151616] mb-6">
            Your purchases
            <div className="relative inline-block mx-2">
              <span className="relative z-10">your impact</span>
              <motion.div
                className="absolute bottom-2 left-0 right-0 h-4 bg-[#D6F32F] -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
            Let's make it positive
          </h1>

          <p className="text-xl text-[#151616]/70 mb-8 max-w-2xl mx-auto">
          It's time to rethink shopping. Choose smarter, eco-friendly options to reduce waste and protect our planet
          </p>

          <div className="flex gap-4 justify-center">
            <motion.a
              href="/login"
              className="bg-[#D6F32F] px-8 py-4 rounded-2xl text-xl font-bold text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://github.com/azlan18"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl text-xl font-bold border-2 border-[#151616] hover:bg-[#151616]/5 transition-all duration-200 text-[#151616] shadow-[4px_4px_0px_0px_#D6F32F] flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              Download Extension
              <Download className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={Stars}
            title="Your Eco-Score"
            description="Maintain your Eco-Score by making sustainable choices and reducing waste."
            delay={0.2}
          />
          <FeatureCard
            icon={Sparkles}
            title="Leaderboard"
            description="Compete with friends and family to see who can make the biggest impact."
            delay={0.4}
          />
          <FeatureCard
            icon={ScrollText}
            title="Image Upload"
            description="Simply click a picture of your product to calulate its impact."
            delay={0.6}
          />
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          <div className="inline-flex gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              ✨
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              🌟
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
