import { RegionalFreightPage } from "../../../components/RegionalFreightPage";
import { regionalFreightConfigs, regionalMetadata } from "../../../lib/regional-freight";

const config = regionalFreightConfigs.ja;
export const metadata = regionalMetadata(config);

export default function JapaneseTruckLoadingPage() {
  return <RegionalFreightPage config={config} />;
}
