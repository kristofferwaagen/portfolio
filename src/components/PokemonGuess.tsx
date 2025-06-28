import React, { useEffect, useState } from 'react';

interface PokemonGuessProps {
  onGameOver: (score: number) => void;
}

interface PokemonData {
  name: string;
  type1: string;
  type2: string | null;
  species: string;
  abilities: string[];
  colour: string;
  height_m: number;
  weight_kg: number;
  evolution_line: string[];
}

type CategoryState = 'correct' | 'close' | 'far' | 'unused';

interface GuessResult {
  pokemon: string;
  type1: CategoryState;
  type2: CategoryState;
  species: CategoryState;
  colour: CategoryState;
  evolution_stage: CategoryState;
  height: CategoryState;
  weight: CategoryState;
}

function getRandomPokemon(pokemonList: PokemonData[]): PokemonData {
  return pokemonList[Math.floor(Math.random() * pokemonList.length)];
}

function isValidPokemon(word: string, pokemonList: PokemonData[]): boolean {
  return pokemonList.some(p => p.name.toLowerCase() === word.toLowerCase());
}

function getEvolutionStage(pokemonName: string, evolutionLine: string[]): number {
  const index = evolutionLine.findIndex(name => name.toLowerCase() === pokemonName.toLowerCase());
  return index >= 0 ? index + 1 : 1;
}

function evaluateGuess(target: PokemonData, guessName: string, pokemonList: PokemonData[]): GuessResult | null {
  const guessedPokemon = pokemonList.find(p => p.name.toLowerCase() === guessName.toLowerCase());
  if (!guessedPokemon) return null;

  const evaluateCategory = (targetValue: string, guessValue: string): CategoryState => {
    if (targetValue.toLowerCase() === guessValue.toLowerCase()) return 'correct';
    if (targetValue.toLowerCase().includes(guessValue.toLowerCase()) || guessValue.toLowerCase().includes(targetValue.toLowerCase())) return 'close';
    return 'far';
  };

  const evaluateNumericCategory = (targetValue: number, guessValue: number): CategoryState => {
    if (targetValue === guessValue) return 'correct';
    const diff = Math.abs(targetValue - guessValue);
    if (diff <= targetValue * 0.1) return 'close';
    return 'far';
  };

  const evaluateEvolutionStage = (targetLine: string[], guessLine: string[], targetName: string, guessName: string): CategoryState => {
    const targetStage = getEvolutionStage(targetName, targetLine);
    const guessStage = getEvolutionStage(guessName, guessLine);
    if (targetStage === guessStage) return 'correct';
    if (Math.abs(targetStage - guessStage) <= 1) return 'close';
    return 'far';
  };

  return {
    pokemon: guessedPokemon.name.toUpperCase(),
    type1: evaluateCategory(target.type1, guessedPokemon.type1),
    type2: evaluateCategory(target.type2 || '', guessedPokemon.type2 || ''),
    species: evaluateCategory(target.species, guessedPokemon.species),
    colour: evaluateCategory(target.colour, guessedPokemon.colour),
    evolution_stage: evaluateEvolutionStage(target.evolution_line, guessedPokemon.evolution_line, target.name, guessedPokemon.name),
    height: evaluateNumericCategory(target.height_m, guessedPokemon.height_m),
    weight: evaluateNumericCategory(target.weight_kg, guessedPokemon.weight_kg)
  };
}

