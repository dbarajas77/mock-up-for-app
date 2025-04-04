import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Line, Point } from './types';

interface DrawingCanvasProps {
  isDrawingMode: boolean;
  drawings: Line[];
  currentLine: Point[];
  drawingColor: string;
  drawingWidth: number;
  canvasHeight: number;
  canvasWidth: number;
  panHandlers: any;
  toggleDrawingMode: () => void;
  setDrawingColor: (color: string) => void;
  clearDrawings: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  isDrawingMode,
  drawings,
  currentLine,
  drawingColor,
  drawingWidth,
  canvasHeight,
  canvasWidth,
  panHandlers,
  toggleDrawingMode,
  setDrawingColor,
  clearDrawings
}) => {
  return (
    <View style={styles.container}>
      {/* Drawing Canvas Overlay */}
      <View 
        style={[
          styles.drawingCanvas, 
          { 
            height: canvasHeight,
            width: canvasWidth,
          }
        ]} 
        pointerEvents={isDrawingMode ? 'auto' : 'none'}
        {...panHandlers}
      >
        {/* Render existing lines */}
        {drawings.map((line, lineIndex) => (
          <View key={`line-${lineIndex}`} style={styles.lineContainer}>
            {line.points.map((point, pointIndex) => (
              pointIndex > 0 && (
                <View 
                  key={`point-${pointIndex}`}
                  style={[
                    styles.line,
                    {
                      left: line.points[pointIndex - 1].x,
                      top: line.points[pointIndex - 1].y,
                      width: Math.sqrt(
                        Math.pow(point.x - line.points[pointIndex - 1].x, 2) + 
                        Math.pow(point.y - line.points[pointIndex - 1].y, 2)
                      ),
                      height: line.width,
                      backgroundColor: line.color,
                      transform: [
                        {
                          rotate: `${Math.atan2(
                            point.y - line.points[pointIndex - 1].y,
                            point.x - line.points[pointIndex - 1].x
                          )}rad`
                        }
                      ]
                    }
                  ]}
                />
              )
            ))}
          </View>
        ))}
        
        {/* Render current line */}
        {currentLine.length > 1 && (
          <View style={styles.lineContainer}>
            {currentLine.map((point, pointIndex) => (
              pointIndex > 0 && (
                <View 
                  key={`current-point-${pointIndex}`}
                  style={[
                    styles.line,
                    {
                      left: currentLine[pointIndex - 1].x,
                      top: currentLine[pointIndex - 1].y,
                      width: Math.sqrt(
                        Math.pow(point.x - currentLine[pointIndex - 1].x, 2) + 
                        Math.pow(point.y - currentLine[pointIndex - 1].y, 2)
                      ),
                      height: drawingWidth,
                      backgroundColor: drawingColor,
                      transform: [
                        {
                          rotate: `${Math.atan2(
                            point.y - currentLine[pointIndex - 1].y,
                            point.x - currentLine[pointIndex - 1].x
                          )}rad`
                        }
                      ]
                    }
                  ]}
                />
              )
            ))}
          </View>
        )}
      </View>
      
      {/* Drawing Controls */}
      <View style={styles.drawingControls}>
        <TouchableOpacity 
          style={[
            styles.drawingButton,
            isDrawingMode && styles.activeDrawingButton
          ]}
          onPress={toggleDrawingMode}
          activeOpacity={0.7}
        >
          <Feather 
            name="edit-2" 
            size={24} 
            color={isDrawingMode ? "#fff" : "#374151"} 
          />
        </TouchableOpacity>
        
        {isDrawingMode && (
          <>
            <TouchableOpacity 
              style={[
                styles.colorButton, 
                { backgroundColor: '#FF0000' },
                drawingColor === '#FF0000' && { borderColor: '#2563eb' }
              ]}
              onPress={() => setDrawingColor('#FF0000')}
              activeOpacity={0.7}
            />
            <TouchableOpacity 
              style={[
                styles.colorButton, 
                { backgroundColor: '#00FF00' },
                drawingColor === '#00FF00' && { borderColor: '#2563eb' }
              ]}
              onPress={() => setDrawingColor('#00FF00')}
              activeOpacity={0.7}
            />
            <TouchableOpacity 
              style={[
                styles.colorButton, 
                { backgroundColor: '#0000FF' },
                drawingColor === '#0000FF' && { borderColor: '#2563eb' }
              ]}
              onPress={() => setDrawingColor('#0000FF')}
              activeOpacity={0.7}
            />
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearDrawings}
              activeOpacity={0.7}
            >
              <Feather name="trash-2" size={20} color="#374151" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  drawingCanvas: {
    position: 'absolute',
    backgroundColor: 'transparent',
    pointerEvents: 'auto',
    zIndex: 2,
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
  },
  lineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    pointerEvents: 'none',
  },
  line: {
    position: 'absolute',
    backgroundColor: 'red',
    transformOrigin: 'left center',
  },
  drawingControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activeDrawingButton: {
    backgroundColor: '#2563eb',
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
});

export default DrawingCanvas;
