/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VictoryModal } from './VictoryModal';

describe('VictoryModal', () => {
  it('debe mostrar el nombre del ganador', () => {
    render(<VictoryModal winnerLabel="Jugador 1" winnerColor="#e74c3c" onReset={() => {}} />);
    expect(screen.getByText('Jugador 1')).toBeInTheDocument();
  });

  it('debe mostrar el texto "Ganador"', () => {
    render(<VictoryModal winnerLabel="Jugador 1" winnerColor="#e74c3c" onReset={() => {}} />);
    expect(screen.getByText('Ganador')).toBeInTheDocument();
  });

  it('debe mostrar botón "Nuevo Juego"', () => {
    render(<VictoryModal winnerLabel="Jugador 1" winnerColor="#e74c3c" onReset={() => {}} />);
    expect(screen.getByText('Nuevo Juego')).toBeInTheDocument();
  });

  it('debe llamar onReset al hacer click en Nuevo Juego', () => {
    const onReset = vi.fn();
    render(<VictoryModal winnerLabel="Jugador 1" winnerColor="#e74c3c" onReset={onReset} />);
    screen.getByText('Nuevo Juego').click();
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
