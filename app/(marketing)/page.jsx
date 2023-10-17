"use client";
import { useUser } from "@clerk/clerk-react";
import { Text, Title } from "@mantine/core";

export default function Home() {
  // const everything = useConvexAuth();
  const user = useUser();
  return (
    <>
      <Title order={5}>Page.jsx</Title>
      <Text>{JSON.stringify(user)}</Text>
    </>
  );
}
