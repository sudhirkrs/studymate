// Thin wrapper around the Anthropic Messages API: streaming, Indian-legal
// web search, pause_turn continuation, refusal fallback, and demo mode.
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import { demoStream } from './demo.js';

// Web search is restricted to primary and reputable Indian legal sources.
export const LEGAL_DOMAINS = [
  'sci.gov.in',
  'main.sci.gov.in',
  'indiankanoon.org',
  'indiacode.nic.in',
  'egazette.gov.in',
  'legislative.gov.in',
  'lawmin.gov.in',
  'ecourts.gov.in',
  'delhihighcourt.nic.in',
  'bombayhighcourt.nic.in',
  'hcmadras.tn.gov.in',
  'calcuttahighcourt.gov.in',
  'karnatakajudiciary.kar.nic.in',
  'allahabadhighcourt.in',
  'phhc.gov.in',
  'hckerala.gov.in',
  'tshc.gov.in',
  'gujarathighcourt.nic.in',
  'rbi.org.in',
  'sebi.gov.in',
  'mca.gov.in',
  'ibbi.gov.in',
  'cbic-gst.gov.in',
  'incometaxindia.gov.in',
  'nclat.nic.in',
  'mha.gov.in',
  'prsindia.org',
  'livelaw.in',
  'barandbench.com',
  'scobserver.in',
];

let client;
function anthropic() {
  if (!client) client = new Anthropic({ apiKey: config.anthropicKey, maxRetries: 3 });
  return client;
}

/**
 * Stream a response.
 * @param {object} o
 * @param {string} o.system
 * @param {Array} o.messages Anthropic MessageParam[]
 * @param {boolean} [o.webSearch]
 * @param {number} [o.maxSearches]
 * @param {'low'|'medium'|'high'|'xhigh'|'max'} [o.effort]
 * @param {number} [o.maxTokens]
 * @param {(e: object) => void} [o.onEvent] receives {type:'text'|'status'|'source', ...}
 * @param {'research'|'draft'|'redraft'|'review'} [o.kind] used by demo mode
 * @param {AbortSignal} [o.signal]
 */
export async function runStream(o) {
  const onEvent = o.onEvent || (() => {});
  if (config.demoMode) return demoStream(o, onEvent);

  const tools = o.webSearch
    ? [{ type: 'web_search_20260209', name: 'web_search', max_uses: o.maxSearches || 6, allowed_domains: LEGAL_DOMAINS, user_location: { type: 'approximate', country: 'IN', timezone: 'Asia/Kolkata' } }]
    : undefined;

  const messages = [...o.messages];
  const usage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, server_tool_use: { web_search_requests: 0 } };
  const sources = new Map();
  let text = '';
  let stopReason = null;

  // A server-tool turn can pause (pause_turn); resend with the partial
  // assistant turn appended to let it continue. Cap continuations.
  for (let round = 0; round < 5; round++) {
    const params = {
      model: config.model,
      max_tokens: o.maxTokens || 32000,
      system: [{ type: 'text', text: o.system, cache_control: { type: 'ephemeral' } }],
      messages,
      thinking: { type: 'adaptive' },
      output_config: { effort: o.effort || 'high' },
      ...(tools ? { tools } : {}),
      ...(config.fallbacks ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' } : {}),
    };
    const stream = config.fallbacks
      ? anthropic().beta.messages.stream(params, { signal: o.signal })
      : anthropic().messages.stream(params, { signal: o.signal });

    for await (const ev of stream) {
      if (ev.type === 'content_block_start') {
        const b = ev.content_block;
        if (b.type === 'server_tool_use') onEvent({ type: 'status', message: 'Searching Indian legal sources…' });
        if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
          for (const r of b.content) {
            if (r.type === 'web_search_result' && !sources.has(r.url)) {
              sources.set(r.url, { url: r.url, title: r.title || r.url, snippets: [] });
              onEvent({ type: 'source', url: r.url, title: r.title || r.url });
            }
          }
        }
      } else if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
        text += ev.delta.text;
        onEvent({ type: 'text', text: ev.delta.text });
      }
    }

    const msg = await stream.finalMessage();
    stopReason = msg.stop_reason;
    for (const k of ['input_tokens', 'output_tokens', 'cache_read_input_tokens']) usage[k] += msg.usage?.[k] || 0;
    usage.server_tool_use.web_search_requests += msg.usage?.server_tool_use?.web_search_requests || 0;

    // Web-search citations carry the exact text the model relied on — keep
    // them so Citation Guard can check authorities against real sources.
    for (const block of msg.content) {
      if (block.type === 'text' && Array.isArray(block.citations)) {
        for (const c of block.citations) {
          if (!c.url) continue;
          const s = sources.get(c.url) || { url: c.url, title: c.title || c.url, snippets: [] };
          if (c.cited_text) s.snippets.push(c.cited_text);
          sources.set(c.url, s);
        }
      }
    }

    if (stopReason === 'pause_turn') {
      messages.push({ role: 'assistant', content: msg.content });
      continue;
    }
    break;
  }

  if (stopReason === 'refusal') {
    const note = '\n\n_This request could not be completed. Please rephrase or narrow the question._';
    text += note;
    onEvent({ type: 'text', text: note });
  }
  if (stopReason === 'max_tokens') {
    const note = '\n\n_[Output reached the length limit — ask to continue from the last section.]_';
    text += note;
    onEvent({ type: 'text', text: note });
  }

  return { text, sources: [...sources.values()], usage, stopReason };
}
