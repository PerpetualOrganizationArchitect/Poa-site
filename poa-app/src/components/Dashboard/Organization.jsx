// components/Organization.jsx
import { Box, Text, Image, LinkBox, LinkOverlay } from "@chakra-ui/react";
import NextImage from "next/image"; // Assuming you're using Next.js for the Image component

const Organization = ({
  title,
  membership,
  status,
  dateJoined,
  logoUrl,
  href,
}) => {
  return (
    <LinkBox
      borderWidth="1px"
      borderColor="darkpink" // Adjust the color as needed
      p={5}
      rounded="md"
      _hover={{ shadow: "md" }}
    >
      <NextImage src={logoUrl} alt={`${title} logo`} width={50} height={50} />
      <LinkOverlay href={href} isExternal>
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
      </LinkOverlay>
      <Text>Membership: {membership}</Text>
      <Text>Status: {status}</Text>
      <Text>Date Joined: {dateJoined}</Text>
    </LinkBox>
  );
};

export default Organization;
