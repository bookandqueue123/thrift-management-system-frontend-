import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import HowToUse from "./HowToUse";
import ProductService from "./ProuctService";
import FAQ from "./Faq";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
export default function HomePage(){
    return(
        <div className="">
           <Navbar/>
            <HeroSection/> 
            <AboutUs/>
            <HowToUse/>
            <ProductService/>
            <FAQ/>
            <ContactUs/>
            <Footer/>
        </div>
        
    )
}