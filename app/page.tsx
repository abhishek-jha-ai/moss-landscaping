import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { OutdoorLiving } from "@/components/OutdoorLiving";
import { Hardscape } from "@/components/Hardscape";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ServiceAreas } from "@/components/ServiceAreas";
import { ResidentialCommercial } from "@/components/ResidentialCommercial";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <OutdoorLiving />
      <ProjectGallery />
      <Hardscape />
      <BeforeAfter />
      <ServiceAreas />
      <ResidentialCommercial />
      <About />
      <Contact />
    </>
  );
}
