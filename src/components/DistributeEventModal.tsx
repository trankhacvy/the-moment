import { RadioGroup } from "@radix-ui/react-radio-group"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { FormControl, FormLabel } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Radio } from "@/components/ui/Radio"

type DistributeEventModalProps = {
  trigger: React.ReactNode
  eventId: string
  onSuccess: VoidFunction
}

export const DistributeEventModal = ({ trigger, eventId, onSuccess }: DistributeEventModalProps) => {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [transferable, setTransferable] = useState(false)
  const [poapPerWallet, setPoapPerWallet] = useState(1)
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")

  const handleSubmit = async () => {
    try {
      if (!publicKey) return

      setLoading(true)
      const response = await axios.post<any>("/api/create-event", {
        eventId,
        amount: parseInt(amount),
        transferable,
        poapPerWallet,
        startAt,
        endAt,
        creator: publicKey.toBase58(),
      })
      if (response.status === 200 && response.data.success) {
        const transaction = Transaction.from(Buffer.from(response.data?.data?.encoded_transaction ?? "", "base64"))
        console.log("transaction", transaction)
        const signature = await sendTransaction(transaction, connection)
        await connection.confirmTransaction(signature, "processed")
        console.log("signature", signature)
        await axios.post<any>("/api/create-event", {
          eventId,
          amount: parseInt(amount),
          transferable,
          poapPerWallet,
          startAt,
          endAt,
          creator: publicKey.toBase58(),
          treeAddress: response.data?.data?.tree,
          uri: response.data?.data?.uri,
        })
      }
      onSuccess()
      setIsOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth="lg">
        <DialogHeader>
          <DialogTitle>Distribute event POAP</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <FormControl>
            <FormLabel>Number of POAP</FormLabel>
            <Input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              fullWidth
              placeholder="e.g. 1000"
            />
          </FormControl>
          <FormControl>
            <Checkbox checked={transferable} onCheckedChange={setTransferable as any}>
              Transferable
            </Checkbox>
          </FormControl>
          <FormControl>
            <FormLabel>POAP per wallet</FormLabel>
            <RadioGroup
              className="space-y-4"
              value={String(poapPerWallet)}
              onValueChange={(value) => setPoapPerWallet(Number(value))}
            >
              <Radio value="1">Only one</Radio>
              <Radio value="-1">No limit</Radio>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Mint window</FormLabel>
            <div className="flex gap-6">
              <Input
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                fullWidth
                placeholder="Start at"
                type="datetime-local"
              />
              <Input
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                fullWidth
                placeholder="End at"
                type="datetime-local"
              />
            </div>
          </FormControl>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button loading={loading} onClick={handleSubmit} type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
