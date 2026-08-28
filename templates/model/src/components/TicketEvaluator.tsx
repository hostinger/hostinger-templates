"use client";

import { useRef, useState } from "react";
import { siteContent } from "@/content/site";
import { classifyTicket } from "@/lib/classifyTicket";
import type { Classification } from "@/types/model";
import { CalibrationPlot } from "./CalibrationPlot";

const initialText = siteContent.examples[0].text;

export function TicketEvaluator() {
  const [input, setInput] = useState(initialText);
  const [result, setResult] = useState<Classification>(() => classifyTicket(initialText));
  const resultRef = useRef<HTMLElement>(null);

  function evaluate(text = input) {
    const clean = text.trim();
    if (!clean) return;
    setResult(classifyTicket(clean));
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function selectExample(text: string) {
    setInput(text);
    evaluate(text);
  }

  return (
    <section className="evaluation" id="evaluation" aria-labelledby="evaluation-title">
      <div className="section-index">
        <span>01</span>
        <p>Interactive evaluation</p>
      </div>
      <div className="lab-shell">
        <div className="lab-bar">
          <span className="status-dot" aria-hidden="true" />
          <span>MODEL-TICKET-04</span>
          <strong>LOCAL DEMO</strong>
          <span>NO NETWORK</span>
        </div>
        <div className="lab-grid">
          <div className="input-pane">
            <div className="pane-heading">
              <div>
                <span className="kicker">INPUT / RAW TICKET</span>
                <h2 id="evaluation-title">Run a ticket through the model.</h2>
              </div>
              <span className="sample-id">SAMPLE_001</span>
            </div>
            <label htmlFor="ticket">Support request</label>
            <textarea
              id="ticket"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={7}
              maxLength={600}
            />
            <div className="input-meta">
              <span>{input.length}/600 chars</span>
              <span>English</span>
            </div>
            <div className="example-list" aria-label="Example tickets">
              <span>Load sample:</span>
              {siteContent.examples.map((example, index) => (
                <button key={example.label} type="button" onClick={() => selectExample(example.text)}>
                  0{index + 1} {example.label}
                </button>
              ))}
            </div>
            <button className="button evaluate-button" type="button" onClick={() => evaluate()}>
              Evaluate ticket <span>→</span>
            </button>
            <p className="local-note">Runs locally with bundled keyword rules. No API calls, no data storage.</p>
          </div>

          <section className="output-pane" ref={resultRef} tabIndex={-1} aria-live="polite" aria-label="Classification result">
            <div className="output-header">
              <span className="kicker">OUTPUT / CLASSIFICATION</span>
              <span className="complete">● COMPLETE</span>
            </div>
            <div className="primary-result">
              <div>
                <span>Category</span>
                <strong>{result.category}</strong>
              </div>
              <div>
                <span>Urgency</span>
                <strong className={`urgency urgency-${result.urgency.toLowerCase()}`}>{result.urgency}</strong>
              </div>
              <div>
                <span>Confidence</span>
                <strong>{result.confidence}%</strong>
              </div>
            </div>
            <div className="signal-row">
              <span>Detected signals</span>
              <div>{result.signals.map((signal) => <code key={signal}>{signal}</code>)}</div>
            </div>
            <div className="action-block">
              <span>Recommended next action</span>
              <p>{result.nextAction}</p>
            </div>
            <div className="draft-block">
              <span>Draft reply</span>
              <p>“{result.responseDraft}”</p>
            </div>
            <CalibrationPlot confidence={result.confidence} />
          </section>
        </div>
      </div>
    </section>
  );
}
