import styled from 'styled-components';
interface LogoPicProps extends React.HTMLProps<HTMLDivElement> {
  sizeEm?: string;
}
export const AboutHeading = styled.h1`
  font-family: Arial, sans-serif;
  text-align: left;
  margin-top: 20px; /* Adjust the value as needed */
  margin-right: 400px; /* Adjust the value as needed */
  margin-left: 400px; /* Adjust the value as needed */
`;
export const AboutCombar = styled.h3`
  text-align: left;
  margin-top: 20px; /* Adjust the value as needed */
  margin-right: 400px; /* Adjust the value as needed */
  margin-left: 400px; /* Adjust the value as needed */
  font-family: Arial, sans-serif; /* Change the font-family to your desired font */
  color: #333; /* Adjust the color to your preferred shade */
  font-size: 17px; /* Change the font-size to your preferred size */
`;
export const LogoContainer = styled.div`
  margin-top: 50px; /* Adjust the value as needed */
  margin-right: 400px; /* Adjust the value as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh; /* Adjust the height as needed */
`;
export const LogoPic = styled.div.attrs<LogoPicProps>(() => ({}))`
  width: ${(props: LogoPicProps) => props.size || '5em'};
  height: ${(props: LogoPicProps) => props.size || '5em'};
  border-radius: 50%;
  background-image: url(/pracLogo.jpg);
  background-size: cover;
  background-position: center;
  background-color: #ccc;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const HeaderImage = styled.div`
  background-image: url(abtback.jpg);
  background-position: 0px -1200px;
  background-repeat: no-repeat;
  background-size: cover;
  height: 55vh;
  width: 100%;
`;

export const ExtraContent = styled.h3`
  text-align: left;
  margin-left: 400px; /* Adjust the value as needed */
  font-family: Arial, sans-serif; /* Change the font-family to your desired font */
  color: #333; /* Adjust the color to your preferred shade */
  font-size: 17px; /* Change the font-size to your preferred size */
`;

export const ReadMoreButton = styled.button`
  background-color: transparent; /* No background */
  border: none;
  color: blue; /* Text color */
  padding: 0;
  margin-left: 400px; 
  text-align: center;
  text-decoration: underline;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
`;
export const DirectContextImage = styled.div`
  background-image: url(abtBack.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 400px; // Explicit height
  flex: 1;  // This will allow the image to share space with the text
`;



export const ElaborationContainer = styled.div`
  margin-top: 100px;
  margin-bottom: 100px;
  margin-left: 370px; /* Adjust the value as needed */
  margin-right: 120px; /* Adjust the value as needed */
  display: flex;
  flex-direction: row;  // Align children horizontally
  height: 400px;  // Explicit height
`;


export const ElaborationText = styled.div`
  margin-left: 150px; /* Adjust the value as needed */
  flex: 1;
  padding: 20px;
`;
export const BoldedText = styled.div`
  font-size: 30px;  // Set the size to your liking
  font-weight: bold; // This makes the text bold
  margin-bottom: 20px; // Add some spacing between the text and the next element
  margin-top: 30px;
`;

export const SmallerText = styled.div`
  font-size: 18px;  // Set the size to your liking
`;
