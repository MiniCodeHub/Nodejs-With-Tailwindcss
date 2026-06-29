import { useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="bg-slate-900 rounded-3xl p-10 text-center max-w-md w-full border border-slate-800">
          <div className="text-6xl mb-4">🎉</div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Thank You!
          </h1>

          <p className="text-slate-400">
            Your feedback has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-900 rounded-3xl p-8 border border-slate-800">

        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex-1 flex items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  step >= item
                    ? "bg-cyan-500"
                    : "bg-slate-700"
                }`}
              >
                {item}
              </div>

              {item !== 3 && (
                <div
                  className={`flex-1 h-1 ${
                    step > item
                      ? "bg-cyan-500"
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="text-3xl text-white font-bold mb-3">
              Rate Your Experience
            </h2>

            <p className="text-slate-400 mb-8">
              Click a star to rate.
            </p>

            <div className="flex justify-center gap-3 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() =>
                    setHover(star)
                  }
                  onMouseLeave={() =>
                    setHover(0)
                  }
                  onClick={() =>
                    setRating(star)
                  }
                  className="text-5xl transition-transform hover:scale-110"
                >
                  {star <= (hover || rating)
                    ? "⭐"
                    : "☆"}
                </button>
              ))}
            </div>

            <button
              disabled={rating === 0}
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-cyan-500 text-white font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 className="text-3xl text-white font-bold mb-3">
              Leave a Comment
            </h2>

            <textarea
              rows={5}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Tell us what you think..."
              className="w-full rounded-xl bg-slate-800 text-white p-4 outline-none border border-slate-700 resize-none mb-8"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-white"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-cyan-500 text-white"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h2 className="text-3xl text-white font-bold mb-6">
              Review Feedback
            </h2>

            <div className="bg-slate-800 rounded-2xl p-6 mb-8">
              <p className="text-slate-400 mb-3">
                Rating
              </p>

              <div className="text-3xl mb-6">
                {"⭐".repeat(rating)}
              </div>

              <p className="text-slate-400 mb-2">
                Comment
              </p>

              <p className="text-white">
                {comment || "No comment provided."}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-white"
              >
                Back
              </button>

              <button
                onClick={() => setSubmitted(true)}
                className="flex-1 py-3 rounded-xl bg-green-500 text-white"
              >
                Submit
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}