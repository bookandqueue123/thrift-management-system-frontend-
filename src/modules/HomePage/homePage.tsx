import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import HowToUse from "./HowToUse";
import ProductService from "./ProuctService";
import FAQ from "./Faq";
import ContactUs from "./ContactUs";
import Footer from "./Footer";

const aboutText = "At Finkia, we believe in the transformative power of saving, and our platform is designed to make saving not just easy but also rewarding. Whether you're a seasoned trader looking to enhance your financial strategy or a young individual embarking on your savings journey, Finkia is here to guide and support you every step of the way."
export default function HomePage(){
    return(
        <div className="bg-ajo_darkBlue ">
           <Navbar/>
            <HeroSection/> 
            <AboutUs aboutText={aboutText}/>
            <HowToUse/>
            <ProductService/>
            <FAQ/>
            <ContactUs/>
            <Footer/>
        </div>
        
    )
}