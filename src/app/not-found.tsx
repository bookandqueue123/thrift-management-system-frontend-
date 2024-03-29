import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-ajo_offWhite">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ajo_darkBlue">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-ajo_darkBlue">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <a className="ripple mt-6 inline-block rounded-md bg-ajo_blue px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow transition hover:shadow-lg focus:outline-none">
            Go to Home
          </a>
        </Link>
      </div>
    </div>
  );
}
