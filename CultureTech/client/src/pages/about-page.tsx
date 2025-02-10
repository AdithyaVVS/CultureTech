import Navbar from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <section className="text-center">
            <h1 className="text-4xl font-bold mb-4">About InsightSphere</h1>
            <p className="text-xl text-muted-foreground">
              A digital sanctuary for curious minds exploring the intersections of technology,
              entertainment, sports, and culture.
            </p>
          </section>

          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary">AV</span>
                </div>

                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-bold">About the Author</h2>
                  <p className="text-muted-foreground">
                    I'm Adithya, an Electronics and Communication Engineering (ECE) graduate from Hyderabad, 
                    with a deep passion for AI, cinema, cricket, and Hindu mythology. I find inspiration in 
                    the fusion of technology, storytelling, and cultural heritage, constantly exploring how 
                    these elements shape our world. Whether it's analyzing the impact of AI, breaking down 
                    iconic Telugu films, or uncovering hidden narratives in mythology and archaeology, I love 
                    diving into subjects that spark curiosity and conversation.
                  </p>
                  <p className="text-muted-foreground">
                    Through InsightSphere, I aim to bring together these diverse interests into a single platform. 
                    This blog is a space where I explore AI advancements, decode cinema's storytelling, relive 
                    cricketing brilliance, and uncover the mysteries of ancient temples and sites. With AI-generated 
                    visuals, well-researched insights, and engaging discussions, I strive to make every post 
                    informative, thought-provoking, and visually captivating for readers who share a love for 
                    these subjects.
                  </p>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      asChild
                    >
                      <a 
                        href="https://github.com/AdithyaVVS" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                      >
                        <SiGithub className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      asChild
                    >
                      <a 
                        href="https://www.linkedin.com/in/vvs-adithya-140b40246" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                      >
                        <SiLinkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                InsightSphere aims to create meaningful connections between different domains
                of knowledge, offering unique perspectives where technology meets tradition,
                and entertainment meets analytical thinking. We believe in the power of 
                interdisciplinary learning and thoughtful discussion.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Join the Conversation</h2>
              <p className="text-muted-foreground">
                Whether you're passionate about AI advancements, excited about Telugu cinema,
                interested in cricket analytics, or fascinated by mythology and archaeology,
                InsightSphere is your platform to explore, learn, and engage in meaningful
                discussions.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}