import NavBar from "../../components/Nav";

export default function AboutPage() {
  return (
    <div>
      <NavBar />
      <div className="relative mx-12 mb-20 max-w-4xl pt-16 text-lg font-light text-stone-800 md:mx-auto md:pl-6">
        <h1 className=" mb-2 text-5xl">About The App</h1>
        <h3 className="mb-4 text-2xl text-stone-500">
          Hi there! My name is Sam!
        </h3>
        <p className="my-2 leading-relaxed">
          I&apos;m the developer behind Need Help Missoula, and I like to think
          that software can make the world a better place (despite the best
          efforts of... <span className="italic">some</span> companies). The
          project was born out of a desire to make life a little easier for the
          hundred of case workers, social workers, and other professionals who
          work tirelessly to help people in need. I hope that this project can
          be a useful tool for them, and that it can help people who need a
          helping hand find the resources they need.
        </p>
        <h2 className="text-2xl font-semibold text-stone-600">
          Who&apos;s Need Help Missoula for?
        </h2>
        <p className="my-2 leading-relaxed">
          The inspiration for this project came from my wonderful partner,
          Kenzie, who works as a liaison of sorts between University students
          who are having trouble making ends meet and the resources that can
          help them. She was tasked with working on a spread sheet of resources,
          organizations, and contacts that could help students in need. I&apos;m
          a computer nerd and software developer, and I realized there{" "}
          <span>has to be</span> a better way. I started tinkering around with a
          web application that would allow her and other people in her position
          to easily sort, filter, and search through a database resources, save
          the resources and organizations she finds herself looking up again and
          again, and share the resources with other people who could use them.
        </p>
        <h2 className="text-2xl font-semibold text-stone-600">
          Why am I building this?
        </h2>
        <p className="my-2 leading-relaxed">
          As I started showing the project to other people, I realized that I
          might be on to something here. There are hundreds of nonprofits,
          organizations, and other groups in Missoula that are doing amazing
          work to help people in need. So many resources, in fact, that it can
          be hard to find the exact right one. On top of that, many of these
          organizations maintain some sort of Google Document, Spreadsheet, or
          other list of resources that they use often, but these lists are a
          nightmare to maintain, and the simple fact that every year a few dozen
          people around the city spend hours and hours of their time updating
          these lists means those people have less time to spend doing what
          they&apos;re there for: Helping People. I think that a web application
          that can help people find the resources they need, and help
          organizations and groups maintain their lists of resources, could be a
          huge help to everyone involved.
        </p>{" "}
        <h2 className="text-2xl font-semibold text-stone-600">
          What makes Need Help Missoula different?
        </h2>
        <p className="my-2 leading-relaxed">
          There&apos;s a thousand different directories of resources and
          nonprofits, but most public facing versions are geared towards
          fundraising, not care providers. Need Help Missoula is a directory for
          people in need, and the professional&apos;s who help those people. As
          such, the app will have features that similar directories don&apos;s
          or can&apos;t. For example, the app will allow users to save
          resources, and share them with other people. It will also allow users
          to filter and sort resources by a variety of criteria like funding type, communities served, and specific services provided. Eventually, I hope to integrate a form to allow users to inform the maintainers of the application that there is old or bad data or information on a page.
        </p>
      </div>
    </div>
  );
}
