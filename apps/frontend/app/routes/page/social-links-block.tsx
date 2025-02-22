import type { SocialLink, SocialLinksBlock } from "@fxmk/shared";
import {
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  BlueskyIcon,
  RssIcon,
} from "~/components/icons";
import { Link } from "~/components/link";

export function SocialLinksBlock({
  socialLinks,
}: {
  socialLinks: SocialLinksBlock["socialLinks"];
}) {
  return (
    <div className="mt-6 flex gap-6">
      {socialLinks
        .filter((sl) => typeof sl === "object")
        .map((socialLink) => (
          <SocialLink
            key={socialLink.id}
            to={socialLink.url}
            icon={getSocialIcon(socialLink.platform)}
          />
        ))}
    </div>
  );
}

export function getSocialIcon(platform: SocialLink["platform"]) {
  switch (platform) {
    case "instagram":
      return InstagramIcon;
    case "github":
      return GitHubIcon;
    case "linkedin":
      return LinkedInIcon;
    case "email":
      return MailIcon;
    case "bluesky":
      return BlueskyIcon;
    case "rss":
      return RssIcon;
    default:
      throw new Error(`Unsupported social platform: ${platform}`);
  }
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}
