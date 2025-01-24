import PurposeCarousel from "@/modules/merchant/SavingPurposeCarousel";
const GeneralMarket= () => {
  const merchantNumber = "";
    return (
        <div className="mx-[5%] mt-6">
          <h1 className="text-extrabold mb-4 text-3xl">General Market</h1>
            <div>
          <PurposeCarousel
            merchantNumber={merchantNumber}
            categoryToshow={"general"}
          />
        </div>
        </div>
    );
};

export default GeneralMarket