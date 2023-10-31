"use client";
import { useUser } from "@clerk/clerk-react";
import { Box, Text, Title } from "@mantine/core";

export default function Home() {
  // const everything = useConvexAuth();
  const user = useUser();
  return (
    <Box>
      <Title order={5}>Page.jsx</Title>
      <Text>{JSON.stringify(user)}</Text>
    </Box>
  );
}
