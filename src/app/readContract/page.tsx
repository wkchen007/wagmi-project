"use client";
import { useState } from "react";
import { useReadContract } from "wagmi";
import { BaseError } from "viem";

import { type Address } from "viem";

import { wagmiContractConfig } from "./../contract";

export default function ReadContract() {
  return (
    <div>
      <div>
        <BalanceOf />
        <br />
        <TotalSupply />
      </div>
    </div>
  );
}

const TotalSupply = () => {
  const { data, isRefetching, refetch } = useReadContract({
    ...wagmiContractConfig,
    functionName: "totalSupply",
  });
  return (
    <div>
      Total Supply: {data?.toString()}
      <br />
      <button disabled={isRefetching} onClick={() => refetch()}>
        {isRefetching ? "loading..." : "Refetch"}
      </button>
    </div>
  );
};

const BalanceOf = () => {
  const [address, setAddress] = useState<Address>(
    "0x0000000000000000000000000000000000000000"
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
      Address:
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        style={{ marginLeft: 4 }}
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
