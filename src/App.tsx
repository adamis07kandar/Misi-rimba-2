import React, { useState, useEffect } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { DetectiveRoom } from './components/DetectiveRoom';
import { QuestionModal } from './components/QuestionModal';
import { PerformanceReport } from './components/PerformanceReport';
import { CertificateView } from './components/CertificateView';
import { StoryBriefingModal } from './components/StoryBriefingModal';
import { SavedCertificatesModal } from './components/SavedCertificatesModal';
import { DetectiveCursor } from './components/DetectiveCursor';
import { useHandTracking } from './hooks/useHandTracking';
import { AgentProfile, DetectiveQuestion, GameScreen, PerformanceAnalysis, QuestionResult } from './types/game';
import { evaluatePerformance, generateCertificateCode, DETECTIVE_QUESTIONS } from './utils/detectiveRules';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('registration');
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [answers, setAnswers] = useState<Record<string, QuestionResult>>({});
  const [activeQuestion, setActiveQuestion] = useState<DetectiveQuestion | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isSavedCertsOpen, setIsSavedCertsOpen] = useState<boolean>(false);
  const [performance, setPerformance] = useState<PerformanceAnalysis | null>(null);

  const handTracking = useHandTracking();

  // Autostart query parameter support for rapid verification and testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' && !agent) {
        const dummyAgent: AgentProfile = {
          name: 'Ejen Danial Harith',
          classroom: '5 Wawasan',
          school: 'SK Seri Mutiara',
          agentId: 'AGT-8472',
          certificateCode: generateCertificateCode('Ejen Danial Harith'),
          startedAt: Date.now()
        };
        setAgent(dummyAgent);
        setCurrentScreen('room');
      }
    }
  }, [agent]);

  const handleStartMission = (profile: AgentProfile) => {
    setAgent(profile);
    setCurrentScreen('room');
  };

  const handleSelectClue = (question: DetectiveQuestion) => {
    setActiveQuestion(question);
  };

  const handleAnswerQuestion = (result: QuestionResult) => {
    setAnswers(prev => ({
      ...prev,
      [result.questionId]: result
    }));
  };

  const handleCloseQuestionModal = () => {
    setActiveQuestion(null);
  };

  const handleFinishCase = () => {
    if (!agent) return;
    const durationSeconds = Math.max(10, Math.round((Date.now() - agent.startedAt) / 1000));
    const perf = evaluatePerformance(answers, durationSeconds);
    setPerformance(perf);
    setCurrentScreen('results');
  };

  const handleViewCertificate = () => {
    setCurrentScreen('certificate');
  };

  const handleBackToReport = () => {
    setCurrentScreen('results');
  };

  const handleRetestRoom = () => {
    setCurrentScreen('room');
  };

  const handleNewMission = () => {
    setAnswers({});
    setPerformance(null);
    setAgent(null);
    setCurrentScreen('registration');
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-amber-500 selection:text-black">
      {/* Interactive Detective Cursor and Camera HUD */}
      <DetectiveCursor tracking={handTracking} />

      {/* Screen Render */}
      {currentScreen === 'registration' && (
        <TitleScreen
          onStartMission={handleStartMission}
          isCameraActive={handTracking.isCameraActive}
          onToggleCamera={handTracking.toggleCamera}
          isCameraLoading={handTracking.isLoading}
          onOpenStoryBriefing={() => setIsStoryModalOpen(true)}
          onOpenSavedCertificates={() => setIsSavedCertsOpen(true)}
        />
      )}

      {currentScreen === 'room' && agent && (
        <DetectiveRoom
          agent={agent}
          answers={answers}
          onSelectClue={handleSelectClue}
          onFinishCase={handleFinishCase}
          onOpenStoryBriefing={() => setIsStoryModalOpen(true)}
        />
      )}

      {currentScreen === 'results' && agent && performance && (
        <PerformanceReport
          agent={agent}
          performance={performance}
          onViewCertificate={handleViewCertificate}
          onRetest={handleRetestRoom}
        />
      )}

      {currentScreen === 'certificate' && agent && performance && (
        <CertificateView
          agent={agent}
          performance={performance}
          onBackToReport={handleBackToReport}
          onNewMission={handleNewMission}
        />
      )}

      {/* Question Docket Modal */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          existingResult={answers[activeQuestion.id]}
          onAnswer={handleAnswerQuestion}
          onClose={handleCloseQuestionModal}
        />
      )}

      {/* Story Background Briefing Modal (Sang Buaya, Kancil dan Kerbau) */}
      {isStoryModalOpen && (
        <StoryBriefingModal onClose={() => setIsStoryModalOpen(false)} />
      )}

      {/* Saved Certificates Modal */}
      {isSavedCertsOpen && (
        <SavedCertificatesModal onClose={() => setIsSavedCertsOpen(false)} />
      )}
    </div>
  );
}
