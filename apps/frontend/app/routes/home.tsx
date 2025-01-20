import { useLoaderData } from "react-router";
import { tryGetPage } from "~/cms-data.server";
import { Container, Photos, SocialLink } from "~/components";
import { XIcon, InstagramIcon, GitHubIcon, LinkedInIcon } from "~/icons";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const result = await tryGetPage("home", "en");
  return { result };
}

export default function Home() {
  const { result } = useLoaderData<typeof loader>();
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Software designer, founder, and amateur astronaut.
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I’m Spencer, a software designer and entrepreneur based in New York
            City. I’m the founder and CEO of Planetaria, where we develop
            technologies that empower regular people to explore space on their
            own terms.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink to="#" aria-label="Follow on X" icon={XIcon} />
            <SocialLink
              to="#"
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              to="#"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              to="#"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
      <Container className="mt-12">
        <pre className="text-white">{JSON.stringify(result, null, 2)}</pre>
      </Container>
    </>
  );
}
