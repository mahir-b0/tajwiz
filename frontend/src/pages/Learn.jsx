import { useState } from 'react'
import './Learn.css'

const CONTENT = [
  {
    id: 'noon_sakinah',
    title: 'Noon Sakinah',
    arabic: 'النون الساكنة',
    intro: 'When a noon with a sukoon (نْ) or tanween is followed by another letter, one of four rules applies depending on that letter.',
    rules: [
      {
        name: 'Ithaar',
        arabic: 'إظهار',
        subtitle: 'Clear pronunciation',
        color: '#c9a84c',
        description: 'The noon is pronounced clearly without any ghunnah (nasalisation). Applies when followed by one of the six throat letters.',
        letters: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'],
        lettersLabel: 'Throat letters (حروف الحلق)',
        example: { word: 'مَنْ آمَنَ', transliteration: "man aamana", note: 'Noon followed by ء - clear noon' },
      },
      {
        name: 'Idghaam',
        arabic: 'إدغام',
        subtitle: 'Merging',
        color: '#c9a84c',
        description: 'The noon merges into the following letter. Idghaam has two types:',
        subtypes: [
          {
            name: 'Idghaam with Ghunnah',
            arabic: 'إدغام بغنة',
            letters: ['ي', 'ن', 'م', 'و'],
            lettersLabel: 'Remembered as يَنْمُو',
            example: { word: 'مِنْ يَعْمَلُ', transliteration: 'min ya\'malu', note: 'Noon merges into ي with nasalisation' },
          },
          {
            name: 'Idghaam without Ghunnah',
            arabic: 'إدغام بلا غنة',
            letters: ['ل', 'ر'],
            lettersLabel: 'Only ل and ر',
            example: { word: 'مِنْ رَبِّهِمْ', transliteration: 'min rabbihim', note: 'Noon merges into ر with no nasalisation' },
          },
        ],
      },
      {
        name: 'Iqlaab',
        arabic: 'إقلاب',
        subtitle: 'Conversion',
        color: '#c9a84c',
        description: 'The noon is converted into a meem (م) sound, pronounced with ghunnah and slight concealment. Applies only when followed by ب.',
        letters: ['ب'],
        lettersLabel: 'Only one letter',
        example: { word: 'مِنْ بَعْدِ', transliteration: "min ba'di", note: 'Noon becomes meem before ب' },
      },
      {
        name: 'Ikhfaa',
        arabic: 'إخفاء',
        subtitle: 'Concealment',
        color: '#c9a84c',
        description: 'The noon is partially concealed - neither fully pronounced nor fully merged. Pronounced with ghunnah. Applies to all remaining 15 letters.',
        letters: ['ت','ث','ج','د','ذ','ز','س','ش','ص','ض','ط','ظ','ف','ق','ك'],
        lettersLabel: 'The remaining 15 letters',
        example: { word: 'أَنْتُمْ', transliteration: 'antum', note: 'Noon concealed before ت' },
      },
    ],
  },
  {
    id: 'qalqalah',
    title: 'Qalqalah',
    arabic: 'القلقلة',
    intro: 'Qalqalah is an echoing or bouncing sound produced when one of the five qalqalah letters carries a sukoon. The strength of the bounce depends on position.',
    rules: [
      {
        name: 'The Five Letters',
        arabic: 'حروف القلقلة',
        subtitle: 'Remembered as قُطُبُ جَدٍّ',
        color: '#c9a84c',
        description: 'Only these five letters produce Qalqalah when they carry a sukoon. Any other letter with a sukoon does not have Qalqalah.',
        letters: ['ق', 'ط', 'ب', 'ج', 'د'],
        lettersLabel: 'قُطُبُ جَدٍّ',
        example: { word: 'يَجْعَلُ', transliteration: "yaj'alu", note: 'ج has a sukoon - Qalqalah applies' },
      },
      {
        name: 'Qalqalah Sughra',
        arabic: 'قلقلة صغرى',
        subtitle: 'Minor - weakest bounce',
        color: '#c9a84c',
        description: 'When a qalqalah letter has a sukoon in the middle of a word (original sukoon, not due to stopping). The bounce is subtle.',
        letters: [],
        lettersLabel: 'Position: middle of word',
        example: { word: 'يَبْسُطُ', transliteration: 'yabsutu', note: 'ب has a sukoon mid-word - Sughra' },
      },
      {
        name: 'Qalqalah Wusta',
        arabic: 'قلقلة وسطى',
        subtitle: 'Middle - medium bounce',
        color: '#c9a84c',
        description: 'When stopping on a word that ends with a qalqalah letter that has no shaddah. The sukoon is caused by stopping (waqf), making the bounce stronger.',
        letters: [],
        lettersLabel: 'Position: end of word, no shaddah',
        example: { word: 'أَحَدٌ', transliteration: 'ahad (when stopping)', note: 'د at end with no shaddah - Wusta' },
      },
      {
        name: 'Qalqalah Kubra',
        arabic: 'قلقلة كبرى',
        subtitle: 'Major - strongest bounce',
        color: '#c9a84c',
        description: 'When stopping on a word that ends with a qalqalah letter that has a shaddah. The shaddah intensifies the bounce significantly.',
        letters: [],
        lettersLabel: 'Position: end of word, with shaddah',
        example: { word: 'الْحَقُّ', transliteration: 'al-haqq (when stopping)', note: 'ق has shaddah at end - Kubra' },
      },
    ],
  },
  {
    id: 'waqf',
    title: 'Waqf Signs',
    arabic: 'علامات الوقف',
    intro: 'Waqf signs appear above or beside words in the Quran to guide the reciter on where to stop, continue, or pause.',
    rules: [
      {
        name: 'م - Waqf Laazim',
        arabic: 'وقف لازم',
        subtitle: 'Compulsory stop',
        color: '#c9a84c',
        description: 'You must stop here. Continuing without stopping would distort or reverse the meaning of the ayah.',
        letters: ['م'],
        lettersLabel: 'Sign',
        example: { word: 'م', transliteration: 'Meem', note: 'Must stop - the meaning depends on it' },
      },
      {
        name: 'لا - Waqf Mamnoo',
        arabic: 'وقف ممنوع',
        subtitle: 'Forbidden stop',
        color: '#c9a84c',
        description: 'Do not stop here. Stopping would break the meaning or create a wrong impression. You must continue.',
        letters: ['لا'],
        lettersLabel: 'Sign',
        example: { word: 'لا', transliteration: 'Laa', note: 'Do not stop - continue reciting' },
      },
      {
        name: 'ج - Waqf Jaa\'iz',
        arabic: 'وقف جائز',
        subtitle: 'Permissible stop',
        color: '#c9a84c',
        description: 'Stopping or continuing are both acceptable. Neither changes the meaning significantly.',
        letters: ['ج'],
        lettersLabel: 'Sign',
        example: { word: 'ج', transliteration: 'Jeem', note: 'Your choice - both are fine' },
      },
      {
        name: 'ط - Waqf Mutlaq',
        arabic: 'وقف مطلق',
        subtitle: 'Preferred stop',
        color: '#c9a84c',
        description: 'Stopping is preferred here, though continuing is also permitted.',
        letters: ['ط'],
        lettersLabel: 'Sign',
        example: { word: 'ط', transliteration: 'Taa', note: 'Better to stop here' },
      },
      {
        name: 'ص - Waqf Murakhkhas',
        arabic: 'وقف مرخص',
        subtitle: 'Permitted only if necessary',
        color: '#c9a84c',
        description: 'You may stop here only if out of breath. Continuing is preferred. This sign acknowledges human limitation.',
        letters: ['ص'],
        lettersLabel: 'Sign',
        example: { word: 'ص', transliteration: 'Saad', note: 'Only stop if you need to breathe' },
      },
      {
        name: 'قلي - Al-Waqf Al-Awla',
        arabic: 'الوقف أولى',
        subtitle: 'Stopping is slightly preferred',
        color: '#c9a84c',
        description: 'Stopping is slightly better than continuing, though both are valid.',
        letters: ['قلي'],
        lettersLabel: 'Sign',
        example: { word: 'قلي', transliteration: 'Qaaf Laam Ya', note: 'Lean toward stopping' },
      },
      {
        name: 'صلي - Al-Wasl Al-Awla',
        arabic: 'الوصل أولى',
        subtitle: 'Continuing is slightly preferred',
        color: '#c9a84c',
        description: 'Continuing without stopping is slightly better, though stopping is also valid.',
        letters: ['صلي'],
        lettersLabel: 'Sign',
        example: { word: 'صلي', transliteration: 'Saad Laam Ya', note: 'Lean toward continuing' },
      },
      {
        name: '∴ - Mo\'aanaqah',
        arabic: 'معانقة',
        subtitle: 'Linked stops',
        color: '#c9a84c',
        description: 'Three dots appear in two places in the same ayah. Stop at one but not both - the meaning connects in both directions.',
        letters: ['∴'],
        lettersLabel: 'Sign',
        example: { word: '∴ ∴', transliteration: "Two sets of three dots", note: 'Stop at one set only' },
      },
    ],
  },
]

