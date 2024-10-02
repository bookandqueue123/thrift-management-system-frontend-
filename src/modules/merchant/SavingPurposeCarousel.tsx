import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import {
  addSelectedProduct,
  removeSelectedProduct,
  selectOrganizationId,
  selectSelectedProducts,
  selectUser,
  updateSelectedProducts,
} from "@/slices/OrganizationIdSlice";
import { PurposeProps } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
// import './App.css';

const LeftArrow = () => {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);
  return (
    <button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      className="arrow-button left"
    >
      <FaChevronLeft />
    </button>
  );
};

const RightArrow = () => {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);
  return (
    <button
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      className="arrow-button right"
    >
      <FaChevronRight />
    </button>
  );
};

const HalfBgCategoryName = ({ name }: { name: string }) => {
  const halfLength = Math.ceil(name.length / 2);
  return (
    <span className="half-bg" style={{ width: `${halfLength}ch` }}>
      {name}
    </span>
  );
};

const ProductHorizontalScroll = ({ products }: { products: any }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Access the selectedProducts array from Redux
  const selectedProducts = useSelector(selectSelectedProducts);

  // Handle checkbox change for individual items
  const handleCheckboxChange = (
    id: React.Key,
    isChecked: boolean,
    product: any,
  ) => {
    const categoryProducts = products[product.category];
    const isSelectorAllMandatory =
      product.SelectorAll === "selectorAllMandatory";
    const isSelectorCategoryMandatory =
      product.selectorCategory === "selectorCategoryMandatory";

    if (isSelectorAllMandatory) {
      // Always add if it's 'selectorAllMandatory' and prevent removal
      if (!selectedProducts.includes(id)) {
        dispatch(addSelectedProduct(id));
      }
      return;
    }

    if (isChecked) {
      if (!selectedProducts.includes(id)) {
        dispatch(addSelectedProduct(id));
      }

      // Check and add mandatory category products
      categoryProducts.forEach((categoryProduct: any) => {
        if (
          categoryProduct.selectorCategory === "selectorCategoryMandatory" &&
          !selectedProducts.includes(categoryProduct._id)
        ) {
          dispatch(addSelectedProduct(categoryProduct._id));
        }
      });
    } else {
      if (isSelectorCategoryMandatory) {
        // Ensure categoryProducts is defined and check if any other products are selected
        if (categoryProducts && categoryProducts.length > 0) {
          const anyOtherChecked = categoryProducts.some(
            (p: any) => selectedProducts.includes(p._id) && p._id !== id,
          );

          if (!anyOtherChecked) {
            dispatch(removeSelectedProduct(id)); // Uncheck if no other product in the category is checked
          }
        } else {
          dispatch(removeSelectedProduct(id)); // Uncheck if there are no other products
        }
      } else {
        dispatch(removeSelectedProduct(id)); // Normal product, just remove it
      }
    }
  };

  // Handle checkbox change for entire category
  const handleCategoryCheckboxChange = (
    categoryProducts: any[],
    isChecked: boolean,
  ) => {
    const updatedProducts = [...selectedProducts];

    categoryProducts.forEach((product) => {
      const isSelectorAllMandatory =
        product.SelectorAll === "selectorAllMandatory";
      const isSelectorCategoryMandatory =
        product.selectorCategory === "selectorCategoryMandatory";

      if (isChecked) {
        if (!updatedProducts.includes(product._id)) {
          updatedProducts.push(product._id);
        }
      } else {
        if (!isSelectorAllMandatory) {
          const index = updatedProducts.indexOf(product._id);
          if (index > -1) {
            updatedProducts.splice(index, 1);
          }
        }
      }
    });

    // Dispatch the action to update the selectedProducts in the store
    dispatch(updateSelectedProducts(updatedProducts));
  };

  useEffect(() => {
    if (!products) return;

    Object.keys(products).forEach((categoryName) => {
      const categoryProducts = products[categoryName];
      categoryProducts.forEach((product: any) => {
        const shouldSelect =
          product.SelectorAll === "selectorAllMandatory" ||
          (product.selectorCategory === "selectorCategoryMandatory" &&
            categoryProducts.some(
              (p: { _id: React.Key; SelectorAll: string }) =>
                p._id !== product._id &&
                (p.SelectorAll === "selectorAllMandatory" ||
                  selectedProducts.includes(p._id)),
            ));

        if (shouldSelect && !selectedProducts.includes(product._id)) {
          dispatch(addSelectedProduct(product._id));
        }
      });
    });
  }, [products, selectedProducts, dispatch]);

  const clearSelectedProducts = () => {
    localStorage.removeItem("selectedProducts");
    // Optionally, you can dispatch an action to update the Redux state as well
    dispatch(updateSelectedProducts([])); // Clear the Redux state too
  };

  return (
    <div>
      <div>
        {/* <button onClick={clearSelectedProducts}>Clear Selected Products</button> */}
        <div className="text-extrabold mb-4 text-2xl text-white">
          Total Selected Item(s):
          <span
            // onClick={() => router.push(`/customer/savings-purpose/make-payment`)}
            className="ml-2 cursor-pointer border-2 border-white px-4 text-xl text-white hover:text-blue-500"
          >
            {selectedProducts?.length}
          </span>
        </div>
        <CustomButton
          label="Pay for Selected Item(s)"
          type="button"
          style="bg-white text-bold mb-2 text-[15px] py-3 px-2 text-black hover:text-white hover:bg-[#EAAB40] rounded-md flex-1"
          onButtonClick={() =>
            router.push(`/customer/savings-purpose/make-payment`)
          }
        />
      </div>
      {products &&
        Object.keys(products).map((categoryName, index) => {
          const categoryProducts = products[categoryName];
          const allChecked = categoryProducts.every(
            (product: any) =>
              product.SelectorAll === "selectorAllMandatory" ||
              selectedProducts.includes(product._id),
          );

          return (
            <div
              key={categoryName}
              style={{
                borderRadius: index === 0 ? "10px" : "0",
                background:
                  index === 0
                    ? "linear-gradient(to bottom, #EAAB40 50%, transparent 50%)"
                    : "none",
              }}
            >
              <div className="flex items-center pl-4">
                <h2 className="text-bold text-white">
                  Category: {categoryName}
                </h2>
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={allChecked}
                  onChange={(e) =>
                    handleCategoryCheckboxChange(
                      categoryProducts,
                      e.target.checked,
                    )
                  }
                />
              </div>
              <div className="scroll-container">
                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                  {categoryProducts.map((purpose: any) => (
                    <ProductCard
                      key={purpose._id}
                      product={purpose}
                      onCheckboxChange={(id, isChecked) =>
                        handleCheckboxChange(id, isChecked, purpose)
                      }
                      isChecked={
                        purpose.SelectorAll === "selectorAllMandatory" ||
                        selectedProducts.includes(purpose._id)
                      }
                    />
                  ))}
                </ScrollMenu>
              </div>
            </div>
          );
        })}
    </div>
  );
};

