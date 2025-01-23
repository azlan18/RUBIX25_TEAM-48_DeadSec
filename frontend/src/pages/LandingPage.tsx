import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureSection />
      <Footer/>
    </div>
  );
};

export default LandingPage;
