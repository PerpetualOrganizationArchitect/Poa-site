import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const ArchitectInput = () => {
  return (
    <InputGroup>
      <Input placeholder="Type here..." borderColor="blue.900" />
      <InputRightElement>
        <IconButton
          icon={<ArrowUpIcon color="teal" />}
          variant="ghost"
          aria-label="Home"
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default ArchitectInput;
