import Image from "next/image";

const Banner = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <section className="mb-4 md:w-1/2">
      <Image
        src="./Ajo.svg"
        alt="Ajo Logo"
        className="relative -left-[2rem] -top-[1rem] m-0"
        width={158}
        height={140}
        loading="lazy"
      />

      <div className="mx-4 mt-4">
        <span className="mb-4 flex items-center gap-2">
          <Image
            src="./ellipse.svg"
            alt="bullet point"
            width={25}
            height={40}
            loading="lazy"
          />
          <p className="text-ajo_blue text-3xl font-bold">Grow your Money</p>
        </span>
        <span className="flex items-center gap-2">
          <Image
            src="./ellipse.svg"
            alt="bullet point"
            width={25}
            height={40}
            loading="lazy"
          />
          <p className="text-ajo_blue text-3xl font-bold">Save your Future.</p>
        </span>
      </div>

      <Image
        src="./coins_.svg"
        alt="coins growing like a tree"
        className="relative mt-8 w-[120%]"
        width={435}
        height={234}
        loading="lazy"
      />

      <div className="mt-8">
        <p className="text-ajo_orange text-center text-xs font-semibold md:text-base">
          Powered by Raoatech
        </p>
        <p className="text-ajo_orange text-center text-xs md:text-base">
          ©{currentYear}
        </p>
      </div>
    </section>
  );
};

export default Banner;
