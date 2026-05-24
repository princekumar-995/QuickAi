import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Showcase from '../components/Showcase'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <main className="text-white bg-gradient-soft min-h-screen selection:bg-purple-500/30">
      <Navbar />
      <Hero/>
      <Showcase />
      <AiTools />
      <Testimonial/>
      <Plan/>
      <Footer/>
    </main>
  )
}

export default Home



