import type { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
}>;

export function Button({ children, onClick, variant = "primary", type = "button" }: ButtonProps) {
  const baseStyle = {
    borderRadius: 12,
    border: "none",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer"
  } as const;

  const style =
    variant === "primary"
      ? { ...baseStyle, background: "#111827", color: "#ffffff" }
      : { ...baseStyle, background: "#e5e7eb", color: "#111827" };

  return (
    <button type={type} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

type CardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        background: "#ffffff"
      }}
    >
      <header style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
        {subtitle ? <p style={{ margin: "6px 0 0", color: "#6b7280" }}>{subtitle}</p> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}
