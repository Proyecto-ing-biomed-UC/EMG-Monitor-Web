import React, { useState, FormEvent } from 'react';

import { Button } from './@/components/ui/button'


import { Input } from "./@/components/ui/input"
import { Label } from "./@/components/ui/label"
import { LockIcon, UserIcon } from 'lucide-react'

export default function Component() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    console.log('Iniciar sesión con:', username, password)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-teal-500 to-zinc-900 p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-text-cycle text-[10vw] font-bold text-zinc-800 opacity-10">
          <span className="absolute inset-0 flex items-center justify-center">CONSTRUYENDO EL FUTURO</span>
          <span className="absolute inset-0 flex items-center justify-center">MEJOR CALIDAD DE VIDA</span>
          <span className="absolute inset-0 flex items-center justify-center">CIERVO</span>
        </div>
      </div>
      <div className="relative w-full max-w-md space-y-8 rounded-xl bg-zinc-800/90 p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CIERVO_con_INRPAC-removebg-preview-gUwpXYXPjlbfRDs0AzBdA3G5OksJy8.png"
            alt="Logo de Ciervo - Un ciervo estilizado en color verde azulado"
            className="h-32 w-32 object-contain"
          />
          <h2 className="text-2xl font-bold text-teal-400">Ciervo IoT</h2>
          <p className="text-sm text-zinc-300">Equipo de Robótica</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-teal-300">
              Nombre de Usuario
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                id="username"
                placeholder="Ingresa tu usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-zinc-700/50 border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:border-teal-400 focus:ring-teal-400"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-teal-300">
              Contraseña
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                id="password"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-zinc-700/50 border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:border-teal-400 focus:ring-teal-400"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-900 font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  )
}