// const ProductCard = ({
//   product,
//   onCheckboxChange,
//   isChecked,
// }: {
//   product: any;
//   onCheckboxChange: (id: React.Key, isChecked: boolean) => void;
//   isChecked: boolean;
// }) => {
//   const router = useRouter();
//   const truncateDescription = (description: string, wordLimit: number) => {
//     const words = description.split(" ");
//     return (
//       words.slice(0, wordLimit).join(" ") +
//       (words.length > wordLimit ? "..." : "")
//     );
//   };

//   const renderQuantityOptions = () => {
//     if (product.quantity === "Nill") {
//       return <option value="Nill">Nill</option>;
//     }
//     return Array.from({ length: product.quantity }, (_, i) => (
//       <option key={i + 1} value={i + 1}>
//         {i + 1}
//       </option>
//     ));
//   };

//   const handleShare = () => {
//     console.log(123);
//     if (navigator.share) {
//       navigator
//         .share({
//           files: product.imageUrl,
//           title: product.purposeName,
//           text: product.description,
//           url: `${window.location.origin}/customer/savings-purpose/${product._id}`,
//         })
//         .then(() => console.log("Successful share"))
//         .catch((error) => console.log("Error sharing", error));
//     } else {
//       // Fallback for desktop
//       alert(
//         "Web Share API is not supported on this browser. Please use the manual share buttons.",
//       );
//     }
//   };

//   return (
//     <Link href={`/customer/savings-purpose/${product._id}`}>
//       <div className="">
//         <input
//           className="ml-4"
//           type="checkbox"
//           checked={isChecked}
//           onChange={(e) => onCheckboxChange(product._id, e.target.checked)}
//         />
//         <div className="product-card">
//           <div className="checkbox-container" style={{ marginLeft: "8px" }}>
//             {/* <input
//             type="checkbox"
//             checked={isChecked}
//             onChange={(e) => onCheckboxChange(product._id, e.target.checked)}
//           /> */}
//           </div>
//           <div className="image-section h-[40%]">
//             <Image
//               height={100}
//               width={150}
//               src={product.imageUrl}
//               alt={product.purposeName}
//               className="product-image p-4"
//             />
//             <div
//               className="icon-container"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div>
//                 <FaShareAlt className="icon" onClick={handleShare} />
//               </div>

//               <FaBookmark className="icon" />
//             </div>
//           </div>
//           <div className="info-section bg-ajo_orange text-black">
//             <h3 className="product-name">{product.purposeName}</h3>
//             <div
//               className="product-price-row"
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <p className="product-price">
//                 NGN{AmountFormatter(product.amount)}
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   marginLeft: "auto",
//                 }}
//               >
//                 <label
//                   htmlFor={`quantity-${product._id}`}
//                   style={{ fontSize: "0.9rem", marginBottom: "4px" }}
//                 >
//                   Qty
//                 </label>
//                 {product.merchantQuantity}
//                 {/* <select id={`quantity-${product._id}`} className="quantity-dropdown">
//               {renderQuantityOptions()}
//             </select> */}
//               </div>
//             </div>

//             <p className="product-description">
//               {truncateDescription(product.description, 15)}
//             </p>
//             <a
//               href={`/customer/savings-purpose/${product._id}`}
//               className="read-more"
//             >
//               Read more
//             </a>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

