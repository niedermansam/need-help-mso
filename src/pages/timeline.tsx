import { SVGAttributes, useState } from "react";
import NavBar from "../components/Nav";
import React from "react";

type HeartIconProps = JSX.IntrinsicElements["svg"] & {
  primaryColor?: string;
  secondaryColor?: string;
  pulse: boolean;
};

type PhaseDetails = {
  title: string;
  description: string;
  features: Feature[];
};
const HeartIcon = ({
  className,
  primaryColor,
  secondaryColor,
  pulse,
}: HeartIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`icon-heart ${className || ""}`}
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
      {pulse && (
        <path
          className="secondary animate-pulse-sm "
          style={{ fill: secondaryColor }}
          d="M12.88 8.88a3 3 0 1 1 4.24 4.24l-4.41 4.42a1 1 0 0 1-1.42 0l-4.41-4.42a3 3 0 1 1 4.24-4.24l.88.88.88-.88z"
        />
      )}
    </svg>
  );
};

type FeatureProps = {
  title: string;
  description: string;
  status: "DONE" | "IN_PROGRESS" | "TODO";
  priority: "HIGH" | "MEDIUM" | "LOW" | "COMPLETED";
};

export const REBUILD_FEATURES: FeatureProps[] = [
  {
    title: "Add, edit, and delete resources and organizations",
    description: "Add resources to the database.",
    status: "DONE",
    priority: "COMPLETED",
  },
  {
    title: "Filter and sort by tag.",
    description:
      "Filter resources by category or tag. Allow users to mark tags as favorites and/or less interested, and sort resources by priority.",
    status: "TODO",
    priority: "HIGH",
  },
  {
    title: "Custom user profiles/pages and favorites list.",
    description:
      'Allow users to save their most referenced resources to a "Favorites" Page. Allow service providers to add their organization to the database, and social workers to save multiple lists of resources that are often used together.',
    status: "TODO",
    priority: "MEDIUM",
  },
  {
    title: "List resources and organizations by category.",
    description: "Add resources to the database.",
    status: "IN_PROGRESS",
    priority: "HIGH",
  },
];

export const REBUILD_DETAILS: PhaseDetails = {
  title: "Rebuild",
  description:
    "Rebuild the Minimum Viable Product from the ground up using scalable web technologies.",
  features: REBUILD_FEATURES,
};

export const CLOSED_BETA_FEATURES: FeatureProps[] = [
  {
    title: "Bug Hunt.",
    description:
      "Get feedback from users about what areas of the site work, what doesn't, and try to find as many bugs as possible before launching the open Beta version.",
    status: "TODO",
    priority: "HIGH",
  },
  {
    title: "Feature request and bug reporting forms.",
    description:
      "Allow users to submit feature requests and bug reports directly from the site.",
    status: "TODO",
    priority: "MEDIUM",
  },
  {
    title: 'Create a "How to Use" page.',
    description: "Add resources to the database.",
    status: "TODO",
    priority: "MEDIUM",
  },
  {
    title: "Search Bar with for organizations and resources",
    description: "Search for resources by name, category, or tag.",
    status: "TODO",
    priority: "LOW",
  },
  {
    title: "Allow service providers to save multiple lists of resources.",
    description:
      "Create functionality that will allow social workers or case managers to create a list of resources for their clients, save that list, and send it to their clients via text or email.",
    status: "TODO",
    priority: "HIGH",
  },
];

export const CLOSED_BETA_DETAILS: PhaseDetails = {
  title: "Closed Beta",
  description:
    "During this phase, the application will be shared with a small group of service providers in Missoula, and focus will shift for a time to filling out the database with resources, and organizations.",
  features: CLOSED_BETA_FEATURES,
};

export const OPEN_BETA_FEATURES: FeatureProps[] = [
  {
    title: "Bug Hunt.",
    description: "Add resources to the database.",
    status: "TODO",
    priority: "LOW",
  },
  {
    title: 'Add a "Contact Us" page.',
    description: "Add resources to the database.",
    status: "TODO",
    priority: "LOW",
  },
  {
    title: "Allow users to filter by community/identity.",
    description:
      "Add functionality to hide or search for resources and organizations that only serve specific groups (e.g. UM students, veterans, people with disabilities, etc.)",
    status: "TODO",
    priority: "HIGH",
  },
];

const OPEN_BETA_DETAILS: PhaseDetails = {
  title: "Open Beta",
  description:
    "During this phase, the application will be shared with the public, and focus will shift to bug hunting and adding new features to filter resources and organizations and prevent the application from overwhelming users as the database grows.",
  features: OPEN_BETA_FEATURES,
};

const PUBLIC_LAUNCH_DETAILS: PhaseDetails = {
  title: "Public Launch",
  description:
    "Who knows. I'm not planning this far out yet. It depends on what the public response to the Beta version is like.",
  features: [
    {
      title: "The never ending hunt for bugs and optiminizations.",
      description: "Add resources to the database.",
      status: "TODO",
      priority: "LOW",
    },
  ],
};

const PHASE_DETAILS: PhaseDetails[] = [
  REBUILD_DETAILS,
  CLOSED_BETA_DETAILS,
  OPEN_BETA_DETAILS,
  PUBLIC_LAUNCH_DETAILS,
];

const statusSortObject = {
  DONE: 0,
  IN_PROGRESS: 1,
  TODO: 2,
};

const prioritySortObject = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
  COMPLETED: 3,
};

type statusOptions = keyof typeof statusSortObject;

