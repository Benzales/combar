import {
  AboutHeading, LogoContainer, LogoPic, AboutCombar, HeaderImage, ReadMoreButton,
  ExtraContent, ElaborationContainer, BoldedText, SmallerText,
  DirectContextImage, ElaborationText
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
      <AboutHeading>While reading on the internet, we want to foster <br /> discussion and deeper thinking...</AboutHeading>
      <AboutCombar>
        Combar: universal comment bar on every webpage. It’s a Chrome extension <br />
        enabling comments in the margins of web pages. There will be a supplementary <br />
        hub with personalized recommended content and a notification center.
      </AboutCombar>
      <ReadMoreButton onClick={() => setIsReadMore(!isReadMore)}>
        {linkName}
      </ReadMoreButton>
      {isReadMore && <ExtraContent>
        Our mission at Combar is to foster open dialogue and create a shared space for thought and discovery <br />
        on every webpage. We aim to redefine the way individuals interact with online content, transforming <br />
        solitary browsing into an interactive and enriched experience. As a universal comment bar, we strive <br />
        to stimulate insightful discussions and foster a vibrant, inclusive community where every voice can <br />
        be heard. <br />
        <br />
        Our supplementary hub is designed to personalize and enhance the browsing experience, delivering <br />
        recommended content and important updates directly to our users. We believe in the power of shared <br />
        knowledge and collective wisdom to shape our understanding of the world. At Combar, we're not just <br />
        browsing the web, we're evolving it. <br />
      </ExtraContent>}
      <ElaborationContainer>
        <DirectContextImage />
        <ElaborationText>
          <BoldedText>DIRECT CONTEXT</BoldedText>
          <SmallerText>Combar presents a revolutionary way to participate in online discussions by <br />
            providing the ability to comment directly on the content. This innovation ensures <br />
            discussions occur in the context of the source material, an approach that fosters <br />
            an accurate understanding of the content and coherent discussions. Traditionally, <br />
            online conversations happen on separate platforms or threads, detached from <br />
            the original material, which often leads to fragmented understanding and diluted<br />
            conversations. With Combar, participants can reference specific parts of the <br />
            content, facilitating a seamless exchange of ideas and minimizing the risk of <br />
            misinterpretation or misunderstanding of the content.<br />
          </SmallerText>
        </ElaborationText>
      </ElaborationContainer>
      <ElaborationContainer>
        <DirectContextImage />
        <ElaborationText>
          <BoldedText>TIME SAVING</BoldedText>
          <SmallerText>Your smaller text here.</SmallerText>
        </ElaborationText>
      </ElaborationContainer>
      <ElaborationContainer>
        <DirectContextImage />
        <ElaborationText>
          <BoldedText>DIRECT CONTEXT</BoldedText>
          <SmallerText>Your smaller text here.</SmallerText>
        </ElaborationText>
      </ElaborationContainer>
      <ElaborationContainer>
        <DirectContextImage />
        <ElaborationText>
          <BoldedText>DIRECT CONTEXT</BoldedText>
          <SmallerText>Your smaller text here.</SmallerText>
        </ElaborationText>
      </ElaborationContainer>


    </div>
  );
};









