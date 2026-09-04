import { RegionalFreightPage } from "../../../components/RegionalFreightPage";
import { regionalFreightConfigs, regionalMetadata } from "../../../lib/regional-freight";

const config = regionalFreightConfigs.fr;
export const metadata = regionalMetadata(config);

export default function FrenchFloorMetrePage() {
  return <RegionalFreightPage config={config} />;
}