export default function PokemonGuess({ onGameOver }: PokemonGuessProps) {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [targetPokemon, setTargetPokemon] = useState<PokemonData | null>(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = [
    { key: 'type1', label: 'Type 1' },
    { key: 'type2', label: 'Type 2' },
    { key: 'species', label: 'Species' },
    { key: 'colour', label: 'Color' },
    { key: 'evolution_stage', label: 'Evolution' },
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight' }
  ];

  // Check if device is mobile and if in fullscreen mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    const checkFullscreen = () => {
      setIsFullscreen(window.innerWidth >= 1200 && window.innerHeight >= 800);
    };
    checkMobile();
    checkFullscreen();
    window.addEventListener('resize', () => {
      checkMobile();
      checkFullscreen();
    });
    return () => window.removeEventListener('resize', () => {
      checkMobile();
      checkFullscreen();
    });
  }, []);

  useEffect(() => {
    fetch('/platinum_pokemon_data.json')
      .then(res => res.json())
      .then((data: PokemonData[]) => {
        setPokemonList(data);
        setLoading(false);
        const newPoke = getRandomPokemon(data);
        setTargetPokemon(newPoke);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  const handleKeyPress = (key: string) => {
    if (gameOver || loading || !targetPokemon) return;
    if (key === 'ENTER') {
      if (!isValidPokemon(currentGuess, pokemonList)) {
        setMessage('Not a valid Pokémon name');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
      const result = evaluateGuess(targetPokemon, currentGuess, pokemonList);
      if (result) {
        const newGuesses = [...guesses, result];
        setGuesses(newGuesses);
        setCurrentGuess('');
        if (currentGuess.toLowerCase() === targetPokemon.name.toLowerCase()) {
          setGameWon(true);
          setGameOver(true);
          onGameOver(newGuesses.length);
        }
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 20) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if the input field is focused
      if (e.target instanceof HTMLInputElement) {
        return;
      }
      
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, loading, targetPokemon, pokemonList, guesses]);

  const handleRestart = () => {
    if (!pokemonList.length) return;
    const newPoke = getRandomPokemon(pokemonList);
    setTargetPokemon(newPoke);
    setCurrentGuess('');
    setGuesses([]);
    setGameOver(false);
    setGameWon(false);
    setMessage('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const getCategoryColor = (state: CategoryState) => {
    switch (state) {
      case 'correct': return '#00b894';
      case 'close': return '#fdcb6e';
      case 'far': return '#636e72';
      default: return 'transparent';
    }
  };

  const renderGuessRow = (guess: GuessResult, index: number) => {
    // Find the guessed Pokemon's data
    const guessedPokemon = pokemonList.find(p => p.name.toLowerCase() === guess.pokemon.toLowerCase());
    
    // Responsive grid layout - split into 2 rows only on very small screens
    const isVerySmall = window.innerWidth <= 480;
    const gridTemplateColumns = isVerySmall 
      ? '1.5fr 0.8fr 0.8fr 1.2fr' // First row: Pokemon, Type1, Type2, Species
      : isMobile 
        ? '1.5fr 0.8fr 0.8fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr'
        : '2fr 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr';
    
    // Enhanced sizing for fullscreen mode
    const fontSize = isFullscreen ? '1.1rem' : isMobile ? '0.7rem' : '0.8rem';
    const padding = isFullscreen ? '12px 8px' : isMobile ? '6px 2px' : '8px 4px';
    const gap = isFullscreen ? '4px' : isMobile ? '1px' : '2px';
    const maxWidth = isFullscreen ? '1200px' : isMobile ? '95vw' : '600px';

    // Helper function to get arrow indicator for numeric values
    const getArrowIndicator = (category: 'height' | 'weight') => {
      if (!targetPokemon || !guessedPokemon) return '';
      
      const targetValue = category === 'height' ? targetPokemon.height_m : targetPokemon.weight_kg;
      const guessValue = category === 'height' ? guessedPokemon.height_m : guessedPokemon.weight_kg;
      
      if (targetValue > guessValue) return ' ↑';
      if (targetValue < guessValue) return ' ↓';
      return '';
    };

    if (isVerySmall) {
      // Render in 2 rows for very small screens (≤480px)
      return (
        <div key={index} style={{ marginBottom: isMobile ? '4px' : '6px' }}>
          {/* First row: Pokemon, Type1, Type2, Species */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.5fr 0.8fr 0.8fr 1.2fr', 
            gap: gap, 
            marginBottom: '2px',
            maxWidth: maxWidth,
            margin: '0 auto 2px',
            fontSize: fontSize
          }}>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.pokemon === targetPokemon?.name.toUpperCase() ? 'correct' : 'far'),
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guess.pokemon}
            </div>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.type1),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guessedPokemon?.type1 || ''}
            </div>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.type2),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guessedPokemon?.type2 || '-'}
            </div>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.species),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guessedPokemon?.species || ''}
            </div>
          </div>
          
          {/* Second row: Color, Evolution, Height, Weight */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 1fr', 
            gap: gap,
            maxWidth: maxWidth,
            margin: '0 auto',
            fontSize: fontSize
          }}>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.colour),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guessedPokemon?.colour || ''}
            </div>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.evolution_stage),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {getEvolutionStage(guessedPokemon?.name || '', guessedPokemon?.evolution_line || [])}
            </div>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.height),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guessedPokemon?.height_m || 0}m{getArrowIndicator('height')}
            </div>
            <div style={{ 
              padding: padding, 
              background: getCategoryColor(guess.weight),
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {guessedPokemon?.weight_kg || 0}kg{getArrowIndicator('weight')}
            </div>
          </div>
        </div>
      );
    }

    // Regular single row layout for tablets and desktop
    return (
      <div key={index} style={{ 
        display: 'grid', 
        gridTemplateColumns: gridTemplateColumns, 
        gap: gap, 
        marginBottom: isMobile ? '2px' : '4px',
        maxWidth: maxWidth,
        margin: isMobile ? '0 auto 2px' : '0 auto 4px',
        fontSize: fontSize
      }}>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.pokemon === targetPokemon?.name.toUpperCase() ? 'correct' : 'far'),
          color: 'white',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guess.pokemon}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.type1),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guessedPokemon?.type1 || ''}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.type2),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guessedPokemon?.type2 || '-'}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.species),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guessedPokemon?.species || ''}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.colour),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guessedPokemon?.colour || ''}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.evolution_stage),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {getEvolutionStage(guessedPokemon?.name || '', guessedPokemon?.evolution_line || [])}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.height),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guessedPokemon?.height_m || 0}m{getArrowIndicator('height')}
        </div>
        <div style={{ 
          padding: padding, 
          background: getCategoryColor(guess.weight),
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {guessedPokemon?.weight_kg || 0}kg{getArrowIndicator('weight')}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    // Responsive grid layout - split into 2 rows only on very small screens
    const isVerySmall = window.innerWidth <= 480;
    const gridTemplateColumns = isVerySmall 
      ? '1.5fr 0.8fr 0.8fr 1.2fr' // First row: Pokemon, Type1, Type2, Species
      : isMobile 
        ? '1.5fr 0.8fr 0.8fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr'
        : '2fr 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr';
    
    // Enhanced sizing for fullscreen mode
    const fontSize = isFullscreen ? '1.1rem' : isMobile ? '0.7rem' : '0.8rem';
    const padding = isFullscreen ? '12px 8px' : isMobile ? '6px 2px' : '8px 4px';
    const gap = isFullscreen ? '4px' : isMobile ? '1px' : '2px';
    const maxWidth = isFullscreen ? '1200px' : isMobile ? '95vw' : '600px';

    if (isVerySmall) {
      // Render header in 2 rows for very small screens (≤480px)
      return (
        <div style={{ marginBottom: isMobile ? '0.75rem' : '1rem' }}>
          {/* First row header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.5fr 0.8fr 0.8fr 1.2fr', 
            gap: gap, 
            marginBottom: '2px',
            maxWidth: maxWidth,
            margin: '0 auto 2px',
            fontSize: fontSize,
            fontWeight: 'bold'
          }}>
            <div style={{ padding: padding, textAlign: 'center' }}>Pokemon</div>
            <div style={{ padding: padding, textAlign: 'center' }}>Type 1</div>
            <div style={{ padding: padding, textAlign: 'center' }}>Type 2</div>
            <div style={{ padding: padding, textAlign: 'center' }}>Species</div>
          </div>
          
          {/* Second row header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 1fr', 
            gap: gap,
            maxWidth: maxWidth,
            margin: '0 auto',
            fontSize: fontSize,
            fontWeight: 'bold'
          }}>
            <div style={{ padding: padding, textAlign: 'center' }}>Color</div>
            <div style={{ padding: padding, textAlign: 'center' }}>Evo</div>
            <div style={{ padding: padding, textAlign: 'center' }}>Ht</div>
            <div style={{ padding: padding, textAlign: 'center' }}>Wt</div>
          </div>
        </div>
      );
    }

    // Regular single row header for tablets and desktop
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: gridTemplateColumns, 
        gap: gap, 
        marginBottom: isMobile ? '0.75rem' : '1rem',
        maxWidth: maxWidth,
        margin: isMobile ? '0 auto 0.75rem' : '0 auto 1rem',
        fontSize: fontSize,
        fontWeight: 'bold'
      }}>
        <div style={{ padding: padding, textAlign: 'center' }}>Pokemon</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Type 1</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Type 2</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Species</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Color</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Evo</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Ht</div>
        <div style={{ padding: padding, textAlign: 'center' }}>Wt</div>
      </div>
    );
  };

  // Autocomplete functionality
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getSuggestions = (input: string) => {
    if (input.length < 1 || !pokemonList.length) return [];
    
    const filtered = pokemonList
      .filter(p => p.name.toLowerCase().startsWith(input.toLowerCase()))
      .map(p => p.name)
      .slice(0, isMobile ? 6 : 8); // Show fewer suggestions on mobile
    
    return filtered;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentGuess(value);
    
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0 && value.length >= 1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentGuess(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  if (loading) {
    return (
      <div className="pokemon-guess" style={{ textAlign: 'center', padding: isMobile ? '1rem' : '2rem' }}>
        <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: 'var(--text-color)' }}>
          Loading Pokemon Guess Game...
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-guess" style={{ 
      textAlign: 'center', 
      padding: isFullscreen ? '2rem' : isMobile ? '0.5rem' : '1rem',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <h3 style={{ 
        color: 'var(--primary-color)', 
        marginBottom: isFullscreen ? '2rem' : isMobile ? '0.75rem' : '1rem',
        fontSize: isFullscreen ? '2rem' : isMobile ? '1.1rem' : '1.3rem',
        fontWeight: 'bold'
      }}>
        Guess the Pokémon!
      </h3>
      
      {renderHeader()}
      <div style={{ 
        marginBottom: isFullscreen ? '3rem' : isMobile ? '1rem' : '2rem',
        maxWidth: '100%',
        overflow: 'auto'
      }}>
        {guesses.map((guess, index) => renderGuessRow(guess, index))}
      </div>
      {message && (
        <div style={{ 
          color: '#e74c3c', 
          marginBottom: isFullscreen ? '2rem' : isMobile ? '0.75rem' : '1rem', 
          fontSize: isFullscreen ? '1.2rem' : isMobile ? '0.9rem' : '1rem',
          fontWeight: '600',
          padding: isFullscreen ? '1rem' : '0.5rem',
          background: 'rgba(231, 76, 60, 0.1)',
          borderRadius: '8px',
          margin: isFullscreen ? '0 0 2rem' : isMobile ? '0 0.5rem 0.75rem' : '0 0 1rem'
        }}>
          {message}
        </div>
      )}
      <div style={{ 
        marginBottom: isFullscreen ? '3rem' : isMobile ? '1rem' : '2rem', 
        position: 'relative',
        maxWidth: '100%'
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="text"
            value={currentGuess}
            onChange={handleInputChange}
            placeholder={isFullscreen ? "Enter Pokémon name... (auto-suggestions available)" : isMobile ? "Enter Pokémon name..." : "Enter Pokémon name... (auto-suggestions available)"}
            style={{
              padding: isFullscreen ? '16px 20px' : isMobile ? '10px 14px' : '12px 16px',
              fontSize: isFullscreen ? '1.2rem' : isMobile ? '0.9rem' : '1rem',
              border: showSuggestions && suggestions.length > 0 ? '2px solid var(--accent-color)' : '2px solid var(--border-color)',
              borderRadius: '12px',
              background: 'var(--card-background)',
              color: 'var(--text-color)',
              width: isFullscreen ? '500px' : isMobile ? '250px' : '300px',
              maxWidth: '90vw',
              marginBottom: isFullscreen ? '2rem' : isMobile ? '0.75rem' : '1rem',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleKeyPress('ENTER');
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              // Show suggestions when input is focused and there's text
              if (currentGuess.length >= 1) {
                const newSuggestions = getSuggestions(currentGuess);
                setSuggestions(newSuggestions);
                setShowSuggestions(newSuggestions.length > 0);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150);
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--accent-color)',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              fontWeight: 'bold'
            }}>
              ↓
            </div>
          )}
        </div>
        
        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--background-color)',
            border: '2px solid var(--accent-color)',
            borderRadius: isFullscreen ? '12px' : '8px',
            maxHeight: isFullscreen ? '300px' : isMobile ? '150px' : '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            width: isFullscreen ? '500px' : isMobile ? '250px' : '300px',
            maxWidth: '90vw',
            marginTop: '-1rem'
          }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: isFullscreen ? '16px 20px' : isMobile ? '8px 14px' : '10px 16px',
                  cursor: 'pointer',
                  borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                  fontSize: isFullscreen ? '1.1rem' : isMobile ? '0.9rem' : '1rem',
                  color: 'var(--text-color)',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                  e.currentTarget.style.color = 'var(--background-color)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-color)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
        
        <br />
        <button
          onClick={() => handleKeyPress('ENTER')}
          style={{
            background: 'var(--primary-color)',
            color: 'var(--background-color)',
            border: 'none',
            padding: isFullscreen ? '16px 32px' : isMobile ? '10px 20px' : '12px 24px',
            borderRadius: '12px',
            fontSize: isFullscreen ? '1.2rem' : isMobile ? '0.9rem' : '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px',
            marginBottom: isFullscreen ? '1rem' : '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Guess
        </button>
        <button
          onClick={handleRestart}
          style={{
            background: 'var(--accent-color)',
            color: 'var(--background-color)',
            border: 'none',
            padding: isFullscreen ? '16px 32px' : isMobile ? '10px 20px' : '12px 24px',
            borderRadius: '12px',
            fontSize: isFullscreen ? '1.2rem' : isMobile ? '0.9rem' : '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: isFullscreen ? '1rem' : '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          New
        </button>
      </div>
      {(gameOver || gameWon) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--card-background)',
          padding: isFullscreen ? '3rem' : isMobile ? '1.5rem' : '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          maxWidth: isFullscreen ? '600px' : isMobile ? '90vw' : '400px',
          width: isFullscreen ? '600px' : isMobile ? '90vw' : '400px'
        }}>
          <h3 style={{ 
            fontSize: isFullscreen ? '2rem' : isMobile ? '1.2rem' : '1.5rem',
            marginBottom: isFullscreen ? '1.5rem' : '1rem'
          }}>
            {gameWon ? '⚡️ Gotcha!' : '😔 Game Over'}
          </h3>
          <p style={{ 
            marginBottom: isFullscreen ? '2rem' : '1rem',
            fontSize: isFullscreen ? '1.3rem' : isMobile ? '0.9rem' : '1rem'
          }}>
            {gameWon 
              ? `You caught ${targetPokemon?.name} in ${guesses.length} tries!` 
              : `The Pokémon was: ${targetPokemon?.name}`
            }
          </p>
          <button 
            onClick={handleRestart}
            style={{
              background: 'var(--primary-color)',
              color: 'var(--background-color)',
              border: 'none',
              padding: isFullscreen ? '1rem 2rem' : isMobile ? '0.6rem 1.2rem' : '0.75rem 1.5rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isFullscreen ? '1.2rem' : isMobile ? '0.9rem' : '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Play Again
          </button>
        </div>
      )}
      <div style={{ 
        fontSize: isFullscreen ? '1rem' : isMobile ? '0.7rem' : '0.8rem', 
        color: 'var(--text-color-secondary)', 
        marginTop: isFullscreen ? '2rem' : isMobile ? '0.75rem' : '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isFullscreen ? '1rem' : isMobile ? '0.4rem' : '0.5rem',
        padding: isFullscreen ? '0 2rem' : isMobile ? '0 0.5rem' : '0'
      }}>
        <div style={{
          display:'flex',
          alignItems:'center',
          gap: isFullscreen ? '2rem' : isMobile ? '1rem' : '1.5rem',
          flexWrap:'wrap',
          justifyContent:'center'
        }}>
          <span style={{display:'inline-flex',alignItems:'center'}}>
            <span style={{display:'inline-block',width: isFullscreen ? 18 : isMobile ? 12 : 14,height: isFullscreen ? 18 : isMobile ? 12 : 14,background:'#00b894',borderRadius:'50%',marginRight: isFullscreen ? 8 : 4}}></span>
            Correct
          </span>
          <span style={{display:'inline-flex',alignItems:'center'}}>
            <span style={{display:'inline-block',width: isFullscreen ? 18 : isMobile ? 12 : 14,height: isFullscreen ? 18 : isMobile ? 12 : 14,background:'#fdcb6e',borderRadius:'50%',marginRight: isFullscreen ? 8 : 4}}></span>
            Close
          </span>
          <span style={{display:'inline-flex',alignItems:'center'}}>
            <span style={{display:'inline-block',width: isFullscreen ? 18 : isMobile ? 12 : 14,height: isFullscreen ? 18 : isMobile ? 12 : 14,background:'#636e72',borderRadius:'50%',marginRight: isFullscreen ? 8 : 4}}></span>
            Far
          </span>
        </div>
        <div style={{
          display:'flex',
          alignItems:'center',
          gap: isFullscreen ? '2rem' : isMobile ? '1rem' : '1.5rem',
          flexWrap:'wrap',
          justifyContent:'center',
          fontSize: isFullscreen ? '0.9rem' : isMobile ? '0.65rem' : '0.75rem'
        }}>
          <span style={{display:'inline-flex',alignItems:'center'}}>
            <span style={{marginRight: isFullscreen ? 8 : 4, fontSize: isFullscreen ? '1.1rem' : isMobile ? '0.8rem' : '0.9rem'}}>↑</span>
            Higher
          </span>
          <span style={{display:'inline-flex',alignItems:'center'}}>
            <span style={{marginRight: isFullscreen ? 8 : 4, fontSize: isFullscreen ? '1.1rem' : isMobile ? '0.8rem' : '0.9rem'}}>↓</span>
            Lower
          </span>
        </div>
        <div style={{
          textAlign:'center',
          maxWidth: isFullscreen ? '1000px' : isMobile ? '95vw' : '600px',
          fontSize: isFullscreen ? '1rem' : isMobile ? '0.7rem' : '0.8rem'
        }}>
          <p>Type a Pokémon name and press Enter to guess. Use the auto-suggestions to help you find valid Pokémon names!</p>
          <p style={{marginTop: isFullscreen ? '1rem' : '0.5rem', fontSize: isFullscreen ? '0.9rem' : isMobile ? '0.65rem' : '0.75rem', color: 'var(--accent-color)'}}>
            💡 Arrows (↑↓) show if the target height/weight is higher or lower than your guess!
          </p>
        </div>
      </div>
    </div>
  );
} 