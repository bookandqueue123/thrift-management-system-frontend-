import Link from "next/link";

export default function TemporaryPassword() {
  return (
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
      <div>
        <p className=" mb-12 mt-2 pr-4 text-xl text-ajo_orange">
          A temporary password has been sent to your registered email address,
          Kindly use the password to Sign In to Ajo.
        </p>
        <p className="pb-16 text-sm text-white">
          Please note, the password expires in{" "}
          <span className="text-extrabold text-xl text-white">20 minutes</span>
        </p>
        <Link href={"https://gmail.com/"}>
          <button
            type="submit"
            className="mx-16 mt-12 w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
          >
            Open my mail
          </button>
        </Link>
      </div>
    </section>
  );
}
