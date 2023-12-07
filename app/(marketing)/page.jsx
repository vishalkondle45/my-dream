"use client";
import { CardsCarousel } from "@/components/home/Slideshow";
import Contact from "@/components/home/Contact";
import EmailBanner from "@/components/home/EmailBanner";
import { Box, Container, Text } from "@mantine/core";
import { useConvexAuth } from "convex/react";
import FeaturesGrid from "@/components/home/FeaturesGrid";

export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const isLoggedIn = !isLoading && isAuthenticated;
  return (
    <Box>
      {isLoggedIn ? (
        <Text>LoggedIn</Text>
      ) : (
        <Container my="xl">
          <CardsCarousel />
          <FeaturesGrid />
          <Contact />
          <EmailBanner />
          <Text my="xl">&emsp;</Text>
        </Container>
      )}
    </Box>
  );
}
