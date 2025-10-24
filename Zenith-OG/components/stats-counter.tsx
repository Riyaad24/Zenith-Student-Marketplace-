"use client"

import { useRef, useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import '../styles/stats-counter.css'

interface StatItem {
  id: string
  number: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

const statsData: StatItem[] = [
  {
    id: 'students',
    number: 25000,
    label: 'Active Students',
    suffix: '+',
    duration: 2.5
  },
  {
    id: 'items',
    number: 150000,
    label: 'Items Sold',
    suffix: '+',
    duration: 2.8
  },
  {
    id: 'universities',
    number: 35,
    label: 'Universities',
    suffix: '+',
    duration: 2.0
  },
  {
    id: 'savings',
    number: 2000000,
    label: 'Money Saved',
    prefix: 'R',
    suffix: '+',
    duration: 3.0
  }
]

// Individual stat counter component
const StatCounter = ({ stat, shouldStart }: { stat: StatItem; shouldStart: boolean }) => {
  const [hasAnimated, setHasAnimated] = useState(false)

  // Format large numbers (e.g., 2000000 -> 2M)
  const formatNumber = (value: number) => {
    if (stat.id === 'savings') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`
      }
    }
    return value.toLocaleString()
  }

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={shouldStart ? "visible" : "hidden"}
      style={{ textAlign: 'center' }}
    >
      <div className="mb-4">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#6C63FF] block leading-none">
          {stat.prefix && <span className="text-3xl md:text-4xl lg:text-5xl">{stat.prefix}</span>}
          {shouldStart && !hasAnimated ? (
            <CountUp
              start={0}
              end={stat.number}
              duration={stat.duration || 2.5}
              formattingFn={formatNumber}
              onEnd={() => setHasAnimated(true)}
            />
          ) : hasAnimated ? (
            formatNumber(stat.number)
          ) : (
            '0'
          )}
          {stat.suffix && <span>{stat.suffix}</span>}
        </span>
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-700 uppercase tracking-wide">
        {stat.label}
      </h3>
    </motion.div>
  )
}

// Main stats section component
export default function StatsCounter() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true, // Only trigger once when it comes into view
  })

  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    if (inView && !shouldAnimate) {
      setShouldAnimate(true)
    }
  }, [inView, shouldAnimate])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(typeof window !== 'undefined' && window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize)
      return () => window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Additional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236C63FF' fill-opacity='1'%3E%3Ccircle cx='6' cy='6' r='3'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='54' cy='54' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Empowering South African Students
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students across the country who trust Zenith for their academic needs
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: isLargeScreen ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: isLargeScreen ? '3rem' : '2rem',
          }}
        >
          {statsData.map((stat) => (
            <StatCounter 
              key={stat.id} 
              stat={stat} 
              shouldStart={shouldAnimate}
            />
          ))}
        </motion.div>

        {/* Bottom accent */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ 
            marginTop: '4rem', 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          <div className="w-24 h-1 bg-gradient-to-r from-[#6C63FF] to-purple-400 rounded-full"></div>
        </motion.div>
      </div>
    </section>
  )
}