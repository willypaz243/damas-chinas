/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TurnIndicator } from './TurnIndicator';
import type { PlayerConfig, PlayerId } from '../../engine/types';

describe('TurnIndicator', () => {
  const player1: PlayerConfig = {
    id: 1 as PlayerId,
    color: '#e74c3c',
    label: 'Jugador 1',
    piecesInTarget: 0,
    pointIndex: 0,
  };

  const player2: PlayerConfig = {
    id: 2 as PlayerId,
    color: '#3498db',
    label: 'Jugador 2',
    piecesInTarget: 0,
    pointIndex: 1,
  };

  it('debe mostrar el nombre del jugador actual', () => {
    render(<TurnIndicator currentPlayer={player1} />);
    expect(screen.getByText('Jugador 1')).toBeInTheDocument();
  });

  it('debe mostrar "Turno de:" en el texto', () => {
    render(<TurnIndicator currentPlayer={player1} />);
    expect(screen.getByText(/Turno de:/)).toBeInTheDocument();
  });

  it('debe reflejar el cambio de jugador', () => {
    const { rerender } = render(<TurnIndicator currentPlayer={player1} />);
    expect(screen.getByText('Jugador 1')).toBeInTheDocument();

    rerender(<TurnIndicator currentPlayer={player2} />);
    expect(screen.getByText('Jugador 2')).toBeInTheDocument();
  });
});
