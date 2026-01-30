'use client'

import { Hero3D } from '@/components/hero-3d'
import { Navbar } from '@/components/navbar'
import { ProjectCard } from '@/components/project-card'
import { Separator } from '@/components/ui/separator'
import { Mail, Github } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* 3D Hero Section */}
      <section className="relative">
        <Hero3D />
      </section>

      {/* About Me Section */}
      <section id="about" className="pt-12 pb-32 bg-muted/30 scroll-mt-[120px]">
        {/* Full-width separator */}
        <Separator className="mb-8 bg-border" />

        {/* Name - centered but constrained */}
        <div className="px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-balance">
            Santiago Velasquez Talbott
          </h1>
        </div>

        {/* Full-width separator */}
        <Separator className="mt-8 mb-16 bg-border" />

        {/* About content */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-2/5">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl" />
                <Image
                  src="/profile.jpg"
                  alt="Santiago Velasquez Talbott"
                  width={400}
                  height={400}
                  className="relative rounded-2xl object-cover w-full h-full border-2 border-border"
                  priority
                />
              </div>
            </div>
            <div className="w-full md:w-3/5 space-y-6">
              <h2 className="text-4xl font-bold text-balance">About Me</h2>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  {'I\'m Santiago, a Computer Science student from Montreal (2029 graduate). I\'m still learning, but I strive to be really good at what I do. Right now, I\'m fuelled by my creativity, almost everyday I\'ll have ideas inspired by things I\'ve seen in movies, games or modelled after things I see in real life and when I can I try to design a model or solution.'}
                </p>
                <p>
                  {'I\'d consider myself a "tinkerer" (if that word is appropriate). I like to experiment with different tools and frameworks, even if I don\'t fully understand them yet. Theodore Roosevelt\'s "Man in the Arena" quote is my mantra: the only way to learn something is by doing it, and regardless of success or failure, the greatest accomplishment is being able to say I tried.'}
                </p>
                <p>
                  {'I enjoy working late into the night, I\'m constantly looking for new opportunities to learn and innovate. I\'m a strong believer that limits can always be pushed and that new technologies are on the horizon. (I mean, if the laws of physics don\'t prohibit it, then laziness is the only thing stopping us from making those discoveries.)'}
                </p>
                <p>
                  {'I\'m a figure it out kind of guy, I firmly believe that skills can be learned, an attitude on the other hand typically requires a brain transplant.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-8 lg:px-20 xl:px-28 scroll-mt-[120px]">
        <div className="max-w-[1600px] mx-auto space-y-28">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-balance mb-4">Projects</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            </p>
          </div>

          <ProjectCard
            title="1Stop"
            description={
              <>
                1Stop is a <strong>cross-platform mobile app</strong> that helps college students discover local deals and experiences. Built with <strong>React Native</strong>, <strong>Expo</strong>, and <strong>TypeScript</strong>, the app features a <strong>Tinder-style swipe interface</strong> where users browse curated "mood playlists" of venues. The UI embraces a modern <strong>glassmorphism</strong> aesthetic with frosted glass effects, smooth gradients, and fluid <strong>gesture-driven animations</strong> powered by <strong>React Native Reanimated</strong>.
                <br /><br />
                The project follows a <strong>modular, component-based architecture</strong> with <strong>file-based routing</strong> through <strong>Expo Router</strong> and optimized performance using <strong>worklets</strong> to keep animations silky smooth. Currently in active development and approaching the <strong>prototype phase</strong>, Whim showcases my ability to design <strong>polished mobile experiences</strong>, implement <strong>complex animation systems</strong>, and build <strong>scalable applications</strong> within the <strong>React Native ecosystem</strong>.
              </>
            }
            videoUrl="/projects/1Stop.mov"
            aspectRatio="portrait"
            techStack={[
              { name: 'React Native', value: 35, color: '#61DAFB' },
              { name: 'TypeScript', value: 25, color: '#3178C6' },
              { name: 'Expo', value: 20, color: '#000020' },
              { name: 'Reanimated', value: 12, color: '#FF6B6B' },
              { name: 'React Navigation', value: 5, color: '#6B52AE' },
              { name: 'StyleSheet', value: 3, color: '#E879F9' },
            ]}
          />

          <ProjectCard
            title="TNKR"
            description={
              <>
                TNKR is an <strong>interactive 3D web application</strong> that lets users explore how systems work by breaking them down into their individual components. Users can view <strong>3D models</strong> of systems like a table, car engine, and an Iron Man suit, then smoothly animate them into an "exploded view" to see how all the pieces fit together. The app allows clicking on any part to highlight it, displays floating labels that follow components as you rotate the model, and includes a searchable sidebar to find specific parts. Built with <strong>Three.js</strong> for <strong>3D graphics</strong> and <strong>GSAP</strong> for animations, the frontend uses <strong>Vite</strong> as build tool and follows <strong>modular JavaScript architecture</strong>.
                <br /><br />
                This project demonstrates my experience with <strong>WebGL-based 3D rendering</strong>, <strong>interactive user interfaces</strong>, and <strong>real-time graphics programming</strong>. The codebase features professional practices including <strong>well-documented code</strong>, <strong>reusable components</strong>, and <strong>responsive design</strong>. TNKR showcases the kind of skills I have that could be used in <strong>product visualization</strong>, <strong>interactive educational experiences</strong>, and <strong>immersive web experiences</strong>.
              </>
            }
            videoUrl="/projects/TNKR Demo.mov"
            reverse
            chartPosition="left"
            techStack={[
              { name: 'JavaScript', value: 40, color: '#F7DF1E' },
              { name: 'Three.js', value: 25, color: '#049EF4' },
              { name: 'CSS3', value: 18, color: '#264DE4' },
              { name: 'HTML5', value: 7, color: '#E34F26' },
              { name: 'GSAP', value: 5, color: '#88CE02' },
              { name: 'Vite', value: 5, color: '#646CFF' },
            ]}
          />

          <ProjectCard
            title="Java Gym Reception Management Program"
            description={
              <>
                A <strong>menu-driven Java terminal application</strong> that simulates a gym reception management system, demonstrating core <strong>object-oriented programming principles</strong> and <strong>software design best practices</strong>. Built using <strong>Java</strong> with no external dependencies, the system features a <strong>modular architecture</strong> with four distinct classes: a main driver class handling user interaction, and three model classes representing the business domain. The application supports <strong>CRUD operations</strong>, allowing users to add, view, update, and remove membership cards.
                <br /><br />
                The codebase emphasizes proper <strong>OOP design patterns</strong> including <strong>encapsulation</strong>, <strong>deep copying</strong> to prevent unintended data mutation, and <strong>robust input validation</strong>. Key implementation highlights include <strong>custom copy constructors</strong> for safe object duplication, overridden <strong>equals() and hashCode() methods</strong> following the Java contract, and <strong>null-safe comparisons</strong> using the <strong>Objects utility class</strong>.
              </>
            }
            videoUrl="/projects/Java Gym Reception Management Program Demo.mov"
            chartPosition="right"
            techStack={[
              { name: 'Java (Core)', value: 70, color: '#ED8B00' },
              { name: 'Maven', value: 12, color: '#C71A36' },
              { name: 'Java Std Library', value: 10, color: '#5382A1' },
              { name: 'Git', value: 5, color: '#F05032' },
              { name: 'IDE Config', value: 3, color: '#000000' },
            ]}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="pt-32 pb-96 px-6 bg-muted/30 scroll-mt-[120px] min-h-[80vh]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold text-balance">{'Contact Me'}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <a
              href="mailto:santi.velasquezt@gmail.com"
              className="flex items-center gap-3 text-lg hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
              <span>santi.velasquezt@gmail.com</span>
            </a>
            <a
              href="https://github.com/santiagovelasquezt2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
              <span>github.com/santiagovelasquezt2</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2026 Santiago Velasquez Talbott. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
