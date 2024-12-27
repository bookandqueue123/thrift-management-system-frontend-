import { apiUrl } from "@/api/hooks/useAuth";
import SinglePurposePage from "@/modules/customer/SinglePurposePage";
import axios from "axios";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

type Props = {
  params: { singlePurpose: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.singlePurpose;

  // fetch data
  const product = await axios.get(
    `${apiUrl}api/purpose/${params.singlePurpose}`,
  );

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.data.purposeName,
    openGraph: {
      images: [product.data.imageUrl[0], ...previousImages],
      description: product.data.description.substring(0, 200),
      // url: ``,
    },
    twitter: {
      card: "summary_large_image",
      creator: "Finkia",
      description: product.data.description.substring(0, 200),
      images: [product.data.imageUrl[0]],
      title: product.data.purposeName,
      site: "staging.finkia",
    },
  };
}


export default function Page({ params }: any) {
  return(
    <div>
      <Suspense>
      <SinglePurposePage />;
      </Suspense>
    </div>
  )
}
