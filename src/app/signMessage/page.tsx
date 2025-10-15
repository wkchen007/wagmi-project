"use client";
import { useEffect, useState } from "react";

import { useAccount, useConnect, useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";
export default function SignMsg() {
  const [message, setMessage] = useState("");
  const [recoveredAddress, setRecoveredAddress] = useState("");
  const account = useAccount();
  const {
    connectors,
    connect,
    status: connectStatus,
    error: connectError,
  } = useConnect();
  const {
    data: signedMessageData,
    isPending,
    error,
    signMessage,
    variables,
  } = useSignMessage();

  useEffect(() => {
    (async () => {
      if (variables?.message && signedMessageData) {
        const _receoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signedMessageData,
        });
        console.log(_receoveredAddress);
        setRecoveredAddress(_receoveredAddress);
      }
    })();
  }, [signedMessageData, variables?.message]);

  const submit = (e: any) => {
    e.preventDefault();
    signMessage({ message });
  };

  return (
    <div style={{ display: "inline-grid", gap: "30px" }}>
      <label htmlFor="message">Enter a message to sign</label>
      <textarea
        id="message"
        name="message"
        placeholder="The quick brown fox…"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={(e) => submit(e)}>Sign Message</button>
      <div>
        <div>Recovered Address:{recoveredAddress} </div>
        <div>Signature:{signedMessageData} </div>
      </div>

      {/*Connect section*/}
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
        <div>{connectStatus}</div>
        <div>{connectError?.message}</div>
      </div>
      {/*Connect section*/}
    </div>
  );
}
