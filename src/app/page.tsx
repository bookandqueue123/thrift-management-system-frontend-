"use client";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
import Landing from "./landing";
import HomePage from "@/modules/HomePage/homePage";

export default function Home() {
  VerifyOrgSubdomain();
  return(
    <div className=" bg-ajo_darkBlue ">
      <HomePage/>
      {/* <Landing /> */}
    </div>
    
    
  ) 
}
