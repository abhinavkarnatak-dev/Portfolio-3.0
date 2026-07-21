import { redirect } from "next/navigation";

/** Clean-URL alias for the home experience section (see SectionLink). */
export default function ExperienceIndex() {
  redirect("/#experience");
}
