import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEvidence, validateFacts, assessLegalApplicability, getCrossDomainLinks, buildAnalysis } from '../src/intelligence/engine.js';

const law = { id: 'law-1', class: 'LAW', source: 'Official legal publication', scope: 'national', jurisdiction: 'RU', date: '2026-01-01', effectiveStatus: 'in_force' };

test('evidence validation requires jurisdiction and effective status for law', () => {
  assert.equal(validateEvidence([law]).valid, true);
  assert.equal(validateEvidence([{ ...law, jurisdiction: undefined }]).valid, false);
});

test('observed facts require traceable source and unknown is not zero', () => {
  assert.equal(validateFacts([{ id: 'f1', status: 'observed', value: 12, sourceIds: ['law-1'] }], [law]).valid, true);
  assert.equal(validateFacts([{ id: 'f2', status: 'observed', value: 0 }], [law]).valid, false);
  assert.equal(validateFacts([{ id: 'f3', status: 'unknown', value: null }], [law]).valid, true);
});

test('legal applicability remains unknown when profile data are missing', () => {
  const req = { jurisdiction: 'RU', source: 'Official act', effectiveStatus: 'in_force', requiredProfileFields: ['hasGas'], appliesWhen: p => p.hasGas === true };
  assert.equal(assessLegalApplicability(req, {}).status, 'cannot_determine');
  assert.equal(assessLegalApplicability(req, { hasGas: false }).applicable, false);
});

test('cross-domain mapping connects labor cost with operational drivers', () => {
  assert.ok(getCrossDomainLinks('labor_cost').includes('productivity'));
  assert.deepEqual(getCrossDomainLinks('not-a-domain'), []);
});

test('analysis envelope flags incomplete actions and unsupported hypotheses', () => {
  const result = buildAnalysis({ evidence: [law], facts: [{ id: 'f1', status: 'observed', value: 1, sourceIds: ['law-1'] }], hypotheses: [{ id: 'h1', label: 'HYPOTHESIS', text: 'Possible driver' }], actions: [{ ownerRole: 'Manager', dueOrTiming: 'Next shift', verificationMetric: 'Repeat issue count' }] });
  assert.equal(result.readiness, 'structured');
  const incomplete = buildAnalysis({ actions: [{ ownerRole: 'Manager' }] });
  assert.equal(incomplete.readiness, 'needs_review');
  assert.ok(incomplete.integrity.actionIssues.length);
});
