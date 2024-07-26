import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { FaShareAlt, FaBookmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import Image from 'next/image';
import { useAuth } from '@/api/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectOrganizationId, selectUser } from '@/slices/OrganizationIdSlice';
import { PurposeProps } from '@/types';
import { getLetterFromIndex } from '@/utils/LetterIndex';
import Link from 'next/link';
// import './App.css';

const ProductCard = ({ product }: {product: any}) => {
  return (
    <Link href={`/customer/savings-purpose/${product._id}`}>
    <div className="product-card">
      <div className="image-section">
        <Image
        height={81}
        width={219.25} 
        src={product.imageUrl}
         alt={product.purposeName}
          className="product-image" />
        <div className="icon-container">
          <FaShareAlt className="icon" />
          <FaBookmark className="icon" />
        </div>
      </div>
      <div className="info-section bg-ajo_orange text-black">
        <h3 className="product-name ">{product.purposeName}</h3>
        <p className="product-price ">NGN{product.amount}</p>
        <p className="product-description">{product.description}</p>
        <a href="#" className="read-more">Read more</a>
      </div>
    </div>
    </Link>
    
  );
};

const LeftArrow = () => {
  const { isFirstItemVisible, scrollPrev } = React.useContext(VisibilityContext);
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

const HalfBgCategoryName = ({ name }: {name: string}) => {
  const halfLength = Math.ceil(name.length / 2);
  return (
    <span className="half-bg" style={{ width: `${halfLength}ch` }}>
      {name}
    </span>
  );
};

const ProductHorizontalScroll = ({ products }: {products: any}) => {

  return (
    <div>
      <>
        
        {/* <p>Category A: Automobile and Gadget</p> */}
        
        {/* <div className="scroll-container">
            <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                {products?.map((product: { id: React.Key | null | undefined; }) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </ScrollMenu>
        </div> */}
       </>


       {products && Object.keys(products)?.map((categoryName, index) => (
  <div 
    key={categoryName}
    style={{
   borderRadius: index === 0 ? '10px' : '0',
      background: index === 0 ? 'linear-gradient(to bottom, #EAAB40 50%, transparent 50%)' : 'none'
    }}
  >
    <h3 className={`text-black text-center text-extrabold ${index === 0 ? 'block' : 'hidden'}`}>Featured Savings Purpose</h3>
    
    <h2 className='text-white text-bold pl-4'>Category {(getLetterFromIndex(index))}: {categoryName}</h2>
    <div className="scroll-container">
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {products[categoryName].map((purpose: { _id: React.Key | null | undefined; }) => (
          <ProductCard key={purpose._id} product={purpose} />
        ))}
      </ScrollMenu>
    </div>
  </div>
))}

    </div>

  );
};


const App = () => {
  const organisationId = useSelector(selectOrganizationId);
  const user = useSelector(selectUser)
  
  const {client} = useAuth()

  
  const {
    data: allPurpose,
    isLoading: isLoadingAllPurpose,
    refetch,
  } = useQuery({
    queryKey: ["allPurpose"],
    queryFn: async () => {
      return client
        .get(
          `/api/purpose?organisation=${organisationId}`,
          {},
        )
        .then((response) => {

          
          return response.data;
        })
        .catch((error) => {
     
          throw error;
        });
    },
    staleTime: 5000,
  });
  const filteredPurposes = allPurpose?.filter((purpose: { assignedCustomers: string | string[]; }) => purpose.assignedCustomers.includes(user._id));
  const groupedPurposes = filteredPurposes?.reduce((acc: { [x: string]: any[]; }, purpose: { category: { name: any; }; }) => {
    const categoryName = purpose.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(purpose);
    return acc;
  }, {} as Record<string, PurposeProps[]>);
 
console.log(groupedPurposes)
 
  const automobileCategoryPurpose = filteredPurposes?.filter((purpose: { category: { name: string | string[]; }; }) => purpose.category.name.includes("Automobile"));
// console.log(automobileCategoryPurpose);
  return (
    <div className="App">
      <ProductHorizontalScroll products={groupedPurposes} />
    </div>
  );
};

export default App;
