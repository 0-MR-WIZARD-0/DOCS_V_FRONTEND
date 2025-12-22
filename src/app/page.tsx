import { getSections } from "./lib/getSections";
import HomeClient from "./home/HomeClient";

export default async function Page() {
  const sections = await getSections();

  return <HomeClient sections={sections} />;
}