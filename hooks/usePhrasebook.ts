import { useState, useEffect } from 'react';
import { TranslationPhrase } from '@/types';

export function usePhrasebook() {
  const [phrases, setPhrases] = useState<TranslationPhrase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('spanish');

  const supportedLanguages = [
    { code: 'spanish', name: 'Spanish' },
    { code: 'french', name: 'French' },
    { code: 'japanese', name: 'Japanese' },
    { code: 'german', name: 'German' },
    { code: 'italian', name: 'Italian' },
  ];

  useEffect(() => {
    setIsLoading(true);
    
    // In a real app, this would come from a backend
    const fetchPhrases = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock phrase data
        const mockPhrases: TranslationPhrase[] = [
          {
            id: '1',
            category: 'emergency',
            english: 'Is this area safe?',
            translations: {
              spanish: '¿Es seguro aquí?',
              french: 'Est-ce sûr ici ?',
              japanese: 'ここは安全ですか？',
              german: 'Ist diese Gegend sicher?',
              italian: 'Questa zona è sicura?',
            },
          },
          {
            id: '2',
            category: 'emergency',
            english: 'Where is the police?',
            translations: {
              spanish: '¿Dónde está la policía?',
              french: 'Où est la police ?',
              japanese: '警察はどこですか？',
              german: 'Wo ist die Polizei?',
              italian: 'Dove è la polizia?',
            },
          },
          {
            id: '3',
            category: 'emergency',
            english: 'I need help',
            translations: {
              spanish: 'Necesito ayuda',
              french: 'J\'ai besoin d\'aide',
              japanese: '助けてください',
              german: 'Ich brauche Hilfe',
              italian: 'Ho bisogno di aiuto',
            },
          },
          {
            id: '4',
            category: 'health',
            english: 'Where is the hospital?',
            translations: {
              spanish: '¿Dónde está el hospital?',
              french: 'Où est l\'hôpital ?',
              japanese: '病院はどこですか？',
              german: 'Wo ist das Krankenhaus?',
              italian: 'Dov\'è l\'ospedale?',
            },
          },
          {
            id: '5',
            category: 'general',
            english: 'Thank you',
            translations: {
              spanish: 'Gracias',
              french: 'Merci',
              japanese: 'ありがとう',
              german: 'Danke',
              italian: 'Grazie',
            },
          },
          {
            id: '6',
            category: 'transportation',
            english: 'How do I get to...?',
            translations: {
              spanish: '¿Cómo llego a...?',
              french: 'Comment puis-je me rendre à... ?',
              japanese: '...にはどうやって行きますか？',
              german: 'Wie komme ich zu...?',
              italian: 'Come arrivo a...?',
            },
          },
          {
            id: '7',
            category: 'transportation',
            english: 'Is this taxi safe?',
            translations: {
              spanish: '¿Es seguro este taxi?',
              french: 'Ce taxi est-il sûr ?',
              japanese: 'このタクシーは安全ですか？',
              german: 'Ist dieses Taxi sicher?',
              italian: 'Questo taxi è sicuro?',
            },
          },
          {
            id: '8',
            category: 'accommodation',
            english: 'Is this neighborhood safe at night?',
            translations: {
              spanish: '¿Es seguro este vecindario por la noche?',
              french: 'Ce quartier est-il sûr la nuit ?',
              japanese: 'この地域は夜間も安全ですか？',
              german: 'Ist diese Nachbarschaft nachts sicher?',
              italian: 'Questo quartiere è sicuro di notte?',
            },
          },
        ];
        
        setPhrases(mockPhrases);
      } catch (err) {
        setError('Failed to fetch phrases');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhrases();
  }, []);

  return { 
    phrases, 
    isLoading, 
    error,
    selectedLanguage,
    setSelectedLanguage,
    supportedLanguages
  };
}