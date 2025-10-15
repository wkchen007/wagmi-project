'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import SendETHButton from '@/components/sendETHBtn';

function App() {
  const account = useAccount()
  const { status, error } = useConnect()
  const { data: userBalance, refetch } = useBalance({
    address: account.address,
  })
  const { disconnect } = useDisconnect()

  const formattedBalance =
    userBalance && userBalance.value
      ? formatUnits(userBalance.value, userBalance.decimals)
      : undefined

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
          <br />
          balance:{' '}
          {formattedBalance ? (
            <>
              {formattedBalance} {userBalance?.symbol}
            </>
          ) : (
            '—'
          )}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <SendETHButton onConfirmed={refetch} />

      <ConnectButton />
    </>
  )
}

export default App
