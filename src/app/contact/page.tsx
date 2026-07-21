import { redirect } from "next/navigation";

/** Clean-URL alias for the home contact section (see SectionLink). */
export default function ContactIndex() {
  redirect("/#contact");
}
