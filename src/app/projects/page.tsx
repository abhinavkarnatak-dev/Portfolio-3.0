import { redirect } from "next/navigation";

/** Clean-URL alias for the home projects section (see SectionLink). */
export default function ProjectsIndex() {
  redirect("/#projects");
}
