import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const References = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="font-body text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest"
          >
            ← Back
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mt-6 mb-4">
            References
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-12 leading-relaxed">
            Sources, readings, and conversations that shaped this archive.
          </p>

          <section className="space-y-10">
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">
                Reports & Research
              </h2>
              <ul className="space-y-3 font-body text-sm text-muted-foreground leading-relaxed">
                <li>
                  UNHCR. <em>Yemen Situation Reports.</em>{" "}
                  <a
                    href="https://www.unhcr.org/countries/yemen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80"
                  >
                    unhcr.org
                  </a>
                </li>
                <li>
                  IOM. <em>Migration Trends from Yemen.</em>{" "}
                  <a
                    href="https://www.iom.int/countries/yemen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80"
                  >
                    iom.int
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">
                Books & Essays
              </h2>
              <ul className="space-y-3 font-body text-sm text-muted-foreground leading-relaxed">
                <li>Steven C. Caton. <em>Yemen Chronicle: An Anthropology of War and Mediation.</em></li>
                <li>Helen Lackner. <em>Yemen in Crisis: The Road to War.</em></li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">
                Related Voices
              </h2>
              <ul className="space-y-3 font-body text-sm text-muted-foreground leading-relaxed">
                <li>
                  <a
                    href="https://yiepodcast.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80"
                  >
                    Voices Unfiltered Podcast ↗
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default References;