const ProductCard = ({
  product,
  onCheckboxChange,
  isChecked,
}: {
  product: any;
  onCheckboxChange: (id: React.Key, isChecked: boolean) => void;
  isChecked: boolean;
}) => {
  const router = useRouter();

  const truncateDescription = (description: string, wordLimit: number) => {
    const words = description.split(" ");
    return (
      words.slice(0, wordLimit).join(" ") +
      (words.length > wordLimit ? "..." : "")
    );
  };

  const renderQuantityOptions = () => {
    if (product.quantity === "Nill") {
      return <option value="Nill">Nill</option>;
    }
    return Array.from({ length: product.quantity }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ));
  };

  // URL for sharing
  const shareUrl = `${window.location.origin}/customer/savings-purpose/${product._id}`;

  return (
    <>
      <Head>
        {/* Dynamic Title and Meta Tags for Open Graph */}
        <title>{product.purposeName}</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.href}`} />
        <meta property="og:title" content={product.purposeName} />
        <meta property="og:description" content={product.description} />
        <meta
          property="og:image"
          content={`https://res.cloudinary.com/dgoeed5be/image/upload/v1726058163/thrift/i04saferxaf5yuvpjahv.png`}
        />
        <meta property="og:image:alt" content={product.purposeName} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.purposeName} />
        <meta name="twitter:description" content={product.description} />
        <meta
          name="twitter:image"
          content={`https://res.cloudinary.com/dgoeed5be/image/upload/v1726058163/thrift/i04saferxaf5yuvpjahv.png`}
        />
      </Head>
      <Link href={shareUrl}>
        <div className="">
          <input
            className="ml-4"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onCheckboxChange(product._id, e.target.checked)}
          />
          <div className="product-card">
            <div className="image-section h-[40%]">
              <Image
                height={100}
                width={150}
                src={product.imageUrl}
                alt={product.purposeName}
                className="product-image p-4"
              />
              <div className="social-share-container mt-4">
                <FacebookShareButton url={shareUrl} hashtag="#ProductShare">
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={product.purposeName}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={product.purposeName}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <LinkedinShareButton
                  url={shareUrl}
                  title={product.purposeName}
                  summary={product.description}
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </div>
            </div>
            <div className="info-section bg-ajo_orange text-black">
              <h3 className="product-name">{product.purposeName}</h3>
              <div
                className="product-price-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p className="product-price">
                  NGN{AmountFormatter(product.amount)}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "auto",
                  }}
                >
                  <label
                    htmlFor={`quantity-${product._id}`}
                    style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                  >
                    Qty
                  </label>
                  {product.merchantQuantity}
                </div>
              </div>

              <p className="product-description">
                {truncateDescription(product.description, 15)}
              </p>
              <a
                href={`/customer/savings-purpose/${product._id}`}
                className="read-more"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

interface categoryToSHowProps {
  categoryToshow: string;
  merchantNumber: string;
}

const App = ({ categoryToshow, merchantNumber }: categoryToSHowProps) => {
  const organisationId = useSelector(selectOrganizationId);
  const user = useSelector(selectUser);
  // const [filteredPurposes, setFilteredPurposes] = useState([]);

  const { client } = useAuth();

  const {
    data: allPurpose,
    isLoading: isLoadingAllPurpose,
    refetch: refetchAllPurpose,
  } = useQuery({
    queryKey: ["allPurpose"],
    queryFn: async () => {
      return client
        .get(`/api/purpose`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    staleTime: 5000,
  });

  // console.log(allPurposeInhouse, "inhouse");

  const inhousePurpose = allPurpose?.filter(
    (purpose: { visibility: string; assignedCustomers: string | string[] }) =>
      purpose.assignedCustomers?.includes(user?._id) &&
      purpose.visibility === "inhouse",
  );
  const generalPurpose = allPurpose?.filter(
    (purpose: { visibility: string }) => purpose.visibility === "general",
  );

  const filteredPurposes =
    categoryToshow === "general" ? generalPurpose : inhousePurpose;

  // const handleSearch = useCallback(() => {
  //   if (allPurpose && merchantNumber) {
  //     const filtered = allPurpose.filter((item) =>
  //       item.organisation.accountNumber.includes(merchantNumber),
  //     );

  //     // Only update the state if filtered results are different
  //     if (JSON.stringify(filtered) !== JSON.stringify(filteredPurposes)) {
  //       setFilteredPurposes(filtered);
  //     }
  //   }
  // }, [allPurpose, merchantNumber, filteredPurposes]);

  // useEffect(() => {
  //   handleSearch();
  // }, [merchantNumber]);

  const groupedPurposes = filteredPurposes?.reduce(
    (acc: { [x: string]: any[] }, purpose: { category: { name: any } }) => {
      const categoryName = purpose.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(purpose);
      return acc;
    },
    {} as Record<string, PurposeProps[]>,
  );

  return (
    <div className="App">
      <ProductHorizontalScroll products={groupedPurposes} />
    </div>
  );
};

export default App;
