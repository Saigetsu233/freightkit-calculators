import type { Metadata } from "next";
import { RegionalHubPage, regionalHubMetadata } from "../../components/RegionalHubPage";

type RouteProps = { params: Promise<{ locale: string; section: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { locale, section } = await params;
  return regionalHubMetadata(locale, section);
}

export default async function LocalizedHubRoute({ params }: RouteProps) {
  const { locale, section } = await params;
  return <RegionalHubPage locale={locale} section={section} />;
}
