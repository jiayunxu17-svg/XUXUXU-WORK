import * as React from "react"
import { useEffect, useMemo, useRef } from "react"
import {
    motion,
    stagger,
    useAnimate,
    type AnimationOptions,
} from "motion/react"

const useIsStaticRenderer = () => false

type StaggerFrom = "first" | "last" | "center" | "random"

type Props = {
    label?: string
    fromWeight?: number
    toWeight?: number
    staggerDuration?: number
    staggerFrom?: StaggerFrom
    fontSize?: number | string
    color?: string
    transition?: AnimationOptions
    onClick?: () => void
    style?: React.CSSProperties
    className?: string
}

const COMPONENT_DEFAULTS = {
    label: "XU JIAYUN",
    fromWeight: 400,
    toWeight: 900,
    fontSize: 102,
    color: "#FFFFFF",
    staggerDuration: 29,
    staggerFrom: "first" as StaggerFrom,
    transition: {
        type: "spring" as const,
        duration: 0.7,
        bounce: 0.2,
    },
}

function __OriginkitBase_VariableFontHoverByLetter(props: Props) {
    const mergedProps = { ...COMPONENT_DEFAULTS, ...props }
    const {
        label,
        fromWeight,
        toWeight,
        staggerDuration,
        staggerFrom,
        fontSize,
        color,
        onClick,
        style,
        className,
    } = mergedProps

    // Resting / hover wght as variation-settings strings.
    const fromSettings = `'wght' ${fromWeight}`
    const toSettings = `'wght' ${toWeight}`

    // Stagger slider is whole-number (ms); convert to seconds for stagger().
    const staggerSec = Math.max(0, staggerDuration) / 1000

    const isStatic = useIsStaticRenderer()
    const [scope, animate] = useAnimate()

    // Shuffled per-letter indices for the "random" stagger variant.
    const shuffledIndices = useMemo(() => {
        if (staggerFrom !== "random") return null
        const len = label ? label.length : 0
        const indices = Array.from({ length: len }, (_, i) => i)
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[indices[i], indices[j]] = [indices[j], indices[i]]
        }
        return indices
    }, [label, staggerFrom])

    // Transition from the control, with a sane fallback.
    const transition: AnimationOptions = useMemo(() => {
        return (
            mergedProps.transition ??
            ({ type: "spring", duration: 0.7 } as AnimationOptions)
        )
    }, [mergedProps.transition])

    const mergeStagger = (base: AnimationOptions): AnimationOptions => {
        if (staggerFrom === "random" && shuffledIndices) {
            const indices = shuffledIndices
            return {
                ...base,
                delay: (i: number) => staggerSec * (indices[i] ?? 0),
            } as AnimationOptions
        }
        return {
            ...base,
            delay: stagger(staggerSec, { from: staggerFrom as any }),
        } as AnimationOptions
    }

    // ---- Debounced hover handlers ----------------------------------------
    const debouncedHoverStartRef = useRef<(() => void) | null>(null)
    const debouncedHoverEndRef = useRef<(() => void) | null>(null)
    const timerRefs = useRef<{
        startTimer: ReturnType<typeof setTimeout> | null
        startTrailing: boolean
        endTimer: ReturnType<typeof setTimeout> | null
        endTrailing: boolean
    }>({
        startTimer: null,
        startTrailing: false,
        endTimer: null,
        endTrailing: false,
    })

    useEffect(() => {
        if (isStatic) return

        const runStart = () => {
            animate(
                ".letter",
                { fontVariationSettings: toSettings },
                mergeStagger(transition)
            )
        }

        const runEnd = () => {
            animate(
                ".letter",
                { fontVariationSettings: fromSettings },
                mergeStagger(transition)
            )
        }

        const wait = 100
        const t = timerRefs.current

        debouncedHoverStartRef.current = () => {
            if (!t.startTimer) {
                runStart()
                t.startTimer = setTimeout(() => {
                    if (t.startTrailing) runStart()
                    t.startTrailing = false
                    t.startTimer = null
                }, wait)
            } else {
                t.startTrailing = true
            }
        }

        debouncedHoverEndRef.current = () => {
            if (!t.endTimer) {
                runEnd()
                t.endTimer = setTimeout(() => {
                    if (t.endTrailing) runEnd()
                    t.endTrailing = false
                    t.endTimer = null
                }, wait)
            } else {
                t.endTrailing = true
            }
        }

        return () => {
            if (t.startTimer) clearTimeout(t.startTimer)
            if (t.endTimer) clearTimeout(t.endTimer)
            t.startTimer = null
            t.endTimer = null
            t.startTrailing = false
            t.endTrailing = false
        }
    }, [
        isStatic,
        fromSettings,
        toSettings,
        staggerSec,
        staggerFrom,
        shuffledIndices,
        transition,
        animate,
    ])

    const handleHoverStart = () => debouncedHoverStartRef.current?.()
    const handleHoverEnd = () => debouncedHoverEndRef.current?.()

    const srOnlyStyle: React.CSSProperties = {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
    }

    const innerSpanStyle: React.CSSProperties = {
        fontFamily: VARIABLE_FONT_STACK,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        color,
        lineHeight: 1,
    }

    const letters = label ? label.split("") : []

    const interactive = !isStatic
    const handlers = !interactive
        ? {}
        : {
              onMouseEnter: handleHoverStart,
              onMouseLeave: handleHoverEnd,
              onClick,
          }

    return (
        <div
            className={className}
            style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: interactive
                    ? onClick
                        ? "pointer"
                        : "default"
                    : undefined,
                ...style,
            }}
            {...handlers}
        >
            <style>{INTER_VARIABLE_FONT_FACE}</style>
            {letters.length === 0 ? null : (
                <span ref={scope} style={innerSpanStyle}>
                    <span style={srOnlyStyle}>{label}</span>
                    {letters.map((letter, i) => (
                        <motion.span
                            key={i}
                            className="letter"
                            aria-hidden
                            style={{
                                display: "inline-block",
                                whiteSpace: "pre",
                                fontVariationSettings: fromSettings,
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </span>
            )}
        </div>
    )
}

const INTER_VARIABLE_FONT_FACE = `
@font-face {
    font-family: "InterVariableFramer";
    src: url("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0") format("woff2-variations");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}
`

const VARIABLE_FONT_STACK =
    '"InterVariableFramer", "Inter Variable", "Inter", system-ui, sans-serif'

export default function VariableFontHoverByLetter(props: Props) {
    return <__OriginkitBase_VariableFontHoverByLetter {...props} />;
}
