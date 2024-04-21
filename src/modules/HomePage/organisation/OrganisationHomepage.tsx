import Navbar from "../NavBar";
import HeroSection from "../HeroSection";
import AboutUs from "../AboutUs";
import HowToUse from "../HowToUse";
import ProductService from "../ProuctService";
import FAQ from "../Faq";
import ContactUs from "../ContactUs";
import Footer from "../Footer";


const data = [
    {
      text: "Helping traders save on daily basis",
      firstImageSrc: "/maxabout.jpg",
      secondImageSrc: "/man-woman.svg"
    },

    
  ];
const aboutText = "Maxwell savings is a traditional thrift management company - popularly known as ajo, esusu or adashe. The company was founded 1st February, 2017. As a customer, you can choose to save your money with Maxwell Savings on a daily and weekly basis. And you can also collect your saved funds on a monthly, quarterly or yearly basis."
export default function OrganisationHomePage(){
    return(
        <div >
           <Navbar/>
            <HeroSection 
             bg="white"
            /> 
            <AboutUs bg="white" data={data} aboutText={aboutText}/>
            {/* <HowToUse/> */}
            {/* <ProductService/>
            <FAQ/> */}
            <ContactUs bg="white"/>
            <Footer/>
        </div>
        
    )
}