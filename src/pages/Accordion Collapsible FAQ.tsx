import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center text-white font-medium"
            >
              {item.question}
              <span
                className={`transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-40 py-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-400 text-sm">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const faqData: FAQItem[] = [
    {
      question: 'What is React?',
      answer:
        'React is a JavaScript library for building user interfaces using components.',
    },
    {
      question: 'What is Tailwind CSS?',
      answer:
        'Tailwind is a utility-first CSS framework for rapidly building modern interfaces.',
    },
    {
      question: 'Can I open multiple sections?',
      answer:
        'Yes. Set allowMultiple to true to enable multiple open sections.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Accordion FAQ Component
        </h1>

        {/* Single Open Mode */}
        <Accordion items={faqData} allowMultiple={false} />

        {/* To allow multiple open sections, use: */}
        {/* <Accordion items={faqData} allowMultiple={true} /> */}
      </div>
    </div>
  );
}