// src/pages/about/index.js
import React from "react";
import Layout from "../../components/Layout"; // If you have a Layout component
import { Text, Box, Flex } from "@chakra-ui/react";
const AboutPage = () => {
  return (
    <Layout>
      <Text>
        Perpetual Organization Architect Mission: Our mission is to simplify the
        creation of and participation in fully community owned organizations by
        leveraging AI for onboarding and decentralized technologies for the
        infrastructure. Full decentralization is our priority. We want to ensure
        that the created Perpetual Organizations can’t be stopped or changed by
        anyone but the community members.
        <Text>Description:</Text>
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
        Current Needs: The DAO models and web3 backend infrastructure is ready
        for an MVP. It will be based off the work the founders did prior on this
        project https://kublockchaindao.on.fleek.co This site is also a good UI
        reference for what a Perpetual Organization might look like. • Web
        Design Needs: The team is making a site for ETH Denver, but our website
        design skills are lacking. The basic concept will be similar to most
        chatbots but Poa will be a friendly looking creature similar to Duo and
        the chat will sometimes give you clickable options to select. We won’t
        be working on the UI for browsing Perpetual Organizations and finding
        tasks during ETH Denver so that’s where the most design help is needed
        now. • Legal Needs: Main thing needed here is a disclaimer that limits
        our liability if legal action is taken against any of the Perpetual
        Organizations made. We also need to make sure ideas for Perpetual
        Organization legal wrappers and the Perpetual Fund structure are legally
        compliant.
      </Text>
    </Layout>
  );
};

export default AboutPage;
