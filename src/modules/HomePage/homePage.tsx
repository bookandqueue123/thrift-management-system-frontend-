import Navbar from "./NavBar";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import HowToUse from "./HowToUse";
import ProductService from "./ProuctService";
import FAQ from "./Faq";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import Carousel from "./Carousel";
import FinkiaAbout from "./FinkiaAbout";
import YoutubeSection from "./YoutubeSection";
import GeneralMarket from "./GeneralMarket";
import TopNav from "./TopNav";

const aboutText =
    "At Finkia, we believe in the transformative power of saving, and our platform is designed to make saving not just easy but also rewarding. Whether you're a seasoned trader looking to enhance your financial strategy or a young individual embarking on your savings journey, Finkia is here to guide and support you every step of the way. \n \n FINKIA is a thrift management system that enables thrift collectors to collect different types of savings from their customers easily, through different payment channels, and manage financial records efficiently and properly.It uses artificial intelligence to understand financial behavioral patterns of each customer to determine saving culture and loan - repayment ability of the customer.";
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
export default function HomePage() {
      const [host, setHost] = useState("");

      useEffect(() => {

        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          setHost(url.host);

        }
      }, [host]);
    return (
      <div className=" ">
        <Navbar />
        <Carousel/> 
        {/* <TopNav/> */}
        <FinkiaAbout/>
          
        <YoutubeSection/>
         <GeneralMarket/> 
        {/* <HeroSection />
        <AboutUs aboutText={aboutText} data={data} />
        <HowToUse />
        <ProductService />
        <FAQ /> */}
        {/* <ContactUs
          contactPhone={
            host === "www.maxwellsaving.com.ng"
              ? "+234 906 190 3588"
              : "+234 809 722 7051"
          }
          contactMail={
            host === "www.maxwellsaving.com.ng"
              ? "info@maxwellsavings.com.ng"
              : "finkia.support@raoatech.com"
          }
        /> */}
        <Footer />
      </div>
    );
}