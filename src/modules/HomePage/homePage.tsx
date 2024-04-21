import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import HowToUse from "./HowToUse";
import ProductService from "./ProuctService";
import FAQ from "./Faq";
import ContactUs from "./ContactUs";
import Footer from "./Footer";

const aboutText = "At Finkia, we believe in the transformative power of saving, and our platform is designed to make saving not just easy but also rewarding. Whether you're a seasoned trader looking to enhance your financial strategy or a young individual embarking on your savings journey, Finkia is here to guide and support you every step of the way."
const data = [
    {
      text: "Helping traders save on daily basis",
      firstImageSrc: "/woman-holding.svg",
      secondImageSrc: "/man-woman.svg"
    },
    {
        text: "Automating financial management for cooperative societies",
        firstImageSrc: "/automate1.svg",
        secondImageSrc: "/automate2.svg"
    },
    {
        text: "Inculcating healthy saving habits in youths",
        firstImageSrc: "/inculate1.svg",
        secondImageSrc: "/inculate2.svg"
    },

    
  ];
export default function HomePage(){
    return(
        <div className="bg-ajo_darkBlue ">
           <Navbar/>
            <HeroSection/> 
            <AboutUs aboutText={aboutText} data={data}/>
            <HowToUse/>
            <ProductService/>
            <FAQ/>
            <ContactUs/>
            <Footer/>
        </div>
        
    )
}