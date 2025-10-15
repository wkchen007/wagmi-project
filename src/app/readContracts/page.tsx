"use client";

import { stringify } from "viem";
import { useReadContracts } from "wagmi";
import { wagmiContractConfig } from "../contract";

export default function ReadContracts() {
  const { data, isSuccess, isLoading } = useReadContracts({
    contracts: [
      {
        ...wagmiContractConfig,
        functionName: "balanceOf",
        args: ["0x1deAe8b25D834F31B88058bc137E8e80E54f1F86"],
      },
      {
        ...wagmiContractConfig,
        functionName: "name",
      },
      {
        ...wagmiContractConfig,
        functionName: "totalSupply",
      },
    ],
  });

  return (
    <div>
      <div>Data:</div>
      {isLoading && <div>loading</div>}
      {isSuccess &&
        data?.map((data) => <pre key={stringify(data)}>{stringify(data)}</pre>)}
    </div>
  );
}
