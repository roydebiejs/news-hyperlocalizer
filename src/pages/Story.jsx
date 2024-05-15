export default function Story() {
  const id = window.location.pathname.split("/").pop();
  return <>{id}</>;
}
