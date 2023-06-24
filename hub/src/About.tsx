import {
  AboutHeading, LogoContainer, LogoPic, AboutCombar, HeaderImage, ReadMoreButton,
  ExtraContent, ElaborationContainer, BoldedText, SmallerText, IncreasedEngagementImage,
  DirectContextImage, ElaborationText, TimeSavingImage, PersonalizedContentImage
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
        <TimeSavingImage />
        <ElaborationText>
          <BoldedText>TIME SAVING</BoldedText>
          <SmallerText>Combar streamlines online discussions by offering a commenting feature directly <br />
            on the web page, thus eliminating the need to switch between tabs or apps. <br />
            This enhances the user experience by saving time and reducing the cognitive <br />
            load of managing multiple applications. The value of this feature extends across <br />
            a wide array of users, from educators who can efficiently provide feedback on  <br />
            digital resources, students engaged in e-learning, to professionals collaborating  <br />
            on online documents. By consolidating the discussion platform with the content,  <br />
            Combar facilitates a more efficient and uninterrupted flow of work. <br />

          </SmallerText>
        </ElaborationText>
      </ElaborationContainer>
      <ElaborationContainer>
        <IncreasedEngagementImage />
        <ElaborationText>
          <BoldedText>INCREASED ENGAGEMENT</BoldedText>
          <SmallerText>Having a comment bar accessible on every page can significantly enhance user <br />
            interaction with the content and among each other. With Combar, users can engage<br />
            in impromptu discussions, share insights, or pose questions related to the content<br />
            they are consuming. This spontaneous form of interaction encourages a dynamic <br />
            and vibrant community of users, enhancing the learning and discovery process. <br />
            As users are more likely to comment when the feature is readily available, this <br />
            also leads to an increase in the overall user engagement on the platform.<br />
          </SmallerText>
        </ElaborationText>
      </ElaborationContainer>
      <ElaborationContainer>
        <PersonalizedContentImage />
        <ElaborationText>
          <BoldedText>PERSONALIZED CONTENT</BoldedText>
          <SmallerText>Beyond facilitating discussions, Combar also offers a personalized experience to <br />
            users by providing content recommendations. Based on users' interaction, <br />
            comments, and interests, Combar can suggest relevant content that aligns with<br />
            their preferences and engages their curiosity. This powerful feature turns Combar<br />
            into a personal learning and discovery tool, tailored to each user's unique needs<br />
            and interests. As the system understands each user's behavior over time, the <br />
            recommendations become increasingly accurate, leading to a more personalized<br />
            and satisfying browsing experience. By acting as a gateway to new and relevant <br />
            content, Combar can effectively foster a continuous learning environment for its users.<br />
          </SmallerText>
        </ElaborationText>
      </ElaborationContainer>


    </div>
  );
};









