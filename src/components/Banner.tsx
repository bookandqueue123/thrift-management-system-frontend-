import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <section className="mb-4 md:mb-0 md:w-1/2">
      <Link href="/">
        <Image
          src="/Ajo.svg"
          alt="Ajo Logo"
          className="relative -left-[2rem] -top-[1rem] m-0"
          width={158}
          height={140}
          loading="eager"
        />
      </Link>

      <div className="mx-4 mt-4">
        <span className="mb-4 flex items-center gap-2">
          <Image
            src="/ellipse.svg"
            alt="bullet point"
            width={25}
            height={40}
            loading="lazy"
          />
          <p className="text-3xl font-bold text-ajo_blue">Grow your Money</p>
        </span>
        <span className="flex items-center gap-2">
          <Image
            src="/ellipse.svg"
            alt="bullet point"
            width={25}
            height={40}
            loading="lazy"
          />
          <p className="text-3xl font-bold text-ajo_blue">Save your Future.</p>
        </span>
      </div>

      <Image
        src="/coins_.svg"
        alt="coins growing like a tree"
        className="relative mt-8 w-[90%]"
        width={435}
        height={234}
        loading="lazy"
      />

      <div className="mt-8">
        <p className="text-center text-xs font-semibold text-ajo_orange md:text-base">
          Powered by Raoatech
        </p>
        <p className="text-center text-xs text-ajo_orange md:text-base">
          ©{currentYear}
        </p>
      </div>
    </section>
  );
};

export default Banner;
