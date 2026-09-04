import { RegionalFreightPage } from "../../../components/RegionalFreightPage";
import { regionalFreightConfigs, regionalMetadata } from "../../../lib/regional-freight";

const config = regionalFreightConfigs.de;
export const metadata = regionalMetadata(config);

export default function GermanLoadMeterPage() {
  return <RegionalFreightPage config={config} />;
}
