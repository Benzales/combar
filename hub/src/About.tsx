import {
  AboutHeading, LogoContainer, LogoPic, AboutCombar, HeaderImage, ReadMoreButton,
  ExtraContent
} from "./styles/about";
import React, { useState } from 'react';

export const About = () => {
  const [isReadMore, setIsReadMore] = useState(false);


  const linkName = isReadMore ? 'hide ' : 'read combars full mission statement ';
  return (
    <div>
      <HeaderImage />
      <LogoContainer>
        <LogoPic />
      </LogoContainer>
      <AboutHeading>Unlocking Insights: Connect, Inquire, Empower.</AboutHeading>
      <AboutCombar>
        Combar: universal comment bar on every webpage. It’s a Chrome extension <br />
        enabling comments in the margins of web pages. There will be a supplementary <br />
        hub with personalized recommended content and a notification center.
      </AboutCombar>
      <ReadMoreButton onClick={() => setIsReadMore(!isReadMore)}>
        {linkName}
      </ReadMoreButton>
      {isReadMore && <ExtraContent>
        Direct Context: With combar, discussions can take place directly on the page <br />
        of the content, preserving the context and ensuring that everyone participating in the discussion <br />
        has immediate access to the source material. This is a significant upgrade over having discussions <br />
        on a separate platform where context might get lost or misunderstood. <br />
        <br />
        Time-Saving: By eliminating the need to switch between tabs or apps to discuss or make notes, combar <br />
        can save users time and increase efficiency. This can be particularly valuable for educators, students, <br />
        and professionals. <br />
        <br />
        Increased Engagement: The presence of a comments bar on every page can make users more likely to engage <br />
        with the content and with each other, even if they weren't originally planning on it. This can lead <br />
        to deeper understanding on a topic and allow people to gain knowledge on perspectives they hadn't <br />
        encountered before. <br />
        <br />
        Personalized Content Recommendations: This feature could be a major draw for users if executed well.<br />
         By providing recommendations based on their comments and interests, combar can help users discover <br />  
        new relevant content that they might not have found otherwise. <br />
        <br />
        Through these benefits, Combar is a solution to the lack of contextual discussion and can help <br />
        solve fragmented and inffecient conversation. This transformative tool reimagines how we communicate <br />
        on the web, making online discussions more effective and enjoyable. <br />
      </ExtraContent>}
    </div>
  );
};








