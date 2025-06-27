export default function Footer() {
  return (
    <footer className="border-t border-border flex items-center justify-center py-2">
      <p className="text-xs text-muted-foreground">
        &copy; 2015 - {new Date().getFullYear()} Velocitor Solutions. All rights
        reserved.
      </p>
    </footer>
  );
}
