export default function DemoDataPopup() {
  return (
    <div className="flex items-center justify-between gap-x-6 bg-red-600 px-6 py-2.5 sm:pr-3.5 lg:pl-8 mb-5">
      <p className="text-sm leading-6 text-white">
        <a href="#">
          <strong className="font-semibold">Demo data</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Je kijkt op dit moment naar demo data omdat de API niet bereikbaar is.
        </a>
      </p>
    </div>
  );
}
