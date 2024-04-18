"use client";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";

import HomePage from "@/modules/HomePage/homePage";

export default function Home() {
  VerifyOrgSubdomain();
  return(
    <div className=" ">
      <HomePage/>
      
    </div>
    
    
  ) 
}
