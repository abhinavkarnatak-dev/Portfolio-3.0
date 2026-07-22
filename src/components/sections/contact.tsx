import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { SectionMeta } from "@/components/ui/section-meta";
import { SocialLinks } from "@/components/ui/social-links";
import { WordReveal } from "@/components/ui/word-reveal";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-14">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionMeta index="05" title="Contact" meta="Replies fast" accent="violet" />
        <WordReveal
          words={[{ t: "LET'S" }, { t: "BUILD", mark: "violet" }, { t: "SOMETHING." }]}
          className="mt-8 font-display text-heading text-foreground uppercase"
        />
        <Reveal>
          <p className="mt-5 max-w-xl text-muted">
            Hiring for an SDE or AI role, or want to talk shop about something I&apos;ve built? Send
            a message here, or email me directly at{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-foreground underline decoration-violet underline-offset-4 transition-colors hover:text-violet"
            >
              {site.email}
            </a>
            .
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <ContactForm />
        </Reveal>

        <Reveal className="mt-12">
          <SocialLinks />
        </Reveal>
      </div>
    </section>
  );
}
