import { DetectiveQuestion, DifficultyLevel, PerformanceAnalysis, QuestionResult } from '../types/game';

export const DETECTIVE_QUESTIONS: DetectiveQuestion[] = [
  {
    id: 'q1-rintihan',
    level: 'mudah',
    clueTitle: 'Pita Rakaman & Papan Kenyataan Hutan',
    clueIcon: 'Radio',
    clueLocationName: 'Papan Bukti Jenayah',
    points: 15,
    narrativeContext: 'Pita audio merakamkan suara rintihan kecemasan di pinggir sungai yang indah.',
    question: 'Berdasarkan siasatan kes di lokasi kejadian tepi sungai, siapakah watak yang mendengar rintihan meminta tolong dan berhati mulia pergi menyiasat?',
    options: [
      'Sang Kerbau yang baik hati',
      'Sang Harimau pemburu',
      'Sang Gajah perkasa',
      'Sang Burung Murai'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dalam rekod kes, Sang Kerbau yang sedang berada di hutan dekat sebatang sungai mendengar suara rintihan Sang Buaya lalu segera mencari arah suara tersebut untuk menghulurkan bantuan.'
  },
  {
    id: 'q2-batang-pokok',
    level: 'mudah',
    clueTitle: 'Sampel Balak & Analisis Himpitan',
    clueIcon: 'Trees',
    clueLocationName: 'Meja Forensik Hutan',
    points: 15,
    narrativeContext: 'Ukuran berat dan kesan tekanan membuktikan objek besar menindih mangsa awal.',
    question: 'Apakah bukti fizikal utama yang menjadi punca kecemasan Sang Buaya terperangkap sehingga ia langsung tidak dapat bergerak?',
    options: [
      'Terjerat di dalam jaring perangkap pemburu haram',
      'Dihempap oleh batang pokok yang besar',
      'Terkandas di atas beting lumpur pasir jerlus',
      'Kakinya tersangkut pada rekahan batu tebing sungai'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sang Buaya merayu dalam kesakitan kerana badannya tertekan dihempap oleh sebatang pokok yang besar sehingga tidak berdaya melarikan diri.'
  },
  {
    id: 'q3-tanduk-kerbau',
    level: 'mudah',
    clueTitle: 'Kesan Mekanikal & Cetakan Tanduk',
    clueIcon: 'ShieldAlert',
    clueLocationName: 'Rak Fail & Bukti Fizikal',
    points: 15,
    narrativeContext: 'Pemeriksaan fizikal menunjukkan alatan semula jadi digunakan untuk kerja menyelamat berat.',
    question: 'Menurut keterangan saksi dan lakaran bukti forensik, bagaimanakah cara Sang Kerbau berjaya mengangkat beban batang pokok untuk membebaskan Sang Buaya?',
    options: [
      'Menolak kayu tersebut menggunakan berat badannya yang sasa',
      'Menarik pokok dengan menggunakan lilitan akar rotan rimba',
      'Menggunakan tanduknya untuk mengangkat dan mengalihkan batang pokok',
      'Meminta bantuan sekumpulan haiwan lain untuk menolak bersama'
    ],
    correctAnswerIndex: 2,
    explanation: 'Sang Kerbau menggunakan sepasang tanduknya yang kuat sebagai tuas untuk mengangkat dan mengalihkan batang pokok besar yang menimpa Sang Buaya.'
  },
  {
    id: 'q4-motif-buaya',
    level: 'sederhana',
    clueTitle: 'Fail Psikologi & Profil Motif Serangan',
    clueIcon: 'Brain',
    clueLocationName: 'Cermin Profil Psikologi',
    points: 25,
    narrativeContext: 'Kesan gigitan pada kaki Sang Kerbau mendedahkan niat khianat yang mengejutkan.',
    question: 'Selepas bebas dari timpan kayu, Sang Buaya segera menerkam kaki Sang Kerbau. Apakah motif utama dan sifat negatif di sebalik pengkhianatan ini?',
    options: [
      'Tindakan refleks kerana menyangka Sang Kerbau hendak mencederakannya',
      'Sifat buaya yang tidak mengenang budi dan dikuasai nafsu lapar melampau sehingga sanggup mengkhianati penyelamatnya',
      'Terhasut oleh bisikan pemangsa sungai yang lain',
      'Berasa dendam lama terhadap keluarga Sang Kerbau di lembah sungai'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sang Buaya tidak mengenang jasa baik Sang Kerbau. Walaupun baru diselamatkan daripada maut, ia mengutamakan nafsu laparnya sendiri dengan membalas jasa baik dengan gigitan ganas.'
  },
  {
    id: 'q5-taktik-kancil',
    level: 'susah',
    clueTitle: 'Peti Keselamatan & Formula Deduksi Kancil',
    clueIcon: 'Lock',
    clueLocationName: 'Peti Besi Rahsia Ejen',
    points: 30,
    narrativeContext: 'Dokumen sulit merungkai formula psikologi yang digunakan Sang Kancil untuk membalikkan keadaan.',
    question: 'Analisis kaedah siasatan Sang Kancil: Mengapakah Sang Kancil berpura-pura tidak percaya dan mengarahkan lakonan semula (re-enactment) situasi asal?',
    options: [
      'Untuk merakam bukti visual lengkap sebelum mendakwa Sang Buaya di mahkamah rimba',
      'Menggunakan muslihat psikologi mencabar ego Sang Buaya agar ia rela dihempap semula kayu tanpa syak, lalu memerangkapnya kembali tanpa kekerasan fizikal',
      'Memberi ruang masa agar Sang Kerbau dapat bersiap sedia menyerang balas menggunakan tanduknya',
      'Kerana Sang Kancil benar-benar meragui kekuatan fizikal Sang Kerbau yang kelihatan bongkok'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sang Kancil sengaja berlagak skeptikal ("berlagak bijak dan tidak percaya") bagi memprovokasi ego Sang Buaya. Buaya yang naif mahu membuktikan kebenaran cerita lalu rela batang kayu besar diletakkan semula ke atas badannya, sekali gus terperangkap kembali tanpa Sang Kancil perlu bertarung.'
  }
];

/**
 * Generates a unique, authentic-looking random certificate code for the agent.
 * Format: EJEN-[RANDOM_4]-[YEAR]-[RANDOM_4] (e.g., EJEN-7K9A-2026-M4P2)
 */
export function generateCertificateCode(agentName: string = ''): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const getRandomChunk = (len: number) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const currentYear = new Date().getFullYear() || 2026;
  const chunk1 = getRandomChunk(4);
  const chunk2 = getRandomChunk(4);

  return `EJEN-${chunk1}-${currentYear}-${chunk2}`;
}

/**
 * Calculates score, analytics breakdown, and performance rating for the agent.
 */
export function evaluatePerformance(
  results: Record<string, QuestionResult>,
  totalDurationSeconds: number
): PerformanceAnalysis {
  let totalScore = 0;
  let correctCount = 0;
  let mudahCorrect = 0;
  let sederhanaCorrect = 0;
  let susahCorrect = 0;

  const answersBreakdown = DETECTIVE_QUESTIONS.map((q) => {
    const res = results[q.id];
    const isCorrect = res ? res.isCorrect : false;
    const points = isCorrect ? q.points : 0;

    if (isCorrect) {
      totalScore += points;
      correctCount += 1;
      if (q.level === 'mudah') mudahCorrect += 1;
      if (q.level === 'sederhana') sederhanaCorrect += 1;
      if (q.level === 'susah') susahCorrect += 1;
    }

    return {
      questionId: q.id,
      level: q.level,
      clueTitle: q.clueTitle,
      isCorrect,
      points,
      maxPoints: q.points
    };
  });

  const maxScore = DETECTIVE_QUESTIONS.reduce((acc, q) => acc + q.points, 0); // 100
  const percentage = Math.round((totalScore / maxScore) * 100);
  const accuracyRate = Math.round((correctCount / DETECTIVE_QUESTIONS.length) * 100);

  // Calculate detailed skill dimensions (0 - 100)
  // Observation (Ketelitian Bukti): based on Q1 and Q2
  const observation = Math.round(((mudahCorrect >= 2 ? 100 : mudahCorrect * 50)));

  // Deduction (Logik Deduktif): based on Q4 and Q5
  const deduction = Math.round(
    ((sederhanaCorrect * 40) + (susahCorrect * 60))
  );

  // Agility / Finger tracking efficiency: time based + correctness
  // Ideal completion time: under 180 seconds (3 mins)
  const timeBonus = Math.max(0, 100 - Math.floor(Math.max(0, totalDurationSeconds - 60) / 3));
  const agility = Math.min(100, Math.round((accuracyRate * 0.6) + (timeBonus * 0.4)));

  // Comprehension (Kefahaman Teks): overall accuracy
  const comprehension = accuracyRate;

  // Formatting time
  const mins = Math.floor(totalDurationSeconds / 60);
  const secs = totalDurationSeconds % 60;
  const timeTakenFormatted = `${mins > 0 ? `${mins}m ` : ''}${secs}s`;

  // Determine Rank & Grade
  let rankTitle = 'Penyiasat Rimba Pelatih';
  let rankGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' = 'C';
  let rankDescription = 'Teruskan usaha mengasah minda detektif dan ketelitian dalam menyiasat fakta kejadian.';

  if (totalScore === 100) {
    rankTitle = 'Ketua Detektif Rimba Elit (Kelas Pertama)';
    rankGrade = 'A+';
    rankDescription = 'Prestasi luar biasa! Analisis anda setaraf kebijaksanaan Sang Kancil. Tiada bukti yang terlepas daripada pandangan anda!';
  } else if (totalScore >= 80) {
    rankTitle = 'Detektif Kanan Forensik Rimba';
    rankGrade = 'A';
    rankDescription = 'Cemerlang! Daya pemerhatian dan logik deduktif yang amat tajam dalam mematahkan helah Sang Buaya.';
  } else if (totalScore >= 60) {
    rankTitle = 'Penyiasat Rimba Berbakat';
    rankGrade = 'B+';
    rankDescription = 'Bagus! Berjaya menguraikan sebahagian besar misteri dengan pergerakan jari dan pemerhatian yang mantap.';
  } else if (totalScore >= 40) {
    rankTitle = 'Ejen Siasatan Kadet';
    rankGrade = 'B';
    rankDescription = 'Memuaskan. Cuba tingkatkan ketepatan analisis terhadap motif dan strategi lakonan semula Sang Kancil.';
  }

  return {
    totalScore,
    maxScore,
    percentage,
    correctCount,
    totalQuestions: DETECTIVE_QUESTIONS.length,
    accuracyRate,
    timeTakenFormatted,
    totalSeconds: totalDurationSeconds,
    rankTitle,
    rankGrade,
    rankDescription,
    metrics: {
      observation,
      deduction,
      agility,
      comprehension
    },
    answersBreakdown
  };
}
