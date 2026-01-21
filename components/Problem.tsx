// Problem Agitation: Dig into the emotional pain of creators who can't figure out why their reels underperform
const Problem = () => {
  return (
    <section
      className="bg-neutral text-neutral-content overflow-hidden relative"
      data-fast-scroll="scroll_to_problem"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-200 h-200 rounded-full bg-error/3 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-150 h-150 rounded-full bg-error/2 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 md:py-36 relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-error/10 border border-error/20 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-error"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-error">Sound familiar?</span>
          </div>

          <h2 className="max-w-4xl mx-auto font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15] sm:leading-[1.1] mb-6 sm:mb-8">
            Your reels aren&apos;t broken.
            <br />
            <span className="text-neutral-content/40">
              You just can&apos;t see what&apos;s killing them.
            </span>
          </h2>

          <p className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-neutral-content/60 leading-relaxed px-2">
            You&apos;re posting consistently. Following the trends. But your
            reach is stuck while similar creators blow up.
          </p>
        </div>

        {/* The Cycle - Circular Layout */}
        <div className="relative max-w-md sm:max-w-lg md:max-w-xl mx-auto mb-16 sm:mb-20 md:mb-24">
          {/* Circular path SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashed circle */}
            <circle
              cx="200"
              cy="200"
              r="150"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 8"
              className="text-error/20"
            />
            {/* Animated arrows along the path */}
            <g className="text-error/40">
              {/* Arrow 1 - top */}
              <path
                d="M200 50 L205 60 L195 60 Z"
                fill="currentColor"
                transform="rotate(45, 200, 200)"
              />
              {/* Arrow 2 - right */}
              <path
                d="M200 50 L205 60 L195 60 Z"
                fill="currentColor"
                transform="rotate(135, 200, 200)"
              />
              {/* Arrow 3 - bottom */}
              <path
                d="M200 50 L205 60 L195 60 Z"
                fill="currentColor"
                transform="rotate(225, 200, 200)"
              />
              {/* Arrow 4 - left */}
              <path
                d="M200 50 L205 60 L195 60 Z"
                fill="currentColor"
                transform="rotate(315, 200, 200)"
              />
            </g>
          </svg>

          {/* Steps positioned in a circle */}
          <div className="relative aspect-square">
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-error/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-error/5 border border-error/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium">
                  Endless cycle
                </span>
              </div>
            </div>

            {/* Step 1 - Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 flex flex-col items-center text-center group">
              <div className="relative z-10 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-neutral flex items-center justify-center border-2 border-error/30 group-hover:border-error/60 transition-all duration-300 mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl md:text-3xl">🎬</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base">Create</h3>
              <p className="text-[10px] sm:text-xs text-neutral-content/50 max-w-20 sm:max-w-24">
                Hours editing
              </p>
            </div>

            {/* Step 2 - Right */}
            <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 flex flex-col items-center text-center group">
              <div className="relative z-10 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-neutral flex items-center justify-center border-2 border-error/30 group-hover:border-error/60 transition-all duration-300 mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl md:text-3xl">📤</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base">Post</h3>
              <p className="text-[10px] sm:text-xs text-neutral-content/50 max-w-20 sm:max-w-24">
                Cross fingers
              </p>
            </div>

            {/* Step 3 - Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 flex flex-col items-center text-center group">
              <div className="relative z-10 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-neutral flex items-center justify-center border-2 border-error/30 group-hover:border-error/60 transition-all duration-300 mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl md:text-3xl">📉</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base">Flop</h3>
              <p className="text-[10px] sm:text-xs text-neutral-content/50 max-w-20 sm:max-w-24">
                200 views
              </p>
            </div>

            {/* Step 4 - Left */}
            <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 flex flex-col items-center text-center group">
              <div className="relative z-10 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-neutral flex items-center justify-center border-2 border-error/30 group-hover:border-error/60 transition-all duration-300 mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl md:text-3xl">🔄</span>
              </div>
              <h3 className="font-bold text-sm sm:text-base">Repeat</h3>
              <p className="text-[10px] sm:text-xs text-neutral-content/50 max-w-20 sm:max-w-24">
                Try again
              </p>
            </div>
          </div>
        </div>

        {/* The Real Problem - Big stat callout */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-linear-to-br from-error/10 to-error/5 border border-error/20 p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 md:mb-20 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Stat first on mobile for impact */}
            <div className="flex flex-col items-center justify-center md:order-2">
              <div className="text-center">
                <span className="text-6xl sm:text-7xl md:text-8xl font-black text-error">
                  2.3s
                </span>
                <p className="text-sm sm:text-base text-neutral-content/50 mt-1 sm:mt-2">
                  Average time before viewers swipe
                </p>
              </div>
            </div>

            <div className="text-center md:text-left md:order-1">
              <p className="text-error font-medium mb-2 sm:mb-4 text-sm sm:text-base">
                The hidden truth
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                It&apos;s not the algorithm.
                <br />
                <span className="text-neutral-content/60">
                  It&apos;s the first 2 seconds.
                </span>
              </h3>
              <p className="text-sm sm:text-base text-neutral-content/60 leading-relaxed">
                The algorithm isn&apos;t against you. It&apos;s just responding
                to what viewers do—and they&apos;re leaving fast.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="max-w-3xl mx-auto text-center px-2">
          <div className="relative">
            <svg
              className="absolute -top-4 -left-2 sm:-top-6 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 text-neutral-content/10"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
            </svg>
            <p className="text-lg sm:text-2xl md:text-3xl font-medium text-neutral-content/80 italic leading-relaxed">
              &quot;I was posting 3x a day for months. Same results. Turns out
              my first 2 seconds were killing every single video.&quot;
            </p>
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-neutral-content/50">
            — Every creator before finding the real problem
          </p>
        </div>

        {/* Transition arrow */}
        <div className="flex justify-center mt-12 sm:mt-16 md:mt-20">
          <div className="flex flex-col items-center gap-3 sm:gap-4 animate-bounce">
            <span className="text-xs sm:text-sm text-neutral-content/40 uppercase tracking-wider">
              The solution
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6 text-success"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
