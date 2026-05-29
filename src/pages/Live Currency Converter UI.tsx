import { useState } from 'react';

export default function App() {

  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    INR: 83.12,
    GBP: 0.79,
    JPY: 156.45,
    AUD: 1.51,
  };

  const [amount, setAmount] =
    useState<number>(100);

  const [fromCurrency, setFromCurrency] =
    useState<string>('USD');

  const [toCurrency, setToCurrency] =
    useState<string>('INR');

  // Convert Currency
  const convertCurrency = () => {

    const usdAmount =
      amount / rates[fromCurrency];

    return (
      usdAmount * rates[toCurrency]
    ).toFixed(2);
  };

  // Swap Currency
  const swapCurrencies = () => {

    setFromCurrency(toCurrency);

    setToCurrency(fromCurrency);
  };

  return (
    <div className="
      min-h-screen
      bg-gray-950
      flex
      items-center
      justify-center
      p-6
    ">

      <div className="
        relative
        w-full
        max-w-md
        bg-gray-900
        border
        border-gray-800
        rounded-3xl
        p-8
        shadow-2xl
        overflow-hidden
      ">

        {/* Glow */}
        <div className="
          absolute
          top-0
          right-0
          w-40
          h-40
          bg-cyan-500/10
          blur-3xl
          rounded-full
        " />

        {/* Heading */}
        <div className="relative z-10">

          <h1 className="
            text-4xl
            font-bold
            text-white
            mb-2
          ">
            Currency Converter
          </h1>

          <p className="
            text-gray-400
            mb-8
          ">
            Live conversion UI with React state
          </p>

          {/* Amount */}
          <div className="mb-6">

            <label className="
              block
              text-sm
              text-gray-400
              mb-2
            ">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Number(e.target.value)
                )
              }
              className="
                w-full
                bg-gray-800
                border
                border-gray-700
                rounded-2xl
                px-5
                py-4
                text-white
                text-xl
                outline-none
                focus:border-cyan-500
              "
            />
          </div>

          {/* Currency Selectors */}
          <div className="
            flex
            items-center
            gap-4
          ">

            {/* From */}
            <div className="flex-1">

              <label className="
                block
                text-sm
                text-gray-400
                mb-2
              ">
                From
              </label>

              <select
                value={fromCurrency}
                onChange={(e) =>
                  setFromCurrency(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-gray-800
                  border
                  border-gray-700
                  rounded-2xl
                  px-4
                  py-4
                  text-white
                  outline-none
                  focus:border-cyan-500
                "
              >

                {Object.keys(rates).map(
                  (currency) => (

                    <option
                      key={currency}
                      value={currency}
                    >
                      {currency}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={swapCurrencies}
              className="
                mt-7
                w-14
                h-14
                rounded-full
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                text-2xl
                font-bold
                transition
                hover:rotate-180
              "
            >
              ⇄
            </button>

            {/* To */}
            <div className="flex-1">

              <label className="
                block
                text-sm
                text-gray-400
                mb-2
              ">
                To
              </label>

              <select
                value={toCurrency}
                onChange={(e) =>
                  setToCurrency(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-gray-800
                  border
                  border-gray-700
                  rounded-2xl
                  px-4
                  py-4
                  text-white
                  outline-none
                  focus:border-cyan-500
                "
              >

                {Object.keys(rates).map(
                  (currency) => (

                    <option
                      key={currency}
                      value={currency}
                    >
                      {currency}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* Result */}
          <div className="
            mt-10
            bg-gray-800
            rounded-3xl
            p-6
            border
            border-gray-700
          ">

            <p className="
              text-gray-400
              mb-3
            ">
              Converted Amount
            </p>

            <h2 className="
              text-5xl
              font-bold
              text-white
            ">
              {convertCurrency()}
            </h2>

            <p className="
              mt-3
              text-cyan-400
              text-lg
            ">
              {fromCurrency}
              {' '}
              →
              {' '}
              {toCurrency}
            </p>
          </div>

          {/* Footer */}
          <div className="
            mt-8
            grid
            grid-cols-3
            gap-4
          ">

            <div className="
              bg-gray-800
              rounded-2xl
              p-4
              text-center
            ">
              <h3 className="
                text-white
                font-bold
              ">
                React
              </h3>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                useState
              </p>
            </div>

            <div className="
              bg-gray-800
              rounded-2xl
              p-4
              text-center
            ">
              <h3 className="
                text-white
                font-bold
              ">
                Dynamic
              </h3>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Conversion
              </p>
            </div>

            <div className="
              bg-gray-800
              rounded-2xl
              p-4
              text-center
            ">
              <h3 className="
                text-white
                font-bold
              ">
                Tailwind
              </h3>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Modern UI
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}