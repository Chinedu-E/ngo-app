import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";

const labelClass = "block text-sm font-semibold text-foreground mb-2";
const inputClass =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-shadow";

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && <span className="text-sage ml-1">*</span>}
    </label>
  );
}

function FieldWrap({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function Input({
  id,
  label,
  required,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <FieldWrap>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input id={id} name={id} required={required} className={`${inputClass} ${className}`} {...props} />
    </FieldWrap>
  );
}

export function Select({
  id,
  label,
  required,
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <FieldWrap>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select id={id} name={id} required={required} className={`${inputClass} ${className}`} {...props}>
        {children}
      </select>
    </FieldWrap>
  );
}

export function Textarea({
  id,
  label,
  required,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <FieldWrap>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={id}
        required={required}
        className={`${inputClass} min-h-[120px] resize-y ${className}`}
        {...props}
      />
    </FieldWrap>
  );
}
