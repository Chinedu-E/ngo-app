import { Section, Text } from "@react-email/components";
import { emailColors, emailFonts } from "./email-theme";

type EmailFieldProps = {
  label: string;
  value: string | boolean | undefined | null;
};

export function EmailField({ label, value }: EmailFieldProps) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

  return (
    <Section style={{ marginBottom: "16px" }}>
      <Text
        style={{
          margin: "0 0 4px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
          color: emailColors.sage,
          fontFamily: emailFonts.body,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          margin: 0,
          fontSize: "15px",
          lineHeight: "24px",
          color: emailColors.foreground,
          fontFamily: emailFonts.body,
          whiteSpace: "pre-wrap" as const,
        }}
      >
        {display}
      </Text>
    </Section>
  );
}
