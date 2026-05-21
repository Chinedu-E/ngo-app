import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { emailColors, emailFonts, getSiteUrl } from "./email-theme";

type EmailLayoutProps = {
  preview: string;
  title: string;
  children: ReactNode;
};

export function EmailLayout({ preview, title, children }: EmailLayoutProps) {
  const logoUrl = `${getSiteUrl()}/thriveparthtransparent.png`;
  const submittedAt = new Date().toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "32px 16px",
          backgroundColor: emailColors.beige,
          fontFamily: emailFonts.body,
        }}
      >
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Section
            style={{
              backgroundColor: emailColors.forest,
              borderRadius: "16px 16px 0 0",
              padding: "24px 32px",
            }}
          >
            <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "48px", verticalAlign: "middle" }}>
                    <Img
                      src={logoUrl}
                      alt={`${SITE.name} logo`}
                      width={40}
                      height={40}
                      style={{ display: "block" }}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle", paddingLeft: "12px" }}>
                    <Heading
                      as="h1"
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 600,
                        color: emailColors.white,
                        fontFamily: emailFonts.sans,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {SITE.name}
                    </Heading>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section
            style={{
              backgroundColor: emailColors.white,
              borderRadius: "0 0 16px 16px",
              border: `1px solid ${emailColors.border}`,
              borderTop: "none",
              padding: "32px",
            }}
          >
            <Heading
              as="h2"
              style={{
                margin: "0 0 24px",
                fontSize: "20px",
                fontWeight: 600,
                color: emailColors.forest,
                fontFamily: emailFonts.sans,
              }}
            >
              {title}
            </Heading>
            {children}
          </Section>

          <Hr
            style={{
              borderColor: emailColors.border,
              margin: "24px 0",
            }}
          />

          <Text
            style={{
              margin: 0,
              fontSize: "13px",
              lineHeight: "20px",
              color: emailColors.muted,
              textAlign: "center" as const,
            }}
          >
            {SITE.tagline}
            <br />
            Submitted {submittedAt}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
