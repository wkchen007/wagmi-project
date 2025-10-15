"use client";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSignTypedData } from "wagmi";

import { type Address, recoverTypedDataAddress } from "viem";

const domain = {
  name: "wagmi demo",
  version: "1",
  chainId: 11155111,
} as const;

const types = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Mail: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "contents", type: "string" },
  ],
} as const;

const message = {
  from: {
    name: "Peter",
    wallet: "0x1deAe8b25D834F31B88058bc137E8e80E54f1F86",
  },
  to: {
    name: "Andy",
    wallet: "0xA278Aa560B6A1D2ED46F7faf724C67E9eF20B2EA",
  },
  contents: "Hello Andy",
} as const;

export default function SignTypedData() {
  const { data, error, isPending, signTypedData } = useSignTypedData();
  const [recoveredAddress, setRecoveredAddress] = useState<Address>();

  const account = useAccount();

  const {
    connectors,
    connect,
    status: connectStatus,
    error: connectError,
  } = useConnect();

  useEffect(() => {
    if (!data) return;
    (async () => {
      setRecoveredAddress(
        await recoverTypedDataAddress({
          domain,
          types,
          message,
          primaryType: "Mail",
          signature: data,
        })
      );
    })();
  }, [data]);

  return (
    <div>
      <h1>SignTypedData</h1>
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
      <button
        onClick={() => {
          signTypedData({
            domain,
            types,
            message,
            primaryType: "Mail",
          });
        }}
      >
        Sign Message
      </button>

      {data && (
        <div>
          <div>signature :{data}</div>
          <div>recovered address: {recoveredAddress} </div>
        </div>
      )}

      <div>{error && (error?.message ?? "Failed to sign message")}</div>
    </div>
  );
}
