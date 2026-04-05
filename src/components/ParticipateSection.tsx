import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be under 255 characters"),
  message: z.string().trim().min(1, "Please share your memory").max(2000, "Message must be under 2000 characters"),
});

const ParticipateSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = submissionSchema.safeParse({ name, email, message });
    if (!result.success) {
      toast({
        title: "Please check your input",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from("submissions")
      .insert({ name: result.data.name, email: result.data.email, message: result.data.message });

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } else {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
    setSubmitting(false);
  };

  return (
    <section
      id="participate"
      className="relative py-24 md:py-32 px-6 md:px-10"
    >
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Join the Archive
        </p>
        <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-6 leading-tight">
          Share Your
          <br />
          <span className="italic text-accent">Story</span>
        </h2>
        <p className="font-body text-base text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
          Every memory matters. If you have a story to tell, we'd love to hear it. Your voice is part of this archive.
        </p>

        {submitted ? (
          <div className="bg-secondary/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-soft max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <span className="text-2xl text-accent">✓</span>
            </div>
            <h3 className="font-heading text-xl text-foreground">Thank you!</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Your story has been received. We will contact you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="font-body text-xs uppercase tracking-widest text-accent hover:text-accent/80 transition-colors mt-2"
            >
              Submit another story
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-secondary/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-soft max-w-md mx-auto text-left space-y-5"
          >
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we call you?"
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={255}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Your Memory
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about a moment, a ritual, a place you remember..."
                maxLength={2000}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-3.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors mt-2 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Your Story"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ParticipateSection;