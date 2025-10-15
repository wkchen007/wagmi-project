"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import type { Hex } from "viem";

export default function SignInWithEthereum() {
  const [signature, setSingature] = useState<Hex | undefined>(undefined);
  const { signMessage } = useSignMessage({
    mutation: { onSuccess: (sig) => setSingature(sig) },
  });

  const { connectors, connect, status, error } = useConnect();
  const account = useAccount();

  const [valid, setValid] = useState<boolean | undefined>(undefined);
  const client = usePublicClient();

  const siweMessage = useMemo(() => {
    if (!account.address) {
      alert("not connect to wallet");
      return;
    }
    // Only access `window`/`document` on the client
    if (typeof window === "undefined") return;

    return new SiweMessage({
      domain: window.location.host,
      address: account.address,
      chainId: account.chainId,
      uri: window.location.origin,
      version: "1",
      statement: "Sign in with ethereum",
      nonce: "123456789",
    });
  }, [account.address, account.chainId]);

  const promptToSign = () => {
    if (!siweMessage) return;
    signMessage({ message: siweMessage.prepareMessage() });
  };

  const checkValid = useCallback(async () => {
    if (!signature || !account.address || !client || !siweMessage) return;

    const isValid = await client.verifyMessage({
      address: account.address,
      message: siweMessage.prepareMessage(),
      signature,
    });
    setValid(isValid);
  }, [signature, account]);

  return (
    <div>
      <h2>Sign In with Ethereum</h2>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <button onClick={promptToSign}>Sign In with Ethereum</button>
      {signature && <p>Signature : {signature}</p>}

      <button onClick={checkValid}>Check Validity</button>
      {valid !== undefined && <p>Signature is {valid ? "valid" : "invalid"}</p>}
    </div>
  );
}
