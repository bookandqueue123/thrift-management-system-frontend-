import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-ajo_offWhite">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ajo_darkBlue">
          404 - Organization or Account or Page Not Found
        </h1>
        <p className="mt-4 text-ajo_darkBlue">
          The page Or Account or Organization you are looking for does not exist. Please contact your the Finkia admin for it to be activated
        </p>
        <Link
          href="/"
          className="ripple mt-6 inline-block rounded-md bg-ajo_blue px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow transition hover:shadow-lg focus:outline-none"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
