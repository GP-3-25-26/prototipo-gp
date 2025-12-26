// src/components/AIChat.tsx
import { useState } from 'react';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { Card } from './UI';

export const AIChat = ({ context }: { context: string }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: `Hola, soy tu asistente GenIA. Estoy analizando el contexto de: ${context}. ¿En qué puedo ayudarte?` }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsgs = [...messages, { role: 'user', text: input }];
        setMessages(newMsgs as any);
        setInput("");

        // Respuesta fake simulando latencia
        setTimeout(() => {
            setMessages([...newMsgs, { role: 'ai', text: "Entendido. Basado en la base de datos ClinVar y el historial del paciente, esa variante tiene alta penetrancia en fenotipos retinianos." }] as any);
        }, 1000);
    };

    return (
        <Card className="h-full flex flex-col bg-slate-50 border-blue-100">
            <div className="flex items-center gap-2 mb-4 text-blue-800 font-semibold border-b pb-2">
                <Bot size={20} />
                <span>Asistente IA - Genetista</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[300px]">
                {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'ai' ? 'bg-white border border-gray-200 mr-8' : 'bg-blue-100 ml-8'}`}>
                        <strong>{m.role === 'ai' ? 'IA' : 'Tú'}:</strong> {m.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregunta sobre la variante..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                    <Send size={16} />
                </button>
            </div>
        </Card>
    );
};