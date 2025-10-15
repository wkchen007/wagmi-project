"use client";

import { useState } from "react";
import {
  useConnect,
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { wagmiContractConfig } from "../contract";
import { stringify, Address, BaseError } from "viem";

export default function WriteContract() {
  const [userInput, setUserInput] = useState({
    address: "",
    amount: "",
  });

  const { connectors, connect, status } = useConnect();
  const { data, error, isPending, isError, writeContract } = useWriteContract();
  const { data: receipt, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });
  const { chain } = useAccount();

  return (
    <div>
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
      <BalanceOf />
      <br />
      <div>Mint a token:</div>
      <div>
        <div>
          Address :{" "}
          <input
            name="address"
            placeholder="0x1234..222"
            onChange={(e) => {
              setUserInput((prev) => ({ ...prev, address: e.target.value }));
            }}
          ></input>
        </div>
        <div>
          Amount :{" "}
          <input
            name="address"
            placeholder="0.01"
            onChange={(e) => {
              setUserInput((prev) => ({ ...prev, amount: e.target.value }));
            }}
          ></input>
        </div>

        <button
          disabled={isPending}
          onClick={() => {
            writeContract({
              ...wagmiContractConfig,
              functionName: "mint",
              args: [userInput.address as Address, BigInt(userInput.amount)],
            });
          }}
        >
          {isPending ? "minting..." : "Mint"}
        </button>

        {isSuccess && (
          <div>
            <a
              target="_blank"
              href={`${chain?.blockExplorers?.default?.url}/tx/${data}`}
            >
              Transaction Hash :{data}
            </a>
            <div>
              Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
      {isError && <div>{error?.message}</div>}
    </div>
  );
}

const BalanceOf = () => {
  const [address, setAddress] = useState<Address>(
    "0x1deAe8b25D834F31B88058bc137E8e80E54f1F86"
  );
  const [value, setValue] = useState<string>(address);
  const { data, error, isSuccess, isLoading } = useReadContract({
    ...wagmiContractConfig,
    functionName: "balanceOf",
    args: [address],
  });
  return (
    <div>
      Token balance: {isSuccess && data?.toString()}
      <br />
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        style={{ marginLeft: 4, width: "500px" }}
        value={value}
      />
      <br />
      <button onClick={() => setAddress(value as Address)}>
        {isLoading ? "fetching..." : "fetch"}
      </button>
      {error && <div>{(error as BaseError).shortMessage || error.message}</div>}
    </div>
  );
};
