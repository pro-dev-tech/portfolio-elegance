const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-12 lg:px-24 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} John Doe. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Designed & built with precision
        </p>
      </div>
    </footer>
  );
};

export default Footer;
