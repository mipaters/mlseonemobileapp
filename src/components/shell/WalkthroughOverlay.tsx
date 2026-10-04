import { useEffect } from "react";
import { RotateCcw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WALKTHROUGH_STEPS } from "../../data/walkthrough";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useAppState } from "../../store/AppState";
import { Button } from "../ui/Button";

const highlightColor = "#d4af37";

export function WalkthroughOverlay() {
  const { state, actions } = useAppState();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const totalSteps = WALKTHROUGH_STEPS.length;
  const activeStep = WALKTHROUGH_STEPS[state.walkthroughStep];

  useEffect(() => {
    if (!state.walkthroughActive || !activeStep) return;

    navigate(activeStep.route);

    if (activeStep.action === "personalizationCycle") {
      actions.runPersonalizationCycle();
    }
  }, [
    actions,
    activeStep,
    navigate,
    state.walkthroughActive,
  ]);

  useEffect(() => {
    if (!state.walkthroughActive || !activeStep) return;

    let disposed = false;
    const touchedElements: Array<{
      element: HTMLElement;
      outline: string;
      outlineOffset: string;
      boxShadow: string;
      borderRadius: string;
    }> = [];

    const timer = window.setTimeout(() => {
      if (disposed) return;

      activeStep.highlight.forEach((name) => {
        const element = document.querySelector<HTMLElement>(`[data-tour="${name}"]`);

        if (!element) return;

        touchedElements.push({
          element,
          outline: element.style.outline,
          outlineOffset: element.style.outlineOffset,
          boxShadow: element.style.boxShadow,
          borderRadius: element.style.borderRadius,
        });

        element.style.outline = `3px solid ${highlightColor}`;
        element.style.outlineOffset = "2px";
        element.style.boxShadow = "0 0 0 9999px rgba(3, 7, 18, 0.18)";
        element.style.borderRadius = element.style.borderRadius || "20px";
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      });
    }, 150);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      touchedElements.forEach(({ element, outline, outlineOffset, boxShadow, borderRadius }) => {
        element.style.outline = outline;
        element.style.outlineOffset = outlineOffset;
        element.style.boxShadow = boxShadow;
        element.style.borderRadius = borderRadius;
      });
    };
  }, [activeStep, state.walkthroughActive]);

  if (!state.walkthroughActive || !activeStep) return null;

  const isLastStep = state.walkthroughStep >= totalSteps - 1;

  const handlePrevious = () => {
    if (state.walkthroughStep <= 0) return;
    actions.setWalkthroughStep(state.walkthroughStep - 1);
  };

  const handleNext = () => {
    if (isLastStep) {
      actions.exitWalkthrough();
      navigate("/home");
      return;
    }

    actions.setWalkthroughStep(state.walkthroughStep + 1);
  };

  const handleRestart = () => {
    actions.setWalkthroughStep(0);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-navy-950/55" />

      <div
        className={`pointer-events-auto absolute ${
          isDesktop
            ? "bottom-6 right-6 top-6 w-[26rem] max-w-[calc(100vw-3rem)]"
            : "bottom-0 left-0 right-0"
        }`}
      >
        <div
          className={`flex h-full flex-col border border-white/10 bg-navy-900/96 shadow-2xl backdrop-blur ${
            isDesktop ? "rounded-[28px]" : "rounded-t-[28px]"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold">
                Step {state.walkthroughStep + 1} of {totalSteps}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">{activeStep.title}</h2>
            </div>
            <button
              type="button"
              onClick={actions.exitWalkthrough}
              className="rounded-full border border-white/10 p-2 text-silver-300 transition hover:bg-white/10"
              aria-label="Exit walkthrough"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <p className="text-sm leading-7 text-silver-200">{activeStep.narration}</p>
            <div className="mt-5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-accent-gold to-jays-600 transition-all"
                style={{ width: `${((state.walkthroughStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handlePrevious} disabled={state.walkthroughStep === 0}>
                Previous
              </Button>
              <Button onClick={handleNext}>{isLastStep ? "Finish" : "Next"}</Button>
              <Button variant="ghost" onClick={actions.exitWalkthrough}>
                Exit
              </Button>
              <Button variant="ghost" onClick={handleRestart}>
                <RotateCcw size={14} className="mr-2 inline" />
                Restart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
