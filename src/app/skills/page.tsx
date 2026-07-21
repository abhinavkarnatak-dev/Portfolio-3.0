import { redirect } from "next/navigation";

/** Clean-URL alias for the home skills section (see SectionLink). */
export default function SkillsIndex() {
  redirect("/#skills");
}
