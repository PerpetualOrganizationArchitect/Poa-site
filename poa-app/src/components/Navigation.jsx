// src/components/Navigation.jsx
import React from "react";
import Link from "next/link";
import { Flex, Button, IconButton } from "@chakra-ui/react";
import Image from "next/image";

const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;

const Navigation = () => {

  let href = `http://localhost:3000`;
  if(baseDomain=="localhost:3000"){
     href = `http://localhost:3000/create`;
  }
  else{
    href = `http://create.${baseDomain}`;
  }
  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="transparent"
      position="fixed"
      top={0}
      w="100%"
      shadow={"md"}
    >
      {/* Wrap each Link in a Button component */}
      <Link href="/landing" passHref>
        <IconButton
          icon={
            <Image
              src="/images/poa_logo.png"
              alt="Home"
              width={54}
              height={48}
            />
          }
          variant="ghost"
          aria-label="Home"
        />
      </Link>

      <Link href="/about" passHref>
        <Button variant="outline" p={4} colorScheme="black">
          About
        </Button>
      </Link>

      <Link href="/browser" passHref>
        <Button variant="outline" p={4} colorScheme="black">
          Browser
        </Button>
      </Link>
      <Link href={href} passHref>
        <Button variant="outline" p={4} colorScheme="black">
          Architect
        </Button>
      </Link>
    </Flex>
  );
};

export default Navigation;
