export default function Footer() {
  return (
    <footer className="border-t border-border flex items-center justify-center py-2">
      <p className="text-xs text-muted-foreground">
        &copy; [Start Year] - {new Date().getFullYear()}{" "}
        {process.env.NEXT_PUBLIC_COMPANY_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
