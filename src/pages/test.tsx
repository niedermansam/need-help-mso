import { useEffect } from "react";
import { api } from "../utils/api";

export default function AirtablePage() {
  const connectTags = api.tag.connectCategories.useMutation();

  useEffect(() => {
    connectTags.mutate();
  }, []);

  return <p>Syncing Airtable data...</p>;
}
