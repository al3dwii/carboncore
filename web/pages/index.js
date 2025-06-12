import Layout from '../src/components/Layout'
export default function Home(){
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">PRs analysed — 0</div>
        <div className="p-4 border rounded">kg CO₂ avoided — 0</div>
        <div className="p-4 border rounded">$ saved — 0</div>
        <div className="p-4 border rounded">Active tools — 0</div>
      </div>
    </Layout>
  );
}
