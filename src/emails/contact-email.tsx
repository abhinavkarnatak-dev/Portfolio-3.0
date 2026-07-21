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

export function ContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`Portfolio message from ${name}`}</Preview>
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
            New portfolio message
          </Heading>
          <Text style={{ margin: 0, fontSize: "14px", color: "#71717a" }}>
            {name} · {email}
          </Text>
          <Hr style={{ margin: "20px 0", borderColor: "#e4e4e7" }} />
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
        </Container>
      </Body>
    </Html>
  );
}
