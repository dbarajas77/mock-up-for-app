/**
 * Shared types for the annotations components
 */

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  points: Point[];
  color: string;
  width: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export interface DrawingState {
  lines: Line[];
  currentLine: Point[];
}
