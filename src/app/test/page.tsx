import React from "react";
import { HighlightedText } from "./HighlightedText";

const test = {
  text: "this is a test phrase that will be used to test the highlighting",
  highlight: "test",
};

function Page() {
  return <HighlightedText text={test.text} highlight={test.highlight} />;
}

export default Page;
