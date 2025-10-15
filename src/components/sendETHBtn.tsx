'use client'

import { useEffect, useState } from 'react'
import { Address, parseEther } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

export default function SendETHButton({
  onConfirmed,
}: {
  onConfirmed?: () => void
}) {
  const [userInput, setUserInput] = useState({ address: '', amount: '' })

  const { data: hash, isPending, sendTransaction } = useSendTransaction()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) onConfirmed?.()
  }, [isSuccess, onConfirmed])

  const handleSubmit = () => {
    if (!userInput.address || !userInput.amount) return
    sendTransaction({
      to: userInput.address as Address,
      value: parseEther(userInput.amount),
    })
  }

  return (
    <div>
      <div>
        Address:{' '}
        <input
          name="address"
          placeholder="0x1234..222"
          onChange={(e) =>
            setUserInput((p) => ({ ...p, address: e.target.value }))
          }
        />
      </div>
      <div>
        Amount:{' '}
        <input
          name="amount"
          placeholder="0.01"
          onChange={(e) =>
            setUserInput((p) => ({ ...p, amount: e.target.value }))
          }
        />
      </div>
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Confirming…' : 'Send'}
      </button>

      <div>hash: {hash}</div>
      {isLoading && <div>Waiting for confirmation…</div>}
      {isSuccess && <div>Transaction confirmed</div>}
    </div>
  )
}
