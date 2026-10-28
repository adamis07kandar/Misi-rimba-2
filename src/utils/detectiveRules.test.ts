import test from 'node:test';
import assert from 'node:assert/strict';
import { DETECTIVE_QUESTIONS, generateCertificateCode, evaluatePerformance } from './detectiveRules';

test('detective questions contains exactly 3 mudah, 1 sederhana, 1 susah questions totaling 100 points', () => {
  assert.equal(DETECTIVE_QUESTIONS.length, 5);

  const mudahList = DETECTIVE_QUESTIONS.filter(q => q.level === 'mudah');
  const sederhanaList = DETECTIVE_QUESTIONS.filter(q => q.level === 'sederhana');
  const susahList = DETECTIVE_QUESTIONS.filter(q => q.level === 'susah');

  assert.equal(mudahList.length, 3, 'Must have 3 soalan mudah');
  assert.equal(sederhanaList.length, 1, 'Must have 1 soalan sederhana');
  assert.equal(susahList.length, 1, 'Must have 1 soalan susah');

  const totalPoints = DETECTIVE_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
  assert.equal(totalPoints, 100, 'Total points must equal 100');
});

test('generateCertificateCode produces unique valid formatted random code', () => {
  const code1 = generateCertificateCode('Ejen Ahmad');
  const code2 = generateCertificateCode('Ejen Siti');

  assert.match(code1, /^EJEN-[A-Z0-9]{4}-\d{4}-[A-Z0-9]{4}$/);
  assert.match(code2, /^EJEN-[A-Z0-9]{4}-\d{4}-[A-Z0-9]{4}$/);
  assert.notEqual(code1, code2, 'Certificate codes should be randomly different');
});

test('evaluatePerformance accurately awards 100 points for all correct answers and computes metrics', () => {
  const mockResults: Record<string, any> = {};
  DETECTIVE_QUESTIONS.forEach(q => {
    mockResults[q.id] = {
      questionId: q.id,
      selectedIndex: q.correctAnswerIndex,
      isCorrect: true,
      pointsEarned: q.points,
      timeSpentSeconds: 12
    };
  });

  const evaluation = evaluatePerformance(mockResults, 90);
  assert.equal(evaluation.totalScore, 100);
  assert.equal(evaluation.correctCount, 5);
  assert.equal(evaluation.rankGrade, 'A+');
  assert.equal(evaluation.metrics.observation, 100);
  assert.equal(evaluation.metrics.deduction, 100);
  assert.equal(evaluation.metrics.comprehension, 100);
});

test('evaluatePerformance handles partial results and awards correct grade', () => {
  const mockResults: Record<string, any> = {};
  // Only answer 2 easy questions correctly (30 points)
  mockResults['q1-rintihan'] = { questionId: 'q1-rintihan', selectedIndex: 0, isCorrect: true, pointsEarned: 15, timeSpentSeconds: 10 };
  mockResults['q2-batang-pokok'] = { questionId: 'q2-batang-pokok', selectedIndex: 1, isCorrect: true, pointsEarned: 15, timeSpentSeconds: 15 };
  mockResults['q3-tanduk-kerbau'] = { questionId: 'q3-tanduk-kerbau', selectedIndex: 0, isCorrect: false, pointsEarned: 0, timeSpentSeconds: 10 };
  mockResults['q4-motif-buaya'] = { questionId: 'q4-motif-buaya', selectedIndex: 0, isCorrect: false, pointsEarned: 0, timeSpentSeconds: 10 };
  mockResults['q5-taktik-kancil'] = { questionId: 'q5-taktik-kancil', selectedIndex: 0, isCorrect: false, pointsEarned: 0, timeSpentSeconds: 10 };

  const evaluation = evaluatePerformance(mockResults, 120);
  assert.equal(evaluation.totalScore, 30);
  assert.equal(evaluation.correctCount, 2);
  assert.equal(evaluation.rankGrade, 'C');
});
