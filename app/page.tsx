import nextDynamic from 'next/dynamic';
import MapWrapper from './components/MapWrapper';

export const dynamic = 'force-dynamic';

const Page = ({ setCenter }) => {
  return <><TopBar setCenter={setCenter} /><MapWrapper /></>;
};

export default Page;
