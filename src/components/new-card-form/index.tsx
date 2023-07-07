'use client'
import { api } from '@/libs/api'
import { Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'

interface NewCardFormProps {
  fetchCards: () => void
  userId: string
}

export function NewCardForm({ fetchCards, userId }: NewCardFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const form = event.currentTarget
      const formData = new FormData(form)

      const nameInput = form.elements.namedItem('name') as HTMLInputElement
      const dateInput = form.elements.namedItem('dueDate') as HTMLInputElement

      const name = formData.get('name')
      const value = formData.get('value')
      const date = formData.get('dueDate')

      if (!name || !value || !date) {
        return
      }

      const newValue = (value as string)
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace('R', '')

      await api
        .post('card/create', {
          name,
          limit: Number(newValue),
          dueDate: date,
          userId,
        })
        .then(() => {
          fetchCards()

          nameInput.value = ''
          dateInput.value = ''
          setFormattedValue('')
        })
    } catch {
      throw new Error()
    }
  }

  const [formattedValue, setFormattedValue] = useState('')

  const handleChangeMoney = (event: { target: { value: any } }) => {
    const { value } = event.target
    const cleanedValue = value.replace(/\D/g, '') // Remove caracteres não numéricos
    const formatted = formatCurrency(cleanedValue)
    setFormattedValue(formatted)
  }

  const formatCurrency = (value: any) => {
    const options = {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
    const amount = Number(value) / 100
    return amount.toLocaleString('pt-BR', options)
  }

  return (
    <form className="flex gap-x-2 px-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1 flex-1">
        <label>Nome</label>
        <input
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 bg-neutral-950 outline-none"
          placeholder="Ex.: Cartão Visa 1"
          id="name"
          name="name"
        />
      </div>
      <div className="flex flex-col gap-1 w-32">
        <label>Limite</label>
        <input
          type="text"
          value={formattedValue}
          onChange={handleChangeMoney}
          placeholder="R$ 0,00"
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 bg-neutral-950 outline-none"
          id="value"
          name="value"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <label>Vencimento dia:</label>
        <input
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 bg-neutral-950 outline-none"
          placeholder="Ex.: 28"
          id="dueDate"
          name="dueDate"
        />
      </div>
      <button
        className="h-10 flex gap-x-1 mt-auto p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
        type="submit"
      >
        <Plus size={24} />
        Adicionar
      </button>
    </form>
  )
}