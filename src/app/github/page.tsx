import { redirect } from "next/navigation";

/** Clean-URL alias for the home GitHub-activity section (see SectionLink). */
export default function GithubIndex() {
  redirect("/#github");
}
