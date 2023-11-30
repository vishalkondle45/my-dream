"use client";
import useStoreUserEffect from "../_hooks/useStoreUserEffect";

const LogUser = () => {
  const userId = useStoreUserEffect();
};

export default LogUser;