export default function Learn() {
  const [activeTopicId, setActiveTopicId] = useState('noon_sakinah')
  const activeTopic = CONTENT.find(t => t.id === activeTopicId)

  return (
    <main className="learn-page">
      {/* Topic tabs */}
      <div className="learn-tabs">
        {CONTENT.map(topic => (
          <button
            key={topic.id}
            className={`learn-tab ${activeTopicId === topic.id ? 'active' : ''}`}
            onClick={() => setActiveTopicId(topic.id)}
          >
            <span className="learn-tab-arabic">{topic.arabic}</span>
            <span className="learn-tab-label">{topic.title}</span>
          </button>
        ))}
      </div>

      {/* Topic header */}
      <header className="learn-header">
        <p className="learn-arabic">{activeTopic.arabic}</p>
        <h1 className="learn-title">{activeTopic.title}</h1>
        <p className="learn-intro">{activeTopic.intro}</p>
      </header>

      {/* Rule cards */}
      <div className="rules-grid">
        {activeTopic.rules.map((rule, i) => (
          <div key={i} className="rule-card">
            <div className="rule-card-header">
              <div className="rule-name-row">
                <h2 className="rule-name">{rule.name}</h2>
                <p className="rule-arabic">{rule.arabic}</p>
              </div>
              <span className="rule-subtitle">{rule.subtitle}</span>
            </div>

            <p className="rule-description">{rule.description}</p>

            {/* Subtypes (Idghaam) */}
            {rule.subtypes && (
              <div className="rule-subtypes">
                {rule.subtypes.map((sub, j) => (
                  <div key={j} className="subtype-card">
                    <div className="subtype-header">
                      <span className="subtype-name">{sub.name}</span>
                      <span className="subtype-arabic">{sub.arabic}</span>
                    </div>
                    <div className="letters-row">
                      {sub.letters.map(l => (
                        <span key={l} className="letter-chip">{l}</span>
                      ))}
                    </div>
                    <p className="subtype-letters-label">{sub.lettersLabel}</p>
                    <div className="rule-example">
                      <span className="example-word">{sub.example.word}</span>
                      <span className="example-note">{sub.example.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Letters */}
            {!rule.subtypes && rule.letters && rule.letters.length > 0 && (
              <div className="letters-section">
                <p className="letters-label">{rule.lettersLabel}</p>
                <div className="letters-row">
                  {rule.letters.map(l => (
                    <span key={l} className="letter-chip">{l}</span>
                  ))}
                </div>
              </div>
            )}

            {!rule.subtypes && rule.lettersLabel && rule.letters && rule.letters.length === 0 && (
              <div className="letters-section">
                <p className="letters-label">{rule.lettersLabel}</p>
              </div>
            )}

            {/* Example */}
            {!rule.subtypes && rule.example && (
              <div className="rule-example">
                <span className="example-word">{rule.example.word}</span>
                <span className="example-note">{rule.example.note}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}