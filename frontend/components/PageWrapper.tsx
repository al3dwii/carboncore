export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-8 py-6">{children}</div>;  // keep existing padding
}
