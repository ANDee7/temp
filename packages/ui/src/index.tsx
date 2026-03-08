import type { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  type?: "button" | "submit" | "reset";
  className?: string;
}>;

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  className
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className)}
    >
      {children}
    </button>
  );
}

type CardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  className?: string;
}>;

export function Card({ title, subtitle, className, children }: CardProps) {
  return (
    <section className={cn("ui-card", className)}>
      <header className="ui-card__header">
        <h3 className="ui-card__title">{title}</h3>
        {subtitle ? <p className="ui-card__subtitle">{subtitle}</p> : null}
      </header>
      <div className="ui-card__content">{children}</div>
    </section>
  );
}
