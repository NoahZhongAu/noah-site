/** The fixed --bg wash and grain overlay every section sits on. Rendered once in the root layout. */
export function BackgroundLayers() {
  return (
    <>
      <div className="bg-wash" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />
    </>
  );
}
