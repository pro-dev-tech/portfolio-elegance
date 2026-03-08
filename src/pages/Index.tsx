import Header from "@/components/portfolio/Header";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Education from "@/components/portfolio/Education";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Achievements from "@/components/portfolio/Achievements";
import Gallery from "@/components/portfolio/Gallery";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import WelcomeGreeting from "@/components/portfolio/WelcomeGreeting";
import Posts from "@/components/portfolio/Posts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeGreeting />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Gallery />
      <Contact />
      <Footer />
      <Posts />
    </div>
  );
};

export default Index;
