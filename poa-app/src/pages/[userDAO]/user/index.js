import React, { useState, useEffect } from "react";
import NextLink from "next/link";

import { useRouter } from "next/router";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Flex,
  Heading,
  Link,
  Image,
  VStack,
} from "@chakra-ui/react";

const User = () => {
  const router = useRouter();
  const { userDAO } = router.query; // Get the dynamic part of the URL

  return (
    <>
      <Text>user page</Text>
    </>
  );
};
export default User;
