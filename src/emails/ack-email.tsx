import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { site } from "@/data/site";

/** Sent back to the visitor confirming their message reached me. */
export function AckEmail({ name, message }: { name: string; message: string }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`Got your message, ${name} - I'll reply soon`}</Preview>
      <Body
        style={{ backgroundColor: "#f4f4f5", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        <Container
          style={{
            margin: "40px auto",
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: "8px",
            padding: "32px",
          }}
        >
          <Heading as="h2" style={{ margin: "0 0 4px", fontSize: "18px", color: "#18181b" }}>
            Thanks for reaching out, {name}.
          </Heading>
          <Text style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "1.6", color: "#3f3f46" }}>
            Your message got through - I&apos;ll reply as soon as I can.
          </Text>
          <Hr style={{ margin: "20px 0", borderColor: "#e4e4e7" }} />
          <Text style={{ margin: "0 0 6px", fontSize: "12px", color: "#71717a" }}>
            For your records, here&apos;s what you sent:
          </Text>
          <Section>
            <Text
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#3f3f46",
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>
          <Hr style={{ margin: "20px 0", borderColor: "#e4e4e7" }} />
          <Text style={{ margin: 0, fontSize: "13px", color: "#71717a" }}>- {site.name}</Text>
        </Container>
      </Body>
    </Html>
  );
}
