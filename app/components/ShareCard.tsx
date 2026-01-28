import { motion } from 'motion/react';
import { Share2, Download, Twitter } from 'lucide-react';

interface ShareCardProps {
  username: string;
  transactions: number;
  persona: string;
  topVibe: string;
  vibePercentage: number;
}

export function ShareCard({ 
  username, 
  transactions, 
  persona, 
  topVibe,
  vibePercentage 
}: ShareCardProps) {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-theme-background">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black opacity-60" />
      
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(var(--color-theme-primary-rgb), 0.5) 20px, rgba(var(--color-theme-primary-rgb), 0.5) 21px)
            `,
          }}
        />
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{ backgroundColor: 'rgba(var(--color-theme-primary-rgb), 0.2)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-12 flex items-center gap-16">
        {/* Left: Share card preview */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            delay: 0.2 
          }}
          className="flex-1"
          style={{ perspective: 2000 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 rounded-[48px] blur-2xl"
              style={{ backgroundColor: 'rgba(var(--color-theme-primary-rgb), 0.4)' }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            
            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/20 backdrop-blur-xl"
              style={{ background: `linear-gradient(to bottom right, rgba(var(--color-theme-primary-rgb), 0.2), rgba(0, 0, 0, 0.8))` }}
            >
              {/* Card header */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--color-theme-primary)' }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-sm font-black text-white/70 tracking-[0.2em]">
                    STELLAR WRAPPED 2026
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                  @{username}
                </h2>
              </div>

              {/* Stats */}
              <div className="px-8 space-y-4">
                <motion.div 
                  className="backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm font-bold text-white/60 mb-2">
                    Total Transactions
                  </p>
                  <p className="text-6xl font-black text-white">
                    {transactions}
                  </p>
                </motion.div>

                <motion.div 
                  className="backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm font-bold text-white/60 mb-2">
                    Persona
                  </p>
                  <p 
                    className="text-3xl font-black"
                    style={{
                      background: `linear-gradient(to right, #ffffff, var(--color-theme-primary))`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {persona}
                  </p>
                </motion.div>

                <motion.div 
                  className="backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-sm font-bold text-white/60 mb-2">
                    Top Vibe
                  </p>
                  <p className="text-2xl font-black text-white">
                    {vibePercentage}% {topVibe}
                  </p>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                <div className="text-xs font-black text-white/50">
                  stellar.org/wrapped
                </div>
                <motion.div 
                  className="w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center border border-white/20"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  animate={{
                    boxShadow: [
                      `0 0 20px rgba(var(--color-theme-primary-rgb), 0)`,
                      `0 0 30px rgba(var(--color-theme-primary-rgb), 0.5)`,
                      `0 0 20px rgba(var(--color-theme-primary-rgb), 0)`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="w-5 h-5 rounded-lg" style={{ backgroundColor: 'var(--color-theme-primary)' }} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Share options */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-7xl font-black text-white/90 mb-6 tracking-tight leading-none">
              SHARE
            </h2>
            <h2 
              className="text-8xl font-black mb-12 tracking-tight leading-none"
              style={{
                background: `linear-gradient(to right, #ffffff, var(--color-theme-primary))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              YOUR WRAP
            </h2>

            <div className="space-y-4">
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative"
              >
                <motion.div
                  className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'var(--color-theme-primary)' }}
                />
                <div className="relative flex items-center gap-4 bg-white text-black px-8 py-6 rounded-2xl border border-white/20">
                  <Share2 className="w-6 h-6" />
                  <span className="text-2xl font-black tracking-tight">Share to Social</span>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative"
              >
                <motion.div
                  className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'var(--color-theme-primary)' }}
                />
                <div className="relative flex items-center gap-4 backdrop-blur-sm text-white px-8 py-6 rounded-2xl border border-white/20"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Twitter className="w-6 h-6" />
                  <span className="text-2xl font-black tracking-tight">Post to X</span>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative"
              >
                <motion.div
                  className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'var(--color-theme-primary)' }}
                />
                <div className="relative flex items-center gap-4 backdrop-blur-sm text-white px-8 py-6 rounded-2xl border border-white/20"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Download className="w-6 h-6" />
                  <span className="text-2xl font-black tracking-tight">Download Image</span>
                </div>
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-white/50 text-lg font-bold"
            >
              Show the world your Stellar journey
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}