const sortFeatures = (a: Feature, b: Feature) => {
  if (a.status === b.status) {
    return prioritySortObject[a.priority] - prioritySortObject[b.priority];
  }
  return statusSortObject[a.status] - statusSortObject[b.status];
};

type Feature = (typeof REBUILD_FEATURES)[number];

function HeartCheckmark({
  status,
  className,
}: SVGAttributes<SVGAElement> & { status: statusOptions; pulse?: boolean }) {
  // create a variable that holds a color value
  const darkColor = "#E11D48";
  const lightColor = "#FDA4AF";

  const primaryColor =
    status === "DONE"
      ? darkColor
      : status === "IN_PROGRESS"
      ? lightColor
      : "lightgray";

  return (
    <HeartIcon
      pulse={false}
      className={className}
      primaryColor={primaryColor}
      secondaryColor={status === "IN_PROGRESS" ? darkColor : "white"}
    />
  );
}

function FeatureDetails({ feature }: { feature: Feature }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="m-2 mx-6 w-full p-2">
      <div>
        <h2
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex cursor-pointer items-center text-lg font-light text-stone-800"
        >
          <HeartCheckmark
            className="mr-2 w-8"
            pulse={false}
            status={feature.status}
          />
          {feature.title}
        </h2>
        <div
          className={`text-md flex flex-wrap justify-between text-stone-600 ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          <p
            className={` w-full font-light text-stone-700 ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureList({
  phaseDetails: phaseDetails,
}: {
  phaseDetails: PhaseDetails;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center  text-stone-400">
      <h1 className="w-full text-3xl font-bold text-stone-600">
        {phaseDetails.title}
      </h1>
      <p className=" my-2 w-full">{phaseDetails.description}</p>
      <h2 className="w-full text-xl font-semibold text-stone-600">
        Important Tasks & Features
      </h2>
      <div className="ml-2 mr-6 mt-4 mb-4 flex w-full items-center justify-around text-xs">
        <span className="flex items-center">
          <HeartCheckmark className="h-5 w-5 mr-1" status="DONE" /> DONE
        </span>
        <span className="flex items-center">
          <HeartCheckmark className="h-5 w-5 mr-1" status="IN_PROGRESS" /> IN
          PROGRESS
        </span>
        <span className="flex items-center">
          <HeartCheckmark className="h-5 w-5 mr-1" status="TODO" /> TO DO
        </span>
      </div>
      {phaseDetails.features.sort(sortFeatures).map((feature) => {
        return <FeatureDetails key={feature.title} feature={feature} />;
      })}{" "}
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
  progress,
}: {
  events: TimelineItem[];
  progress: number;
}) {
  return (
    <div className="mb-4 flex overflow-x-scroll p-6 pb-12">
      {events.map((event, index) => {
        return (
          <div key={event.title} className="relative ml-3 w-[500px]">
            <div className="flex items-end justify-between px-4">
              <h2 className=" mr-4 min-w-[120px] font-semibold text-stone-600">
                {event.title}
              </h2>
              <div className="min-w-fit">
                <p className="text-xs text-stone-400">
                  {index === progress - 1
                    ? "in progress"
                    : index < progress - 1
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
                  index <= progress
                    ? "-left-3 -bottom-1 h-4 w-4"
                    : "bottom-[0px] -left-3 h-2 w-2"
                }
                border-4 border-rose-500 bg-rose-300 
               ${
                 index === progress
                   ? "animate-[ping_4s_infinite] delay-200"
                   : ""
               }`}
              ></span>
              <span
                className={`absolute z-10 ${
                  // normal dot
                  index <= progress
                    ? "-left-3 -bottom-1 h-4 w-4"
                    : "bottom-[0px] -left-3 h-2 w-2"
                } rounded-full border-4 border-rose-500 bg-rose-300 `}
              ></span>
              <span
                className={`absolute z-0 w-[calc(100%+15px)] ${
                  index <= progress - 1
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

function FeatureCarousel({ featureArray }: { featureArray: PhaseDetails[] }) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const handlePreviousFeatures = () => {
    if (currentFeature === 0) return;
    setCurrentFeature(currentFeature - 1);
  };

  const handleNextFeatures = () => {
    if (currentFeature === featureArray.length - 1) return;
    setCurrentFeature(currentFeature + 1);
  };
  return (
    <div className="mb-20 flex w-full items-center justify-center">
          <div
            className="cursor-pointer leading-3 text-stone-600 hover:text-stone-400"
            onClick={handlePreviousFeatures}
          >
            <button className="text-3xl font-bold leading-3">←</button>
            <p className="mx-0.5 text-xs font-light">back</p>
          </div>
      <div className="w-[500px] rounded-lg border border-stone-200 p-6 shadow-lg h-[600px]">
        <FeatureList
          phaseDetails={featureArray[currentFeature] || REBUILD_DETAILS}
        />{" "}

      </div>          <div
            className="cursor-pointer leading-3 text-stone-600 hover:text-stone-400"
            onClick={handleNextFeatures}
          >
            <button className="text-3xl font-bold leading-3 ">→</button>
            <p className="mx-0.5 text-xs font-light ">next</p>
          </div>
    </div>
  );
}

export default function ProjectTimeline() {
  return (
    <div>
      <NavBar />
      <h1 className="pt-20 pl-6 text-4xl font-light text-stone-700">
        Project Timeline
      </h1>
      <div>
        <Timeline events={TIMELINE} progress={1} />
        <FeatureCarousel featureArray={PHASE_DETAILS} />
      </div>
    </div>
  );
}
