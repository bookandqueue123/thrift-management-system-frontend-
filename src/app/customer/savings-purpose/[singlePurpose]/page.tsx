import SinglePurposePage from "@/modules/customer/SinglePurposePage";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: "Staging Title",
    openGraph: {
      images: [
        "https://res.cloudinary.com/dgoeed5be/image/upload/v1726058163/thrift/i04saferxaf5yuvpjahv.png",
        ...previousImages,
      ],
    },
  };
}

export default function Page({ params }: any) {
  return <SinglePurposePage />;
}
