import { ComponentProps,  ComponentPropsWithoutRef, useState } from "react";
import NavBar from "../components/Navbar";
import React from "react";

type HeartIconProps = JSX.IntrinsicElements["svg"] & {
    primaryColor?: string;
    secondaryColor?: string;
};

const HeartIcon = ({className, primaryColor, secondaryColor}:HeartIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`icon-heart ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className="primary"
        style={{ fill: primaryColor }}
      />
      <path
        className="secondary"
        style={{ fill: secondaryColor }}
        d="M12.88 8.88a3 3 0 1 1 4.24 4.24l-4.41 4.42a1 1 0 0 1-1.42 0l-4.41-4.42a3 3 0 1 1 4.24-4.24l.88.88.88-.88z"
      />
    </svg>
  );
}

const FIRST_FEATURES = [
  {
    title: "Search Bar with for organizations and resources",
    description: "Search for resources by name, category, or tag.",
    status: "TODO",
    priority: "MEDIUM",
  },
  {
    title: "Add, edit, and delete resources and organizations",
    description: "Add resources to the database.",
    status: "DONE",
    priority: "COMPLETED",
  },
  {
    title: "Custom user profiles/pages",
    description:
      'Allow users to save their most referenced resources to a "Favorites" Page. Allow service providers to add their organization to the database, and social workers to save multiple lists of resources that are often used together.',
    status: "TODO",
    priority: "MEDIUM",
  },
  {
    title: "List resources and organizations by category",
    description: "Add resources to the database.",
    status: "TODO",
    priority: "HIGH",
  },
];

const SECOND_FEATURES = [
  {
    title: "Bug Hunt.",
    description: "Add resources to the database.",
    status: "DONE",
  },
  {
    title: "Filter and sort by tag.",
    description: "Filter resources by category or tag.",
    status: "TODO",
    priority: "HIGH",
  },
  {
    title: 'Add a "Contact Us" page.',
    description: "Add resources to the database.",
    status: "TODO",
    priority: "LOW",
  },
  {
    title: 'Create a "How to Use" page.',
    description: "Add resources to the database.",
    status: "TODO",
    priority: "HIGH",
  },
];

const statusSortObject = {
  DONE: 0,
  TODO: 1,
  IN_PROGRESS: 2,
};

const prioritySortObject = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
  COMPLETED: 3,
};

type priorityOptions = keyof typeof prioritySortObject;
type statusOptions = keyof typeof statusSortObject;

const sortFeatures = (a: Feature, b: Feature) => {
  if (a.status === b.status) {
    const aPriori = prioritySortObject[a.priority as priorityOptions];
    return (
      prioritySortObject[a.priority as priorityOptions] -
      prioritySortObject[b.priority as priorityOptions]
    );
  }
  return (
    statusSortObject[a.status as statusOptions] -
    statusSortObject[b.status as statusOptions]
  );
};

type Feature = (typeof FIRST_FEATURES)[number];

function FeatureDetails({ feature }: { feature: Feature }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="m-2 mx-6 w-full p-2">
      <div>
        <h2
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex cursor-pointer items-center text-lg font-light text-stone-800"
        >
          {" "}
          <HeartIcon className="mr-2 w-8" primaryColor={feature.status === "DONE" ? "#E11D48" : 'gray'} secondaryColor="white" />{" "}
          {feature.title}
        </h2>
        <div
          className={`flex flex-wrap justify-between text-sm text-stone-600 ${
            isExpanded ? "hidden" : ""
          }`}
        >
          <div className="mb-1 flex w-full">
            <p className="basis-40">Status: {feature.status}</p>
            {feature.status !== "DONE" ? (
              <p>Priority: {feature.priority}</p>
            ) : null}
          </div>
          <p
            className={` w-full font-light text-stone-700 ${
              isExpanded ? "hidden" : ""
            }`}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <div className="flex w-fit max-w-md flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-stone-600">Feature Details</h1>

      {features.sort(sortFeatures).map((feature, index) => {
        return <FeatureDetails feature={feature} />;
      })}
    </div>
  );
}

const TIMELINE = [
  {
    title: "Start Rebuild",
    date: "March 2023",
    description:
      "Begin building a production ready version of the application using Next.js",
  },
  {
    title: "Closed Beta Test",
    date: "May 2023",
    description: "Role out a closed beta test to a small group of users.",
  },
  {
    title: "Open Beta Test",
    date: "Sept. 2023",
    description:
      "Open beta test to the public, designed for service providers and professionals.",
  },
  {
    title: "Public Launch",
    date: "Q1 2024",
    description: "Launch the application to the general public.",
  },
  {
    title: "Stable Launch",
    date: "Q3 2024",
    description:
      "Launch a feature complete version of the application to the general public.",
  },
];

type TimelineItem = (typeof TIMELINE)[number];

export function Timeline({
  events,
  currentIndex,
}: {
  events: TimelineItem[];
  currentIndex: number;
}) {
  return (
    <div className="flex p-6">
      {events.map((event, index) => {
        return (
          <div className="relative ml-3 w-96">
            <div className="flex items-end justify-between px-4">
              <h2 className=" min-w-fit font-semibold text-stone-600">
                {event.title}
              </h2>
              <div className="min-w-fit">
                <p className="text-xs text-stone-400">
                  {index === currentIndex - 1
                    ? "in progress"
                    : index < currentIndex - 1
                    ? "completed"
                    : "projected"}
                </p>
                <p className="mb-0.5 basis-20 text-sm text-rose-600">
                  {event.date}
                </p>
              </div>
            </div>
            <div className={` relative flex h-4 `}>
              <span
                className={`absolute z-10 rounded-full ${
                  // pinging dot
                  index <= currentIndex
                    ? "-left-3 -bottom-1 h-4 w-4"
                    : "bottom-[0px] -left-3 h-2 w-2"
                }
                border-4 border-rose-500 bg-rose-300 
               ${
                 index === currentIndex
                   ? "animate-ping delay-200 duration-500"
                   : ""
               }`}
              ></span>
              <span
                className={`absolute z-10 ${
                  // normal dot
                  index <= currentIndex
                    ? "-left-3 -bottom-1 h-4 w-4"
                    : "bottom-[0px] -left-3 h-2 w-2"
                } rounded-full border-4 border-rose-500 bg-rose-300 `}
              ></span>
              <span
                className={`absolute z-0 w-[calc(100%+15px)] ${
                  index <= currentIndex - 1
                    ? " top-2 border-b-8 border-rose-400"
                    : " top-2.5 border-b-4 border-rose-300"
                }`}
              ></span>
            </div>

            <div className="px-3 py-1">
              <p className="text-sm text-stone-500">{event.description}</p>
            </div>
          </div>
        );
      })}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="icon-cheveron-down relative right-4 -bottom-[9.5px]  z-10 h-20 w-20 rotate-90 text-rose-300"
        style={{
          stroke: "currentColor",
          fill: "currentColor",
        }}
      >
        <path
          className="secondary"
          fill-rule="evenodd"
          d="M8.7 13.7a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L12 10.42l-3.3 3.3z"
        />
      </svg>
    </div>
  );
}

export default function ProjectTimeline() {
  return (
    <div>
      <NavBar />
      <h1 className="pt-20 text-4xl">Project Timeline</h1>
      <div>
        <Timeline events={TIMELINE} currentIndex={1} />
        <div className="mb-20 flex w-full justify-center">
          <div className="rounded-lg border border-stone-200 p-6 shadow-lg">
            <FeatureList features={FIRST_FEATURES} />
          </div>
        </div>
      </div>
    </div>
  );
}
