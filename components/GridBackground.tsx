export function GridBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-size-[40px_40px] bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </>
  );
}