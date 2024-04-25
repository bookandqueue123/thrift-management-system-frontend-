import Navbar from "../NavBar";
import HeroSection from "../HeroSection";
import AboutUs from "../AboutUs";
import HowToUse from "../HowToUse";
import ProductService from "../ProuctService";
import FAQ from "../Faq";
import ContactUs from "../ContactUs";
import Footer from "../Footer";
import { useState, useEffect } from "react";


const data = [
    {
      text: "Helping traders save on daily basis",
      firstImageSrc: "/maxabout.jpg",
      secondImageSrc: "/man-woman.svg"
    },

    
  ];
const aboutText = "Maxwell savings is a traditional thrift management company - popularly known as ajo, esusu or adashe. The company was founded 1st February, 2017. As a customer, you can choose to save your money with Maxwell Savings on a daily and weekly basis. And you can also collect your saved funds on a monthly, quarterly or yearly basis."
export default function OrganisationHomePage() {
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setHost(url.host);
      console.log("host", host);
    }
  }, [host]);
    return (
      <div>
        <Navbar />
        <HeroSection bg="white" />
        <AboutUs bg="white" data={data} aboutText={aboutText} />
        {/* <HowToUse/> */}
        {/* <ProductService/>
            <FAQ/> */}
        <ContactUs
          bg="white"
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
        />
        <Footer />
      </div>
    );
}