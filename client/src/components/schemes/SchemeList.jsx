import SchemeCard from './SchemeCard';
export default function SchemeList({ schemes = [] }) { return <section>{schemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)}</section>; }