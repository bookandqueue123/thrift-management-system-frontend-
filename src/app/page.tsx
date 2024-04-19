"use client";
import VerifyOrgSubdomain from "@/utils/VerifyOrgSubdomain";
import Landing from "./landing";
import HomePage from "@/modules/HomePage/homePage";


export default function Home() {
  // this piece is causing the code to fail so I comment it out
  // VerifyOrgSubdomain();
  return(
    <div className=" ">
       <HomePage/> 
      {/* <Landing /> */}
    </div>
    
    
  ) 
}
