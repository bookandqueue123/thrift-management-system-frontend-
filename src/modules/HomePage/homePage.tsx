import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import HowToUse from "./HowToUse";
import ProductService from "./ProuctService";
export default function HomePage(){
    return(
        <div className="">
           <Navbar/>
            <HeroSection/> 
            <AboutUs/>
            <HowToUse/>
            <ProductService/>
        </div>
        
    )
}