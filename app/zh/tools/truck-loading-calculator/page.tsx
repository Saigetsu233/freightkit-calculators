import { RegionalFreightPage } from "../../../components/RegionalFreightPage";
import { regionalFreightConfigs, regionalMetadata } from "../../../lib/regional-freight";

const config = regionalFreightConfigs.zh;
export const metadata = regionalMetadata(config);

export default function ChineseTruckLoadingPage() {
  return <RegionalFreightPage config={config} />;
}
