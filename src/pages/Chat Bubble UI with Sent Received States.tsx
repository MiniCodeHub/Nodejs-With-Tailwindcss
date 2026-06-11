import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  text: string;
  sender: "sent" | "received";
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey, how are you?",
      sender: "received",
    },
    {
      id: 2,
      text: "I'm doing great. Working on React projects.",
      sender: "sent",
    },
    {
      id: 3,
      text: "Nice! Keep building.",
      sender: "received",
    },
  ]);

  const [input, setInput] = useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "sent",
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Auto reply received.",
          sender: "received",
        },
      ]);
    }, 1000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

      <div className="w-full max-w-md h-[700px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-slate-800 px-5 py-4 border-b border-slate-700">
          <h1 className="text-white text-xl font-bold">
            Chat UI
          </h1>
          <p className="text-slate-400 text-sm">
            Sent & Received States
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "sent"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[75%]
                  px-4
                  py-3
                  rounded-2xl
                  text-sm
                  shadow-lg
                  ${
                    message.sender === "sent"
                      ? "bg-cyan-500 text-black rounded-br-md"
                      : "bg-slate-700 text-white rounded-bl-md"
                  }
                `}
              >
                {message.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>

        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="
                flex-1
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-cyan-500
              "
            />

            <button
              onClick={sendMessage}
              className="
                px-5
                py-3
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-semibold
                rounded-xl
                transition
              "
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}