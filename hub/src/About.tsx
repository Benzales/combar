import { AboutHeading, LogoContainer, LogoPic, AboutCombar } from "./styles";

export const About = () => (
  <div>
    <LogoContainer>
      <LogoPic />
    </LogoContainer>
    <AboutHeading>Unlocking Insights: Connect, Inquire, Empower.</AboutHeading>
    <AboutCombar>
      combar: a universal comment bar on every webpage. <br />
      It’s a chrome extension that allows users to select text  <br />
      and create comments in the margins of webpages.
    </AboutCombar>
  </div>
);
