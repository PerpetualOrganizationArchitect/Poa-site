// src/pages/about/index.js
import React from "react";
import Layout from "../../components/Layout"; // If you have a Layout component
import { Text, Box, Flex } from "@chakra-ui/react";
const AboutPage = () => {
  return (
    <Layout>
      <Text>Perpetual Organization Architect Mission:</Text>
      <Text>
        Our mission is to simplify the creation of and participation in fully
        community owned organizations by leveraging AI for onboarding and
        decentralized technologies for the infrastructure. Full decentralization
        is our priority. We want to ensure that the created Perpetual
        Organizations can’t be stopped or changed by anyone but the community
        members.{" "}
      </Text>
      <Text>Description:</Text>

      <Text>
        The Perpetual Organization Architect also known as Poa will be a
        friendly AI chat bot that guides you through the process of building a
        no code perpetual organization. It will explain what a perpetual
        organization is, give a few examples, and expand on that info if you
        request. Next, Poa will ask you what your idea for your organization is
        and based off your response will walk you through and give specific
        suggestion for picking a UI template, voting system, reward system, and
        other features. At the end, it will display your selected features and
        then deploy all necessary smart contracts and subgraph information.
        There will eventually be a site to browse all the perpetual
        organizations and open tasks so you can do work for an organization
        without being a member. The last component is the Perpetual Fund which
        will be a community run startup fund for Perpetual Organizations.
      </Text>
    </Layout>
  );
};

export default AboutPage;
